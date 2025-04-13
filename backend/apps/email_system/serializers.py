from rest_framework import serializers
from .models import (
    EmailDelivery, LinkClick, NewsletterAutomation, 
    AutomationStep, AutomationExecution, EmailConfiguration
)
from apps.newsletter.models import NewsletterSubscription

class EmailDeliverySerializer(serializers.ModelSerializer):
    """Serializer for email deliveries"""
    subscriber_email = serializers.SerializerMethodField()
    campaign_name = serializers.SerializerMethodField()
    
    class Meta:
        model = EmailDelivery
        fields = ['id', 'campaign', 'campaign_name', 'subscriber', 'subscriber_email', 
                 'status', 'sent_at', 'delivered_at', 'opened_at', 'clicked_at',
                 'open_count', 'click_count', 'bounce_reason']
        read_only_fields = ['id', 'tracking_key', 'sent_at', 'delivered_at', 
                           'opened_at', 'clicked_at', 'open_count', 'click_count']
    
    def get_subscriber_email(self, obj):
        return obj.subscriber.email if obj.subscriber else None
    
    def get_campaign_name(self, obj):
        return obj.campaign.name if obj.campaign else None

class LinkClickSerializer(serializers.ModelSerializer):
    """Serializer for link clicks"""
    class Meta:
        model = LinkClick
        fields = ['id', 'delivery', 'url', 'clicked_at', 'user_agent', 'ip_address']
        read_only_fields = ['id', 'clicked_at']

class AutomationStepSerializer(serializers.ModelSerializer):
    """Serializer for automation steps"""
    template_name = serializers.SerializerMethodField()
    
    class Meta:
        model = AutomationStep
        fields = ['id', 'automation', 'template', 'template_name', 'order', 
                 'delay_days', 'is_active']
        read_only_fields = ['id']
    
    def get_template_name(self, obj):
        return obj.template.name if obj.template else None

class NewsletterAutomationSerializer(serializers.ModelSerializer):
    """Serializer for newsletter automations"""
    steps = AutomationStepSerializer(many=True, read_only=True)
    segment_name = serializers.SerializerMethodField()
    step_count = serializers.SerializerMethodField()
    
    class Meta:
        model = NewsletterAutomation
        fields = ['id', 'name', 'description', 'is_active', 'trigger_type',
                 'segment', 'segment_name', 'delay_days', 'steps', 'step_count']
        read_only_fields = ['id', 'step_count']
    
    def get_segment_name(self, obj):
        return obj.segment.name if obj.segment else None
    
    def get_step_count(self, obj):
        return obj.steps.count()

class AutomationExecutionSerializer(serializers.ModelSerializer):
    """Serializer for automation executions"""
    subscriber_email = serializers.SerializerMethodField()
    automation_name = serializers.SerializerMethodField()
    current_step_name = serializers.SerializerMethodField()
    
    class Meta:
        model = AutomationExecution
        fields = ['id', 'automation', 'automation_name', 'subscriber', 
                 'subscriber_email', 'status', 'started_at', 'completed_at',
                 'current_step', 'current_step_name', 'next_step_scheduled_at']
        read_only_fields = ['id', 'started_at']
    
    def get_subscriber_email(self, obj):
        return obj.subscriber.email if obj.subscriber else None
    
    def get_automation_name(self, obj):
        return obj.automation.name if obj.automation else None
    
    def get_current_step_name(self, obj):
        if obj.current_step:
            return f"{obj.current_step.template.name} (Step {obj.current_step.order})"
        return "Not started"

class EmailConfigurationSerializer(serializers.ModelSerializer):
    """Serializer for email configuration"""
    class Meta:
        model = EmailConfiguration
        fields = ['id', 'name', 'email_backend', 'email_host', 'email_port',
                 'email_use_tls', 'email_host_user', 'email_host_password',
                 'default_from_email', 'active']
        read_only_fields = ['id']
        extra_kwargs = {
            'email_host_password': {'write_only': True}
        } 