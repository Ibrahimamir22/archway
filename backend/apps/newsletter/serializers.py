from rest_framework import serializers
from .models import (
    NewsletterSubscription, SubscriberSegment, 
    NewsletterTemplate, NewsletterCampaign
)

class NewsletterSubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for newsletter subscriptions"""
    class Meta:
        model = NewsletterSubscription
        fields = ['id', 'email', 'first_name', 'last_name', 'language_preference', 
                 'confirmed', 'is_active', 'created_at']
        read_only_fields = ['id', 'confirmed', 'is_active', 'created_at']

class SubscriberSegmentSerializer(serializers.ModelSerializer):
    """Serializer for subscriber segments"""
    subscriber_count = serializers.SerializerMethodField()
    
    class Meta:
        model = SubscriberSegment
        fields = ['id', 'name', 'description', 'is_active', 
                 'subscriber_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_subscriber_count(self, obj):
        return obj.subscribers.count()

class NewsletterTemplateSerializer(serializers.ModelSerializer):
    """Serializer for newsletter templates"""
    class Meta:
        model = NewsletterTemplate
        fields = ['id', 'name', 'description', 'type', 'subject_en', 'subject_ar',
                 'content_en', 'content_ar', 'is_active', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class NewsletterCampaignSerializer(serializers.ModelSerializer):
    """Serializer for newsletter campaigns"""
    class Meta:
        model = NewsletterCampaign
        fields = ['id', 'name', 'description', 'template', 'segments', 'status',
                 'scheduled_at', 'sent_at', 'total_recipients', 'successful_deliveries',
                 'opens', 'clicks', 'bounces', 'created_at', 'updated_at']
        read_only_fields = ['id', 'sent_at', 'total_recipients', 'successful_deliveries',
                           'opens', 'clicks', 'bounces', 'created_at', 'updated_at']

class ConfirmSubscriptionSerializer(serializers.Serializer):
    """Serializer for confirming newsletter subscriptions"""
    token = serializers.UUIDField()

class UnsubscribeSerializer(serializers.Serializer):
    """Serializer for unsubscribing from newsletters"""
    email = serializers.EmailField() 