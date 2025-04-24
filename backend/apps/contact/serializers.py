from rest_framework import serializers
from .models import (
    ContactMessage, ContactInfo, 
    NewsletterSubscription, SubscriberSegment, NewsletterTemplate, NewsletterCampaign, EmailDelivery, NewsletterAutomation, AutomationStep
)
import re

class ContactMessageSerializer(serializers.ModelSerializer):
    """Serializer for contact form submissions"""
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'subject', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']


class ContactInfoSerializer(serializers.ModelSerializer):
    """Serializer for contact information"""
    class Meta:
        model = ContactInfo
        fields = [
            'email', 'phone', 'address_en', 'address_ar',
            'hours_en', 'hours_ar', 'facebook_url', 'twitter_url',
            'instagram_url', 'linkedin_url', 'latitude', 'longitude'
        ]


class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for newsletter subscriptions"""
    class Meta:
        model = NewsletterSubscription
        fields = ['email', 'first_name', 'last_name', 'language_preference']
        extra_kwargs = {
            'first_name': {'required': False},
            'last_name': {'required': False},
            'language_preference': {'required': False}
        }


class SubscriberSegmentSerializer(serializers.ModelSerializer):
    """Serializer for subscriber segments"""
    subscriber_count = serializers.SerializerMethodField()
    
    class Meta:
        model = SubscriberSegment
        fields = ['id', 'name', 'description', 'is_active', 'subscriber_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at', 'subscriber_count']
    
    def get_subscriber_count(self, obj):
        return obj.subscribers.count()


class NewsletterTemplateSerializer(serializers.ModelSerializer):
    """Serializer for newsletter templates"""
    class Meta:
        model = NewsletterTemplate
        fields = [
            'id', 'name', 'description', 'type', 
            'subject_en', 'subject_ar', 'content_en', 'content_ar',
            'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class NewsletterCampaignSerializer(serializers.ModelSerializer):
    """Serializer for newsletter campaigns"""
    template_name = serializers.CharField(source='template.name', read_only=True)
    segment_names = serializers.SerializerMethodField()
    
    class Meta:
        model = NewsletterCampaign
        fields = [
            'id', 'name', 'description', 'template', 'template_name',
            'segments', 'segment_names', 'status', 'scheduled_at', 'sent_at',
            'total_recipients', 'successful_deliveries', 'opens', 'clicks', 'bounces',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'template_name', 'segment_names', 'sent_at',
            'total_recipients', 'successful_deliveries', 'opens', 'clicks', 'bounces',
            'created_at', 'updated_at'
        ]
    
    def get_segment_names(self, obj):
        return [segment.name for segment in obj.segments.all()]


class EmailDeliverySerializer(serializers.ModelSerializer):
    """Serializer for email deliveries"""
    subscriber_email = serializers.CharField(source='subscriber.email', read_only=True)
    campaign_name = serializers.CharField(source='campaign.name', read_only=True)
    
    class Meta:
        model = EmailDelivery
        fields = [
            'id', 'campaign', 'campaign_name', 'subscriber', 'subscriber_email',
            'status', 'sent_at', 'delivered_at', 'opened_at', 'clicked_at',
            'open_count', 'click_count', 'bounce_reason',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'campaign_name', 'subscriber_email',
            'sent_at', 'delivered_at', 'opened_at', 'clicked_at',
            'open_count', 'click_count', 'created_at', 'updated_at'
        ]


class NewsletterAutomationSerializer(serializers.ModelSerializer):
    """Serializer for newsletter automations"""
    segment_name = serializers.CharField(source='segment.name', read_only=True)
    steps_count = serializers.SerializerMethodField()
    
    class Meta:
        model = NewsletterAutomation
        fields = [
            'id', 'name', 'description', 'is_active', 'trigger_type',
            'segment', 'segment_name', 'delay_days', 'steps_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'segment_name', 'steps_count', 'created_at', 'updated_at']
    
    def get_steps_count(self, obj):
        return obj.steps.count()


class AutomationStepSerializer(serializers.ModelSerializer):
    """Serializer for automation steps"""
    automation_name = serializers.CharField(source='automation.name', read_only=True)
    template_name = serializers.CharField(source='template.name', read_only=True)
    
    class Meta:
        model = AutomationStep
        fields = [
            'id', 'automation', 'automation_name', 'template', 'template_name',
            'order', 'delay_days', 'is_active', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'automation_name', 'template_name', 'created_at', 'updated_at']


class ConfirmSubscriptionSerializer(serializers.Serializer):
    """Serializer for confirming newsletter subscriptions"""
    token = serializers.UUIDField(required=True)
    
    def validate_token(self, value):
        try:
            subscription = NewsletterSubscription.objects.get(confirmation_token=value, confirmed=False)
            return value
        except NewsletterSubscription.DoesNotExist:
            raise serializers.ValidationError("Invalid or expired confirmation token")


class UnsubscribeSerializer(serializers.Serializer):
    """Serializer for unsubscribing from newsletters"""
    email = serializers.EmailField(required=True)
    token = serializers.UUIDField(required=True)
    
    def validate(self, data):
        email = data.get('email')
        token = data.get('token')
        
        try:
            subscription = NewsletterSubscription.objects.get(email=email, is_active=True)
            # Check if token is valid - could be confirmation_token or a tracking token
            # from a campaign delivery for enhanced security
            deliveries = EmailDelivery.objects.filter(
                subscriber=subscription,
                tracking_key=token
            ).exists()
            
            if subscription.confirmation_token != token and not deliveries:
                raise serializers.ValidationError({"token": "Invalid unsubscribe token"})
                
            return data
        except NewsletterSubscription.DoesNotExist:
            raise serializers.ValidationError({"email": "Email address not found in our subscribers list"})