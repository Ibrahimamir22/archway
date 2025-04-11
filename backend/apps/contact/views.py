from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.translation import gettext as _
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator
import logging
from .models import ContactMessage, ContactInfo
from .serializers import ContactMessageSerializer, ContactInfoSerializer

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