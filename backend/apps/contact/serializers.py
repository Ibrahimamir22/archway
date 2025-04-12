from rest_framework import serializers
from .models import (
    ContactMessage, ContactInfo, 
    FooterSettings, FooterSection, FooterLink, 
    SocialMedia, NewsletterSubscription
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
        fields = ['email']


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