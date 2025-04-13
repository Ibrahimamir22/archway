from rest_framework import serializers
from .models import FooterSettings, FooterSection, FooterLink, SocialMedia
from django.utils.translation import get_language

class FooterLinkSerializer(serializers.ModelSerializer):
    """Serializer for footer links"""
    title = serializers.CharField(source='title_en', read_only=True)
    
    class Meta:
        model = FooterLink
        fields = ['id', 'section', 'title_en', 'title_ar', 'title', 'url', 
                  'is_active', 'open_in_new_tab', 'order']
        read_only_fields = ['id']

class SocialMediaSerializer(serializers.ModelSerializer):
    """Serializer for social media links"""
    icon = serializers.SerializerMethodField()
    
    class Meta:
        model = SocialMedia
        fields = ['id', 'platform', 'url', 'icon', 'is_active', 'order']
        read_only_fields = ['id']
    
    def get_icon(self, obj):
        return obj.get_icon

class FooterSectionSerializer(serializers.ModelSerializer):
    """Serializer for footer sections"""
    links = FooterLinkSerializer(many=True, read_only=True)
    title = serializers.CharField(source='title_en', read_only=True)
    
    class Meta:
        model = FooterSection
        fields = ['id', 'title_en', 'title_ar', 'title', 'slug', 'is_active', 
                  'order', 'links']
        read_only_fields = ['id', 'slug']

class FooterSettingsSerializer(serializers.ModelSerializer):
    """Serializer for footer settings"""
    class Meta:
        model = FooterSettings
        fields = ['id', 'company_name_en', 'company_name_ar', 'description_en', 
                  'description_ar', 'address_en', 'address_ar', 'email', 'phone',
                  'copyright_text_en', 'copyright_text_ar', 'show_newsletter',
                  'newsletter_text_en', 'newsletter_text_ar']
        read_only_fields = ['id']

class LocalizedFooterSettingsSerializer(serializers.ModelSerializer):
    """Serializer that returns localized footer settings based on language"""
    company_name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    copyright_text = serializers.SerializerMethodField()
    newsletter_text = serializers.SerializerMethodField()
    
    class Meta:
        model = FooterSettings
        fields = ['company_name', 'description', 'address', 'email', 'phone',
                  'copyright_text', 'show_newsletter', 'newsletter_text']
    
    def get_language(self):
        return self.context.get('language', get_language() or 'en')
    
    def get_company_name(self, obj):
        lang = self.get_language()
        return getattr(obj, f'company_name_{lang}') or obj.company_name_en
    
    def get_description(self, obj):
        lang = self.get_language()
        return getattr(obj, f'description_{lang}') or obj.description_en
    
    def get_address(self, obj):
        lang = self.get_language()
        return getattr(obj, f'address_{lang}') or obj.address_en
    
    def get_copyright_text(self, obj):
        lang = self.get_language()
        return getattr(obj, f'copyright_text_{lang}') or obj.copyright_text_en
    
    def get_newsletter_text(self, obj):
        lang = self.get_language()
        return getattr(obj, f'newsletter_text_{lang}') or obj.newsletter_text_en

class LocalizedFooterSectionSerializer(serializers.ModelSerializer):
    """Serializer that returns localized footer section based on language"""
    title = serializers.SerializerMethodField()
    links = serializers.SerializerMethodField()
    
    class Meta:
        model = FooterSection
        fields = ['id', 'title', 'slug', 'links']
    
    def get_language(self):
        return self.context.get('language', get_language() or 'en')
    
    def get_title(self, obj):
        lang = self.get_language()
        return getattr(obj, f'title_{lang}') or obj.title_en
    
    def get_links(self, obj):
        lang = self.get_language()
        links = obj.links.filter(is_active=True).order_by('order')
        return [
            {
                'id': link.id,
                'title': getattr(link, f'title_{lang}') or link.title_en,
                'url': link.url,
                'open_in_new_tab': link.open_in_new_tab
            }
            for link in links
        ]

class FooterSerializer(serializers.Serializer):
    """Serializer that combines all footer data into one response"""
    settings = serializers.SerializerMethodField()
    sections = serializers.SerializerMethodField()
    social_media = serializers.SerializerMethodField()
    
    def get_language(self):
        return self.context.get('language', get_language() or 'en')
    
    def get_settings(self, obj):
        settings = FooterSettings.objects.first()
        if settings:
            serializer = LocalizedFooterSettingsSerializer(
                settings,
                context={'language': self.get_language()}
            )
            return serializer.data
        return {}
    
    def get_sections(self, obj):
        sections = FooterSection.objects.filter(is_active=True).order_by('order')
        serializer = LocalizedFooterSectionSerializer(
            sections,
            many=True,
            context={'language': self.get_language()}
        )
        return serializer.data
    
    def get_social_media(self, obj):
        social_media = SocialMedia.objects.filter(is_active=True).order_by('order')
        serializer = SocialMediaSerializer(social_media, many=True)
        return serializer.data 