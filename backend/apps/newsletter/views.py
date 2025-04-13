from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils import timezone
import uuid
import logging
from .models import (
    NewsletterSubscription, SubscriberSegment, 
    NewsletterTemplate, NewsletterCampaign
)
from .serializers import (
    NewsletterSubscriptionSerializer, SubscriberSegmentSerializer,
    NewsletterTemplateSerializer, NewsletterCampaignSerializer,
    ConfirmSubscriptionSerializer, UnsubscribeSerializer
)

# Set up logger
logger = logging.getLogger(__name__)

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
            
            # For now, we'll simply respond - email sending will be implemented later
            return Response(
                {"detail": "Please check your email to confirm your subscription."},
                status=status.HTTP_201_CREATED
            )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
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
                
                return Response(
                    {"detail": "Subscription confirmed successfully."},
                    status=status.HTTP_200_OK
                )
            except NewsletterSubscription.DoesNotExist:
                return Response(
                    {"detail": "Invalid confirmation token."},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['post'])
    def unsubscribe(self, request):
        """Unsubscribe from newsletters"""
        serializer = UnsubscribeSerializer(data=request.data)
        
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            try:
                subscription = NewsletterSubscription.objects.get(email=email)
                subscription.is_active = False
                subscription.save()
                
                return Response(
                    {"detail": "Successfully unsubscribed."},
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
        
        if campaign.status != 'draft':
            return Response(
                {"detail": "Only draft campaigns can be scheduled."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Schedule the campaign
        campaign.status = 'scheduled'
        campaign.scheduled_at = timezone.now()  # Default to now if no date provided
        campaign.save()
        
        return Response(
            {"detail": "Campaign scheduled successfully."},
            status=status.HTTP_200_OK
        )
    
    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a scheduled campaign"""
        campaign = self.get_object()
        
        if campaign.status not in ['draft', 'scheduled']:
            return Response(
                {"detail": "Only draft or scheduled campaigns can be cancelled."},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Cancel the campaign
        campaign.status = 'cancelled'
        campaign.save()
        
        return Response(
            {"detail": "Campaign cancelled successfully."},
            status=status.HTTP_200_OK
        )
