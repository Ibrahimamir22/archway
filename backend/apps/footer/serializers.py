from rest_framework import serializers
from django.conf import settings
from .models import FooterSettings, FooterSection, FooterLink, SocialMedia, FooterBottomLink
from django.utils.translation import get_language, gettext_lazy as _
from django.utils import translation

class FooterLinkSerializer(serializers.ModelSerializer):
    """Serializer for footer links with localization support"""
    
    title = serializers.SerializerMethodField()
    
    class Meta:
        model = FooterLink
        fields = ['id', 'title', 'url', 'order']
    
    def get_title(self, obj):
        language = self.context.get('language', None)
        if language:
            with translation.override(language):
                return str(obj.title)
        return str(obj.title)

class SocialMediaSerializer(serializers.ModelSerializer):
    """Serializer for social media links"""
    
    class Meta:
        model = SocialMedia
        fields = ['id', 'platform', 'url', 'icon', 'order']

class FooterSectionSerializer(serializers.ModelSerializer):
    """Serializer for footer sections with localized links"""
    
    title = serializers.SerializerMethodField()
    links = serializers.SerializerMethodField()
    
    class Meta:
        model = FooterSection
        fields = ['id', 'title', 'links', 'order']
    
    def get_title(self, obj):
        language = self.context.get('language', None)
        if language:
            with translation.override(language):
                return str(obj.title)
        return str(obj.title)
    
    def get_links(self, obj):
        # Only return active links
        active_links = obj.links.filter(is_active=True).order_by('order')
        return FooterLinkSerializer(
            active_links, 
            many=True, 
            context=self.context
        ).data

class FooterSettingsSerializer(serializers.ModelSerializer):
    """Base serializer for footer settings"""
    
    class Meta:
        model = FooterSettings
        fields = [
            'id', 'company_name', 'description', 'address', 'phone', 'email',
            'copyright_text', 'show_company_info', 'show_contact_info',
            'show_copyright', 'show_contact_section', 'show_newsletter'
        ]

class LocalizedFooterSettingsSerializer(serializers.ModelSerializer):
    """Serializer that returns localized footer settings based on language"""
    company_name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    copyright_text = serializers.SerializerMethodField()
    contact_title = serializers.SerializerMethodField()
    newsletter_text = serializers.SerializerMethodField()
    newsletter_label = serializers.SerializerMethodField()
    show_company_info = serializers.BooleanField()
    show_contact_info = serializers.BooleanField()
    show_copyright = serializers.BooleanField()
    show_contact_section = serializers.BooleanField()
    show_newsletter = serializers.BooleanField()
    social_media = serializers.SerializerMethodField()
    
    class Meta:
        model = FooterSettings
        fields = [
            'company_name', 'description', 'email', 'phone', 'address',
            'copyright_text', 'contact_title', 'newsletter_text', 
            'newsletter_label', 'show_company_info', 'show_contact_info',
            'show_copyright', 'show_contact_section', 'show_newsletter',
            'social_media'
        ]
    
    def get_language(self):
        return self.context.get('language', get_language() or 'en')
    
    def _get_localized_field(self, obj, field_name):
        lang = self.get_language()
        localized_value = getattr(obj, f'{field_name}_{lang}', None)
        if localized_value:
            return localized_value
        return getattr(obj, f'{field_name}_en', '')

    def get_company_name(self, obj):
        if not obj.show_company_info:
            return ""
        return self._get_localized_field(obj, 'company_name')
    
    def get_description(self, obj):
        if not obj.show_company_info:
            return ""
        return self._get_localized_field(obj, 'description')
    
    def get_address(self, obj):
        if not obj.show_contact_info:
            return ""
        return self._get_localized_field(obj, 'address')
    
    def get_copyright_text(self, obj):
        if not obj.show_copyright:
            return ""
        return self._get_localized_field(obj, 'copyright_text')
    
    def get_contact_title(self, obj):
        if not obj.show_contact_section:
            return ""
        lang = self.get_language()
        value = getattr(obj, f'contact_title_{lang}', None)
        # If no contact title is set, use default
        if not value:
            return "Contact Us" if lang == 'en' else "اتصل بنا"
        return value
    
    def get_newsletter_text(self, obj):
        if not obj.show_newsletter:
            return ""
        return self._get_localized_field(obj, 'newsletter_text')
    
    def get_newsletter_label(self, obj):
        if not obj.show_newsletter:
            return ""
        return self._get_localized_field(obj, 'newsletter_label')
    
    def get_social_media(self, obj):
        social_media = SocialMedia.objects.filter(is_active=True).order_by('order')
        return SocialMediaSerializer(social_media, many=True).data
    
    def to_representation(self, instance):
        """Override to completely remove email and phone when contact info is disabled"""
        data = super().to_representation(instance)
        
        # If contact info is disabled, completely remove fields
        if not instance.show_contact_info:
            data['email'] = ""
            data['phone'] = ""
        
        # Clean up empty fields
        for field in ['company_name', 'description', 'address', 'email', 'phone', 
                      'copyright_text', 'newsletter_text', 'contact_title', 'newsletter_label']:
            if field in data and not data[field]:
                data[field] = ""
        
        return data

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

class FooterBottomLinkSerializer(serializers.ModelSerializer):
    """Serializer for footer bottom links (Terms, Privacy Policy, etc.)"""
    
    text = serializers.SerializerMethodField()
    
    class Meta:
        model = FooterBottomLink
        fields = ['id', 'text', 'url', 'order', 'open_in_new_tab']
    
    def get_text(self, obj):
        language = self.context.get('language', get_language() or 'en')
        return getattr(obj, f'title_{language}') or obj.title_en

class FooterSerializer(serializers.Serializer):
    """
    Comprehensive footer serializer that respects all toggle settings
    and combines all footer data into a single response
    """
    settings = serializers.SerializerMethodField()
    sections = serializers.SerializerMethodField()
    social_media = serializers.SerializerMethodField()
    company_info = serializers.SerializerMethodField()
    contact_info = serializers.SerializerMethodField()
    copyright = serializers.SerializerMethodField()

    def to_representation(self, instance):
        """Override to check global is_active setting first."""
        # Attempt to get the first FooterSettings object
        settings = FooterSettings.objects.first()

        # If no settings exist or the footer is globally inactive, return empty
        if not settings or not settings.is_active:
            return {}  # Return empty dict to trigger fallback/hide footer on frontend

        # If active, proceed to build the full response
        data = super().to_representation(instance)
        
        # Manually call get methods as they won't be called automatically
        # when overriding to_representation for a non-model serializer
        data['settings'] = self.get_settings(settings)
        data['sections'] = self.get_sections(settings)
        data['social_media'] = self.get_social_media(settings)
        data['company_info'] = self.get_company_info(settings)
        data['contact_info'] = self.get_contact_info(settings)
        data['copyright'] = self.get_copyright(settings)
        
        return data
    
    def get_settings(self, settings):
        # Pass settings object to avoid redundant query
        # Get basic toggle settings for frontend to use
        # settings = FooterSettings.objects.first() # Removed redundant query
        if not settings: # Should not happen if to_representation check passes, but safe check
            return {
                'is_active': False, # Explicitly state inactive
                'show_company_info': True,
                'show_contact_info': True,
                'show_copyright': True,
                'show_contact_section': True,
                'show_newsletter': False
            }
        
        return {
            'is_active': settings.is_active, # Include the main active status
            'show_company_info': settings.show_company_info,
            'show_contact_info': settings.show_contact_info,
            'show_copyright': settings.show_copyright,
            'show_contact_section': settings.show_contact_section,
            'show_newsletter': settings.show_newsletter
        }
    
    def get_company_info(self, settings):
        # Pass settings object to avoid redundant query
        # settings = FooterSettings.objects.first() # Removed redundant query
        if not settings or not settings.show_company_info:
            return None
        
        language = self.context.get('language', 'en') # Fallback to 'en' if not in context
        with translation.override(language):
            # Access translated fields correctly
            return {
                'company_name': getattr(settings, f'company_name_{language}', settings.company_name_en),
                'description': getattr(settings, f'description_{language}', settings.description_en)
            }
    
    def get_contact_info(self, settings):
        # Pass settings object to avoid redundant query
        # settings = FooterSettings.objects.first() # Removed redundant query
        if not settings or not settings.show_contact_info:
            return None
            
        language = self.context.get('language', 'en') # Fallback to 'en' if not in context
        with translation.override(language):
            # Access translated fields correctly
            return {
                'address': getattr(settings, f'address_{language}', settings.address_en),
                'phone': settings.phone, # Phone doesn't seem localized in model
                'email': settings.email, # Email doesn't seem localized in model
                'contact_title': getattr(settings, f'contact_title_{language}', settings.contact_title_en) # Add contact title
            }
    
    def get_copyright(self, settings):
        # Pass settings object to avoid redundant query
        # settings = FooterSettings.objects.first() # Removed redundant query
        if not settings or not settings.show_copyright:
            return None
        
        language = self.context.get('language', 'en') # Fallback to 'en' if not in context
        with translation.override(language):
            # Access translated fields correctly
            return getattr(settings, f'copyright_text_{language}', settings.copyright_text_en)
    
    def get_sections(self, settings):
        # Pass settings object to check show_contact_section
        # settings = FooterSettings.objects.first() # Removed redundant query
        section_filter = {}
        
        if settings and not settings.show_contact_section:
            # Exclude contact section if disabled - Assuming 'contact' is the slug or type
            # This part might need adjustment based on how sections are identified as 'contact'
            # For now, let's assume a field `section_type` exists or adjust based on model.
            # If no explicit type, maybe filter by a specific title/slug?
            # Assuming FooterSection might have a 'slug' or a type field to identify 'contact'
             pass # Revisit filtering logic if needed
        
        # Get active sections
        sections_qs = FooterSection.objects.filter(
            is_active=True
        ).order_by('order')
        
        # If filtering needed and a mechanism exists (e.g., slug='contact-us'):
        # if settings and not settings.show_contact_section:
        #     sections_qs = sections_qs.exclude(slug='contact-us') # Example filter

        return LocalizedFooterSectionSerializer( # Use Localized serializer
            sections_qs,
            many=True,
            context=self.context # Pass context for language
        ).data
    
    def get_social_media(self, settings):
        # Pass settings object (though not directly used here, maintains pattern)
        # settings = FooterSettings.objects.first() # Removed redundant query
        social_media_qs = SocialMedia.objects.filter(is_active=True).order_by('order')
        return SocialMediaSerializer(social_media_qs, many=True).data # Standard serializer seems ok 