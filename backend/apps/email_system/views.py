from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from django.http import HttpResponse, HttpResponseRedirect
import logging
import base64
from .models import (
    EmailDelivery, LinkClick, NewsletterAutomation, 
    AutomationStep, AutomationExecution, EmailConfiguration
)
from .serializers import (
    EmailDeliverySerializer, LinkClickSerializer, 
    NewsletterAutomationSerializer, AutomationStepSerializer,
    AutomationExecutionSerializer, EmailConfigurationSerializer
)
from django.utils import timezone

# Set up logger
logger = logging.getLogger(__name__)

class EmailDeliveryViewSet(viewsets.ModelViewSet):
    """API endpoint for email deliveries"""
    queryset = EmailDelivery.objects.all()
    serializer_class = EmailDeliverySerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields = ['status', 'campaign']
    search_fields = ['subscriber__email', 'campaign__name']
    ordering_fields = ['sent_at', 'opened_at', 'clicked_at', 'created_at']
    ordering = ['-created_at']

class LinkClickViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for tracking link clicks"""
    queryset = LinkClick.objects.all()
    serializer_class = LinkClickSerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields = ['delivery__campaign']
    search_fields = ['url', 'delivery__subscriber__email']
    ordering_fields = ['clicked_at']
    ordering = ['-clicked_at']

class NewsletterAutomationViewSet(viewsets.ModelViewSet):
    """API endpoint for managing newsletter automations"""
    queryset = NewsletterAutomation.objects.all()
    serializer_class = NewsletterAutomationSerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields = ['is_active', 'trigger_type']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

class AutomationStepViewSet(viewsets.ModelViewSet):
    """API endpoint for managing automation steps"""
    queryset = AutomationStep.objects.all()
    serializer_class = AutomationStepSerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields = ['automation', 'is_active']
    ordering_fields = ['automation', 'order']
    ordering = ['automation', 'order']
    
    def get_queryset(self):
        """Filter steps by automation if specified"""
        queryset = super().get_queryset()
        automation_id = self.request.query_params.get('automation', None)
        if automation_id:
            queryset = queryset.filter(automation_id=automation_id)
        return queryset

class AutomationExecutionViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for tracking automation executions"""
    queryset = AutomationExecution.objects.all()
    serializer_class = AutomationExecutionSerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields = ['status', 'automation']
    search_fields = ['subscriber__email', 'automation__name']
    ordering_fields = ['started_at', 'next_step_scheduled_at']
    ordering = ['-started_at']

class EmailConfigurationViewSet(viewsets.ModelViewSet):
    """API endpoint for managing email configuration"""
    queryset = EmailConfiguration.objects.all()
    serializer_class = EmailConfigurationSerializer
    permission_classes = [permissions.IsAdminUser]
    filterset_fields = ['active']
    search_fields = ['name', 'email_host', 'email_host_user']
    
    def perform_create(self, serializer):
        """Ensure only one configuration is active"""
        instance = serializer.save()
        if instance.active:
            EmailConfiguration.objects.exclude(pk=instance.pk).update(active=False)
    
    def perform_update(self, serializer):
        """Ensure only one configuration is active"""
        instance = serializer.save()
        if instance.active:
            EmailConfiguration.objects.exclude(pk=instance.pk).update(active=False)

class TrackOpenView(APIView):
    """API endpoint for tracking email opens"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, tracking_key=None):
        """Return a tracking pixel and record the open"""
        if tracking_key:
            try:
                # Find the delivery and update stats
                delivery = EmailDelivery.objects.get(tracking_key=tracking_key)
                
                # Record open if not already marked as opened
                if not delivery.opened_at:
                    delivery.status = 'opened'
                    delivery.opened_at = timezone.now()
                
                # Increment open count regardless
                delivery.open_count += 1
                delivery.save()
                
                # Update campaign stats
                campaign = delivery.campaign
                campaign.opens = EmailDelivery.objects.filter(
                    campaign=campaign, 
                    opened_at__isnull=False
                ).count()
                campaign.save()
                
                logger.info(f"Email open tracked for {delivery.subscriber.email} from campaign {campaign.name}")
            
            except EmailDelivery.DoesNotExist:
                logger.warning(f"Invalid tracking key for email open: {tracking_key}")
            except Exception as e:
                logger.error(f"Error tracking email open: {str(e)}")
        
        # Return 1x1 transparent pixel regardless of success
        pixel = base64.b64decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7')
        return HttpResponse(pixel, content_type='image/gif')

class TrackClickView(APIView):
    """API endpoint for tracking link clicks and redirecting"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, tracking_key=None):
        """Record the click and redirect to the target URL"""
        redirect_url = request.GET.get('url', '/')
        
        if tracking_key:
            try:
                # Find the delivery and update stats
                delivery = EmailDelivery.objects.get(tracking_key=tracking_key)
                
                # Record click if not already marked as clicked
                if not delivery.clicked_at:
                    delivery.status = 'clicked'
                    delivery.clicked_at = timezone.now()
                
                # Increment click count regardless
                delivery.click_count += 1
                delivery.save()
                
                # Create link click record
                LinkClick.objects.create(
                    delivery=delivery,
                    url=redirect_url,
                    user_agent=request.META.get('HTTP_USER_AGENT', ''),
                    ip_address=self._get_client_ip(request)
                )
                
                # Update campaign stats
                campaign = delivery.campaign
                campaign.clicks = EmailDelivery.objects.filter(
                    campaign=campaign, 
                    clicked_at__isnull=False
                ).count()
                campaign.save()
                
                logger.info(f"Email link click tracked for {delivery.subscriber.email} from campaign {campaign.name}")
            
            except EmailDelivery.DoesNotExist:
                logger.warning(f"Invalid tracking key for link click: {tracking_key}")
            except Exception as e:
                logger.error(f"Error tracking link click: {str(e)}")
        
        # Redirect to the target URL regardless of success
        return HttpResponseRedirect(redirect_url)
    
    def _get_client_ip(self, request):
        """Extract client IP from request"""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip
