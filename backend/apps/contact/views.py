from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.translation import gettext as _
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
import logging
from .models import ContactMessage, ContactInfo, \
    NewsletterSubscription, SubscriberSegment, NewsletterTemplate, \
    NewsletterCampaign, EmailDelivery, LinkClick, NewsletterAutomation, AutomationStep, \
    AutomationExecution, SubscriberSegmentMembership
from .serializers import ContactMessageSerializer, ContactInfoSerializer, \
    NewsletterSubscriptionSerializer, \
    SubscriberSegmentSerializer, NewsletterTemplateSerializer, NewsletterCampaignSerializer, \
    EmailDeliverySerializer, NewsletterAutomationSerializer, AutomationStepSerializer, \
    ConfirmSubscriptionSerializer, UnsubscribeSerializer
from django.shortcuts import render, redirect
from rest_framework.decorators import api_view, action
from rest_framework.views import APIView
from django.utils.translation import get_language
from django.utils import timezone
import uuid
import threading
import re
from urllib.parse import quote_plus
from django.http import HttpResponse
from django.urls import reverse
from django.http import HttpResponseRedirect
import base64

# Set up logger
logger = logging.getLogger(__name__)

class ContactViewSet(viewsets.GenericViewSet):
    """
    API endpoint for contact form submissions.
    Allows only creating new messages, not viewing or editing them.
    Rate limited to 100 requests per hour per IP address to prevent abuse.
    """
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]
    
    @method_decorator(ratelimit(key='ip', rate='100/h', method='POST', block=True))
    def create(self, request, *args, **kwargs):
        """Handle contact form submission with enhanced error handling and logging"""
        # Get language preference
        lang = request.query_params.get('lang', 'en')
        
        try:
            serializer = self.get_serializer(data=request.data)
            
            if serializer.is_valid():
                # Save the message to the database
                contact_message = serializer.save()
                logger.info(f"Contact message received from {contact_message.email}")
                
                try:
                    # Send email notification to admin
                    self._send_admin_notification(contact_message, lang)
                    
                    # Send confirmation email to client
                    self._send_client_confirmation(contact_message, lang)
                except Exception as e:
                    # Log the error but don't return an error to the user
                    logger.error(f"Error sending notification email: {e}")
                
                return Response(
                    {"message": _("Your message has been sent successfully!")},
                    status=status.HTTP_201_CREATED
                )
            
            logger.warning(f"Invalid contact form submission: {serializer.errors}")
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )
        
        except Exception as e:
            logger.error(f"Contact submission error: {str(e)}")
            error_message = _("An error occurred processing your request") if lang == 'en' else _("حدث خطأ أثناء معالجة طلبك")
            return Response(
                {"error": error_message}, 
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def _send_admin_notification(self, contact_message, lang='en'):
        """Send notification email to admin"""
        subject = f"New Contact Message from {contact_message.name}"
        
        # Create email context
        context = {
            'name': contact_message.name,
            'email': contact_message.email,
            'phone': contact_message.phone,
            'message': contact_message.message,
            'created_at': contact_message.created_at,
            'lang': lang  # Pass language preference to templates
        }
        
        # Render email templates
        html_message = render_to_string('contact/email_notification.html', context)
        plain_message = render_to_string('contact/email_notification.txt', context)
        
        # Get recipients from settings or use default
        recipients = getattr(settings, 'CONTACT_NOTIFICATION_EMAILS', ['info@archwaydesign.com'])
        
        # Send email
        send_mail(
            subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            recipients,
            html_message=html_message,
            fail_silently=False
        )
        
        logger.info(f"Admin notification email sent for contact message from {contact_message.email}")
    
    def _send_client_confirmation(self, contact_message, lang='en'):
        """Send confirmation email to client"""
        # Determine subject based on language
        subject = "Thank you for contacting Archway Design" if lang == 'en' else "شكراً للتواصل مع آركواي للتصميم"
        
        # Create email context
        context = {
            'name': contact_message.name,
            'lang': lang  # Pass language preference to templates
        }
        
        # Render email templates
        html_message = render_to_string('contact/client_confirmation.html', context)
        plain_message = render_to_string('contact/client_confirmation.txt', context)
        
        # Send email to client
        send_mail(
            subject,
            plain_message,
            settings.DEFAULT_FROM_EMAIL,
            [contact_message.email],
            html_message=html_message,
            fail_silently=False
        )
        
        logger.info(f"Client confirmation email sent to {contact_message.email}")

class ContactInfoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for retrieving company contact information.
    Read-only access to contact info that is manageable through the admin interface.
    """
    serializer_class = ContactInfoSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None  # Disable pagination for this endpoint
    
    def get_queryset(self):
        """Always return most recently updated record only"""
        return ContactInfo.objects.all().order_by('-updated_at')[:1]
        
    def list(self, request):
        """Return a non-paginated response with just the contact info object"""
        queryset = self.get_queryset()
        if queryset:
            serializer = self.get_serializer(queryset[0])
            return Response(serializer.data)
        return Response({}, status=status.HTTP_404_NOT_FOUND)

class ContactMessageViewSet(viewsets.ModelViewSet):
    """API endpoint for contact form submissions"""
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ['post']  # Only allow POST requests for contact form

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Add IP address if available
            if 'ip_address' not in serializer.validated_data and request.META.get('REMOTE_ADDR'):
                serializer.validated_data['ip_address'] = request.META.get('REMOTE_ADDR')
            
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NewsletterSubscriptionViewSet(viewsets.ModelViewSet):
    """API endpoint for newsletter subscriptions"""
    queryset = NewsletterSubscription.objects.all()
    serializer_class = NewsletterSubscriptionSerializer
    permission_classes = [permissions.AllowAny]
    http_method_names = ['post', 'get', 'delete']  # Allow viewing and deleting too
    
    def get_permissions(self):
        """Only allow admin users to list subscribers"""
        if self.action in ['list', 'retrieve']:
            return [permissions.IsAdminUser()]
        return super().get_permissions()
    
    def create(self, request, *args, **kwargs):
        """Handle newsletter subscription with confirmation email"""
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            language_preference = serializer.validated_data.get('language_preference', 'en')
            
            # Check if email already exists but is not confirmed
            existing = NewsletterSubscription.objects.filter(email=email)
            if existing.exists():
                subscription = existing.first()
                
                if subscription.confirmed:
                    return Response(
                        {"detail": "Email already subscribed."},
                        status=status.HTTP_400_BAD_REQUEST
                    )
                
                # Update the existing subscription
                subscription.language_preference = language_preference
                if 'first_name' in serializer.validated_data:
                    subscription.first_name = serializer.validated_data['first_name']
                if 'last_name' in serializer.validated_data:
                    subscription.last_name = serializer.validated_data['last_name']
                
                # Generate new confirmation token
                subscription.confirmation_token = uuid.uuid4()
                subscription.save()
            else:
                # Create new subscription
                subscription = serializer.save()
            
            # Send confirmation email
            try:
                self._send_confirmation_email(subscription)
                
                # Check for welcome automation
                self._trigger_subscription_automation(subscription)
                
                return Response(
                    {"detail": "Please check your email to confirm your subscription."},
                    status=status.HTTP_201_CREATED
                )
            except Exception as e:
                logger.error(f"Failed to send confirmation email: {str(e)}")
                return Response(
                    {"detail": "Subscription saved but could not send confirmation email."},
                    status=status.HTTP_201_CREATED
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def _send_confirmation_email(self, subscription):
        """Send confirmation email to subscriber"""
        # Check if we have a confirmation template
        try:
            template = NewsletterTemplate.objects.get(
                type='confirmation',
                is_active=True
            )
            
            # Get the appropriate language content
            lang = subscription.language_preference
            subject = getattr(template, f'subject_{lang}') or template.subject_en
            content = getattr(template, f'content_{lang}') or template.content_en
            
            # Replace placeholders in the template
            content = content.replace('{{token}}', str(subscription.confirmation_token))
            content = content.replace('{{email}}', subscription.email)
            content = content.replace('{{first_name}}', subscription.first_name or '')
            
            # Send the email
            send_mail(
                subject,
                content,  # Plain text version
                settings.DEFAULT_FROM_EMAIL,
                [subscription.email],
                html_message=content,  # HTML version (same as plain for now)
                fail_silently=False
            )
            
            logger.info(f"Confirmation email sent to {subscription.email}")
            
        except NewsletterTemplate.DoesNotExist:
            # Fallback to a basic confirmation email
            confirmation_url = f"{settings.FRONTEND_URL}/confirm-subscription?token={subscription.confirmation_token}"
            
            subject = "Confirm your newsletter subscription" if lang == 'en' else "تأكيد الاشتراك في النشرة الإخبارية"
            
            message = f"Please confirm your subscription by clicking this link: {confirmation_url}"
            if lang == 'ar':
                message = f"يرجى تأكيد اشتراكك بالنقر على هذا الرابط: {confirmation_url}"
            
            send_mail(
                subject,
                message,
                settings.DEFAULT_FROM_EMAIL,
                [subscription.email],
                fail_silently=False
            )
            
            logger.info(f"Basic confirmation email sent to {subscription.email}")
    
    def _trigger_subscription_automation(self, subscription):
        """Trigger any automations for new subscriptions"""
        automations = NewsletterAutomation.objects.filter(
            trigger_type='subscription',
            is_active=True
        )
        
        for automation in automations:
            # Create an automation execution
            execution = AutomationExecution.objects.create(
                automation=automation,
                subscriber=subscription,
                status='pending'
            )
            
            # If there are steps, schedule the first one
            if automation.steps.filter(is_active=True).exists():
                first_step = automation.steps.filter(is_active=True).order_by('order').first()
                execution.current_step = first_step
                
                # Calculate when to send first step based on delay
                if automation.delay_days > 0:
                    execution.next_step_scheduled_at = timezone.now() + timezone.timedelta(days=automation.delay_days)
                else:
                    execution.next_step_scheduled_at = timezone.now()
                
                execution.save()
                
                logger.info(f"Subscription automation '{automation.name}' triggered for {subscription.email}")
    
    @action(detail=False, methods=['post'])
    def confirm(self, request):
        """Confirm a subscription using the token"""
        serializer = ConfirmSubscriptionSerializer(data=request.data)
        
        if serializer.is_valid():
            token = serializer.validated_data['token']
            
            try:
                subscription = NewsletterSubscription.objects.get(
                    confirmation_token=token,
                    confirmed=False
                )
                
                # Confirm the subscription
                subscription.confirmed = True
                subscription.save()
                
                # Trigger confirmation automations
                self._trigger_confirmation_automation(subscription)
                
                return Response(
                    {"detail": "Subscription confirmed successfully."},
                    status=status.HTTP_200_OK
                )
            except NewsletterSubscription.DoesNotExist:
                return Response(
                    {"detail": "Invalid or expired token."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def _trigger_confirmation_automation(self, subscription):
        """Trigger automations for confirmed subscriptions"""
        automations = NewsletterAutomation.objects.filter(
            trigger_type='confirmation',
            is_active=True
        )
        
        for automation in automations:
            # Create an automation execution
            execution = AutomationExecution.objects.create(
                automation=automation,
                subscriber=subscription,
                status='pending'
            )
            
            # If there are steps, schedule the first one
            if automation.steps.filter(is_active=True).exists():
                first_step = automation.steps.filter(is_active=True).order_by('order').first()
                execution.current_step = first_step
                
                # Calculate when to send first step based on delay
                if automation.delay_days > 0:
                    execution.next_step_scheduled_at = timezone.now() + timezone.timedelta(days=automation.delay_days)
                else:
                    execution.next_step_scheduled_at = timezone.now()
                
                execution.save()
                
                logger.info(f"Confirmation automation '{automation.name}' triggered for {subscription.email}")
    
    @action(detail=False, methods=['post'])
    def unsubscribe(self, request):
        """Unsubscribe from newsletters"""
        serializer = UnsubscribeSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            try:
                subscription = NewsletterSubscription.objects.get(
                    email=email,
                    is_active=True
                )
                
                # Deactivate rather than delete
                subscription.is_active = False
                subscription.save()
                
                return Response(
                    {"detail": "Successfully unsubscribed from newsletters."},
                    status=status.HTTP_200_OK
                )
            except NewsletterSubscription.DoesNotExist:
                return Response(
                    {"detail": "Email not found in our subscription list."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SubscriberSegmentViewSet(viewsets.ModelViewSet):
    """API endpoint for managing subscriber segments"""
    queryset = SubscriberSegment.objects.all()
    serializer_class = SubscriberSegmentSerializer
    permission_classes = [permissions.IsAdminUser]
    
    @action(detail=True, methods=['post'])
    def add_subscribers(self, request, pk=None):
        """Add subscribers to a segment"""
        segment = self.get_object()
        
        # Check for subscriber IDs in request
        subscriber_ids = request.data.get('subscriber_ids', [])
        if not subscriber_ids:
            return Response(
                {"detail": "No subscriber IDs provided."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get valid subscribers
        subscribers = NewsletterSubscription.objects.filter(
            id__in=subscriber_ids,
            is_active=True,
            confirmed=True
        )
        
        # Add to segment
        added = 0
        for subscriber in subscribers:
            _, created = SubscriberSegmentMembership.objects.get_or_create(
                segment=segment,
                subscriber=subscriber
            )
            if created:
                added += 1
                
                # Trigger segment-based automations
                automations = NewsletterAutomation.objects.filter(
                    trigger_type='segment_added',
                    segment=segment,
                    is_active=True
                )
                
                for automation in automations:
                    # Create automation execution
                    AutomationExecution.objects.create(
                        automation=automation,
                        subscriber=subscriber,
                        status='pending',
                        next_step_scheduled_at=timezone.now() + timezone.timedelta(days=automation.delay_days)
                    )
        
        return Response(
            {"detail": f"Added {added} subscribers to segment."},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def remove_subscribers(self, request, pk=None):
        """Remove subscribers from a segment"""
        segment = self.get_object()
        
        # Check for subscriber IDs in request
        subscriber_ids = request.data.get('subscriber_ids', [])
        if not subscriber_ids:
            return Response(
                {"detail": "No subscriber IDs provided."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Remove from segment
        deleted, _ = SubscriberSegmentMembership.objects.filter(
            segment=segment,
            subscriber_id__in=subscriber_ids
        ).delete()
        
        return Response(
            {"detail": f"Removed {deleted} subscribers from segment."},
            status=status.HTTP_200_OK
        )

class NewsletterTemplateViewSet(viewsets.ModelViewSet):
    """API endpoint for managing newsletter templates"""
    queryset = NewsletterTemplate.objects.all()
    serializer_class = NewsletterTemplateSerializer
    permission_classes = [permissions.IsAdminUser]

class NewsletterCampaignViewSet(viewsets.ModelViewSet):
    """API endpoint for managing newsletter campaigns"""
    queryset = NewsletterCampaign.objects.all()
    serializer_class = NewsletterCampaignSerializer
    permission_classes = [permissions.IsAdminUser]
    
    @action(detail=True, methods=['post'])
    def schedule(self, request, pk=None):
        """Schedule a campaign for sending"""
        campaign = self.get_object()
        
        # Ensure campaign is in draft status
        if campaign.status != 'draft':
            return Response(
                {"detail": "Only draft campaigns can be scheduled."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Get scheduled time from request
        scheduled_at = request.data.get('scheduled_at')
        if not scheduled_at:
            return Response(
                {"detail": "Scheduled time is required."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            scheduled_time = timezone.datetime.fromisoformat(scheduled_at.replace('Z', '+00:00'))
        except (ValueError, TypeError):
            return Response(
                {"detail": "Invalid scheduled time format. Use ISO format (YYYY-MM-DDTHH:MM:SS)."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Ensure scheduled time is in the future
        if scheduled_time <= timezone.now():
            return Response(
                {"detail": "Scheduled time must be in the future."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Update campaign status and scheduled time
        campaign.status = 'scheduled'
        campaign.scheduled_at = scheduled_time
        campaign.save()
        
        return Response(
            {"detail": f"Campaign scheduled for {scheduled_at}."},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def send_now(self, request, pk=None):
        """Send a campaign immediately"""
        campaign = self.get_object()
        
        # Ensure campaign is in draft or scheduled status
        if campaign.status not in ['draft', 'scheduled']:
            return Response(
                {"detail": "Only draft or scheduled campaigns can be sent."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Queue the campaign for sending asynchronously
        try:
            # Get subscribers
            subscribers = campaign.get_all_subscribers()
            
            # Update campaign status
            campaign.status = 'sending'
            campaign.total_recipients = subscribers.count()
            campaign.save()
            
            # Queue the campaign processing task
            # In a real implementation, use a task queue like Celery
            # For now, we'll simulate it with a background thread
            threading.Thread(
                target=self._process_campaign_sending,
                args=(campaign, subscribers)
            ).start()
            
            return Response(
                {"detail": "Campaign queued for immediate sending."},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            logger.error(f"Failed to queue campaign: {str(e)}")
            return Response(
                {"detail": "Failed to queue campaign for sending."},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def _process_campaign_sending(self, campaign, subscribers):
        """Process campaign sending in background"""
        try:
            # Get template content
            template = campaign.template
            
            for subscriber in subscribers:
                # Choose language based on subscriber preference
                lang = subscriber.language_preference
                subject = getattr(template, f'subject_{lang}') or template.subject_en
                content = getattr(template, f'content_{lang}') or template.content_en
                
                # Create delivery record
                delivery = EmailDelivery.objects.create(
                    campaign=campaign,
                    subscriber=subscriber,
                    status='pending'
                )
                
                # Personalize content
                personalized_content = content.replace('{{email}}', subscriber.email)
                personalized_content = personalized_content.replace('{{first_name}}', subscriber.first_name or '')
                personalized_content = personalized_content.replace('{{last_name}}', subscriber.last_name or '')
                
                # Add tracking pixel
                tracking_url = f"{settings.API_URL}/api/newsletters/track/open/{delivery.tracking_key}/"
                tracking_pixel = f'<img src="{tracking_url}" width="1" height="1" alt="" />'
                personalized_content += tracking_pixel
                
                # Track and replace links
                personalized_content = self._process_links(personalized_content, delivery)
                
                try:
                    # Send email
                    send_mail(
                        subject,
                        self._strip_html_tags(personalized_content),  # Plain text version
                        settings.DEFAULT_FROM_EMAIL,
                        [subscriber.email],
                        html_message=personalized_content,  # HTML version
                        fail_silently=False
                    )
                    
                    # Update delivery record
                    delivery.status = 'sent'
                    delivery.sent_at = timezone.now()
                    delivery.save()
                    
                    # Update campaign stats
                    campaign.successful_deliveries += 1
                    campaign.save()
                    
                except Exception as e:
                    # Log error and update delivery status
                    logger.error(f"Failed to send to {subscriber.email}: {str(e)}")
                    delivery.status = 'failed'
                    delivery.bounce_reason = str(e)
                    delivery.save()
                    
                    # Update campaign bounce count
                    campaign.bounces += 1
                    campaign.save()
            
            # Mark campaign as sent
            campaign.status = 'sent'
            campaign.sent_at = timezone.now()
            campaign.save()
            
            logger.info(f"Campaign '{campaign.name}' sent to {campaign.successful_deliveries} subscribers")
            
        except Exception as e:
            logger.error(f"Campaign sending failed: {str(e)}")
            campaign.status = 'failed'
            campaign.save()
    
    def _process_links(self, content, delivery):
        """Process links in content to add tracking"""
        # Simple link extraction and replacement
        # In a real implementation, use a proper HTML parser
        link_pattern = re.compile(r'<a\s+(?:[^>]*?\s+)?href=(["\'])(.*?)\1', re.IGNORECASE)
        
        def replace_link(match):
            url = match.group(2)
            tracking_url = f"{settings.API_URL}/api/newsletters/track/click/{delivery.tracking_key}/?url={quote_plus(url)}"
            return f'<a href="{tracking_url}"'
        
        return link_pattern.sub(replace_link, content)
    
    def _strip_html_tags(self, html_content):
        """Convert HTML to plain text by removing tags"""
        if not html_content:
            return ""
        return re.sub(r'<[^>]*>', '', html_content)

class NewsletterTrackingViewSet(viewsets.ViewSet):
    """API endpoints for tracking newsletter engagement"""
    permission_classes = [permissions.AllowAny]
    
    @action(detail=False, methods=['get'], url_path='track/open/(?P<tracking_key>[a-f0-9-]+)')
    def track_open(self, request, tracking_key=None):
        """Track when an email is opened"""
        try:
            delivery = EmailDelivery.objects.get(tracking_key=tracking_key)
            
            # Update delivery record
            if delivery.status == 'sent':
                delivery.status = 'opened'
            
            delivery.opened_at = delivery.opened_at or timezone.now()
            delivery.open_count += 1
            delivery.save()
            
            # Update campaign stats
            campaign = delivery.campaign
            campaign.opens += 1
            campaign.save()
            
            # Return a 1x1 transparent GIF
            transparent_pixel = base64.b64decode('R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==')
            return HttpResponse(transparent_pixel, content_type='image/gif')
            
        except EmailDelivery.DoesNotExist:
            # Still return the pixel, just don't track
            transparent_pixel = base64.b64decode('R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==')
            return HttpResponse(transparent_pixel, content_type='image/gif')
    
    @action(detail=False, methods=['get'], url_path='track/click/(?P<tracking_key>[a-f0-9-]+)')
    def track_click(self, request, tracking_key=None):
        """Track when a link in an email is clicked"""
        try:
            delivery = EmailDelivery.objects.get(tracking_key=tracking_key)
            url = request.query_params.get('url', '')
            
            if not url:
                return Response(
                    {"detail": "No URL provided."},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Update delivery record
            if delivery.status in ['sent', 'opened']:
                delivery.status = 'clicked'
            
            delivery.clicked_at = delivery.clicked_at or timezone.now()
            delivery.click_count += 1
            delivery.save()
            
            # Update campaign stats
            campaign = delivery.campaign
            campaign.clicks += 1
            campaign.save()
            
            # Record the click with user agent and IP
            LinkClick.objects.create(
                delivery=delivery,
                url=url,
                user_agent=request.META.get('HTTP_USER_AGENT', ''),
                ip_address=self._get_client_ip(request)
            )
            
            # Redirect to the original URL
            return redirect(url)
            
        except EmailDelivery.DoesNotExist:
            # If tracking key is invalid, still redirect to the URL
            url = request.query_params.get('url', '')
            if url:
                return redirect(url)
            return Response(
                {"detail": "Invalid tracking parameters."},
                status=status.HTTP_400_BAD_REQUEST
            )
    
    def _get_client_ip(self, request):
        """Get client IP from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

class NewsletterAutomationViewSet(viewsets.ModelViewSet):
    """API endpoint for managing newsletter automations"""
    queryset = NewsletterAutomation.objects.all()
    serializer_class = NewsletterAutomationSerializer
    permission_classes = [permissions.IsAdminUser]

class AutomationStepViewSet(viewsets.ModelViewSet):
    """API endpoint for managing automation steps"""
    queryset = AutomationStep.objects.all()
    serializer_class = AutomationStepSerializer
    permission_classes = [permissions.IsAdminUser]
    
    def get_queryset(self):
        """Filter steps by automation if provided"""
        queryset = super().get_queryset()
        automation_id = self.request.query_params.get('automation')
        if automation_id:
            queryset = queryset.filter(automation_id=automation_id)
        return queryset.order_by('automation', 'order')

# <<< Remove FooterAPIView class definition >>> 