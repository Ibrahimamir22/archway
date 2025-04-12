from rest_framework import serializers
from .models import (
    ContactMessage, ContactInfo, 
    FooterSettings, FooterSection, FooterLink, 
    SocialMedia, NewsletterSubscription, SubscriberSegment, NewsletterTemplate, NewsletterCampaign, EmailDelivery, NewsletterAutomation, AutomationStep
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


# Footer serializers
class FooterLinkSerializer(serializers.ModelSerializer):
    """Serializer for footer links"""
    class Meta:
        model = FooterLink
        fields = ['id', 'title', 'url', 'open_in_new_tab', 'order']


class SocialMediaSerializer(serializers.ModelSerializer):
    """Serializer for social media links"""
    class Meta:
        model = SocialMedia
        fields = ['id', 'platform', 'url', 'get_icon', 'order']


class FooterSectionSerializer(serializers.ModelSerializer):
    """Serializer for footer sections"""
    links = FooterLinkSerializer(many=True, read_only=True)
    
    class Meta:
        model = FooterSection
        fields = ['id', 'title', 'slug', 'links', 'order']


class FooterSettingsSerializer(serializers.ModelSerializer):
    """Serializer for footer settings"""
    class Meta:
        model = FooterSettings
        fields = [
            'company_name', 'description', 'address', 
            'email', 'phone', 'copyright_text',
            'show_newsletter', 'newsletter_text'
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


# Localized serializers with language support
class LocalizedFooterLinkSerializer(serializers.ModelSerializer):
    """Footer link serializer with localization support"""
    title = serializers.SerializerMethodField()
    
    class Meta:
        model = FooterLink
        fields = ['id', 'title', 'url', 'open_in_new_tab', 'order']
    
    def get_title(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'title_{language}') if getattr(obj, f'title_{language}') else obj.title_en


class LocalizedFooterSectionSerializer(serializers.ModelSerializer):
    """Footer section serializer with localization support"""
    title = serializers.SerializerMethodField()
    links = serializers.SerializerMethodField()
    
    class Meta:
        model = FooterSection
        fields = ['id', 'title', 'slug', 'links', 'order']
    
    def get_title(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'title_{language}') if getattr(obj, f'title_{language}') else obj.title_en
    
    def get_links(self, obj):
        """Get only active links and pass language context to link serializer"""
        active_links = obj.links.filter(is_active=True).order_by('order')
        serializer = LocalizedFooterLinkSerializer(
            active_links, 
            many=True, 
            context={'language': self.context.get('language', 'en')}
        )
        return serializer.data


class LocalizedFooterSettingsSerializer(serializers.ModelSerializer):
    """Footer settings serializer with localization support"""
    company_name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    copyright_text = serializers.SerializerMethodField()
    newsletter_text = serializers.SerializerMethodField()
    
    class Meta:
        model = FooterSettings
        fields = [
            'company_name', 'description', 'address', 
            'email', 'phone', 'copyright_text',
            'show_newsletter', 'newsletter_text'
        ]
    
    def get_company_name(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'company_name_{language}') if getattr(obj, f'company_name_{language}') else obj.company_name_en
    
    def get_description(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'description_{language}') if getattr(obj, f'description_{language}') else obj.description_en
    
    def get_address(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'address_{language}') if getattr(obj, f'address_{language}') else obj.address_en
    
    def get_copyright_text(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'copyright_text_{language}') if getattr(obj, f'copyright_text_{language}') else obj.copyright_text_en
    
    def get_newsletter_text(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'newsletter_text_{language}') if getattr(obj, f'newsletter_text_{language}') else obj.newsletter_text_en


class FooterSerializer(serializers.Serializer):
    """Serializer that combines all footer elements"""
    settings = serializers.SerializerMethodField()
    sections = serializers.SerializerMethodField()
    social_media = serializers.SerializerMethodField()
    
    def get_settings(self, obj):
        """Get footer settings"""
        try:
            settings = FooterSettings.objects.first()
            if settings:
                serializer = LocalizedFooterSettingsSerializer(
                    settings, 
                    context={'language': self.context.get('language', 'en')}
                )
                return serializer.data
        except FooterSettings.DoesNotExist:
            pass
        return None
    
    def get_sections(self, obj):
        """Get active footer sections with their links"""
        sections = FooterSection.objects.filter(is_active=True).order_by('order')
        serializer = LocalizedFooterSectionSerializer(
            sections, 
            many=True, 
            context={'language': self.context.get('language', 'en')}
        )
        return serializer.data
    
    def get_social_media(self, obj):
        """Get active social media links"""
        social_links = SocialMedia.objects.filter(is_active=True).order_by('order')
        serializer = SocialMediaSerializer(social_links, many=True)
        return serializer.data

    def validate_phone(self, value):
        """Validate Egyptian phone numbers"""
        if value and not re.match(r'^(\+201|01)[0-9]{9}$', value):
            raise serializers.ValidationError(
                "Please enter a valid Egyptian phone number (e.g., +201XXXXXXXXX or 01XXXXXXXXX)"
            )
        return value
        
    def validate_email(self, value):
        """Validate email format"""
        if not re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', value):
            raise serializers.ValidationError(
                "Please enter a valid email address"
            )
        return value
        
    def create(self, validated_data):
        # Get IP address from request if available
        request = self.context.get('request')
        if request:
            # Get client IP from X-Forwarded-For header or REMOTE_ADDR
            x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
            if x_forwarded_for:
                ip_address = x_forwarded_for.split(',')[0]
            else:
                ip_address = request.META.get('REMOTE_ADDR')
                
            validated_data['ip_address'] = ip_address
            
        return super().create(validated_data) 