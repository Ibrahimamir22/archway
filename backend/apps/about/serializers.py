from rest_framework import serializers
from .models import (
    AboutPage, TeamMember, CoreValue, Testimonial,
    CompanyHistory, CompanyStatistic, ClientLogo
)

class AboutPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutPage
        fields = [
            'title', 'subtitle', 'mission_title', 'mission_description',
            'vision_title', 'vision_description', 'team_section_title',
            'values_section_title', 'testimonials_section_title',
            'history_section_title', 'meta_description',
            'title_ar', 'subtitle_ar', 'mission_title_ar', 'mission_description_ar',
            'vision_title_ar', 'vision_description_ar', 'team_section_title_ar',
            'values_section_title_ar', 'testimonials_section_title_ar',
            'history_section_title_ar', 'meta_description_ar'
        ]


class TeamMemberSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = TeamMember
        fields = [
            'id', 'name', 'role', 'bio', 'image', 'image_url', 'email', 'linkedin',
            'department', 'is_featured', 'name_ar', 'role_ar', 'bio_ar',
            'department_ar'
        ]
    
    def get_image_url(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None


class CoreValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoreValue
        fields = [
            'id', 'title', 'description', 'icon', 'order',
            'title_ar', 'description_ar'
        ]


class TestimonialSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Testimonial
        fields = [
            'id', 'client_name', 'quote', 'project', 'is_featured',
            'role', 'company', 'image', 'image_url', 'rating', 'industry',  
            'client_name_ar', 'quote_ar', 'project_ar', 'role_ar', 
            'company_ar', 'industry_ar', 'created_at'
        ]
    
    def get_image_url(self, obj):
        if obj.image:
            try:
                return self.context['request'].build_absolute_uri(obj.image.url)
            except (KeyError, AttributeError):
                if hasattr(obj.image, 'url'):
                    return obj.image.url
        return None


class CompanyHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyHistory
        fields = [
            'id', 'year', 'title', 'description',
            'title_ar', 'description_ar'
        ]


class CompanyStatisticSerializer(serializers.ModelSerializer):
    class Meta:
        model = CompanyStatistic
        fields = [
            'id', 'title', 'value', 'unit', 'order',
            'title_ar', 'unit_ar'
        ]


class ClientLogoSerializer(serializers.ModelSerializer):
    logo_url = serializers.SerializerMethodField()
    
    class Meta:
        model = ClientLogo
        fields = [
            'id', 'name', 'logo', 'logo_url', 'url', 'order', 
            'name_ar'
        ]
    
    def get_logo_url(self, obj):
        if obj.logo:
            return self.context['request'].build_absolute_uri(obj.logo.url)
        return None


# Localized serializers
class LocalizedAboutPageSerializer(serializers.ModelSerializer):
    """
    Returns only fields for the requested language
    """
    title = serializers.SerializerMethodField()
    subtitle = serializers.SerializerMethodField()
    mission_title = serializers.SerializerMethodField()
    mission_description = serializers.SerializerMethodField()
    vision_title = serializers.SerializerMethodField()
    vision_description = serializers.SerializerMethodField()
    team_section_title = serializers.SerializerMethodField()
    values_section_title = serializers.SerializerMethodField()
    testimonials_section_title = serializers.SerializerMethodField()
    history_section_title = serializers.SerializerMethodField()
    meta_description = serializers.SerializerMethodField()
    
    class Meta:
        model = AboutPage
        fields = [
            'title', 'subtitle', 'mission_title', 'mission_description',
            'vision_title', 'vision_description', 'team_section_title',
            'values_section_title', 'testimonials_section_title',
            'history_section_title', 'meta_description',
        ]
    
    def _get_language(self):
        return self.context.get('language', 'en')
    
    def _get_localized_field(self, obj, field_name):
        language = self._get_language()
        if language == 'ar':
            return getattr(obj, f"{field_name}_ar")
        return getattr(obj, field_name)
    
    def get_title(self, obj):
        return self._get_localized_field(obj, 'title')
    
    def get_subtitle(self, obj):
        return self._get_localized_field(obj, 'subtitle')
    
    def get_mission_title(self, obj):
        return self._get_localized_field(obj, 'mission_title')
    
    def get_mission_description(self, obj):
        return self._get_localized_field(obj, 'mission_description')
    
    def get_vision_title(self, obj):
        return self._get_localized_field(obj, 'vision_title')
    
    def get_vision_description(self, obj):
        return self._get_localized_field(obj, 'vision_description')
    
    def get_team_section_title(self, obj):
        return self._get_localized_field(obj, 'team_section_title')
    
    def get_values_section_title(self, obj):
        return self._get_localized_field(obj, 'values_section_title')
    
    def get_testimonials_section_title(self, obj):
        return self._get_localized_field(obj, 'testimonials_section_title')
    
    def get_history_section_title(self, obj):
        return self._get_localized_field(obj, 'history_section_title')
    
    def get_meta_description(self, obj):
        return self._get_localized_field(obj, 'meta_description')


# New localized serializers
class LocalizedTeamMemberSerializer(serializers.ModelSerializer):
    """
    Returns only fields for the requested language
    """
    image_url = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    bio = serializers.SerializerMethodField()
    department = serializers.SerializerMethodField()
    
    class Meta:
        model = TeamMember
        fields = [
            'id', 'name', 'role', 'bio', 'image', 'image_url', 'email', 'linkedin',
            'department', 'is_featured'
        ]
    
    def _get_language(self):
        return self.context.get('language', 'en')
    
    def _get_localized_field(self, obj, field_name):
        language = self._get_language()
        if language == 'ar':
            ar_value = getattr(obj, f"{field_name}_ar")
            if ar_value:  # Only use Arabic if it's available
                return ar_value
        return getattr(obj, field_name)
    
    def get_image_url(self, obj):
        if obj.image:
            return self.context['request'].build_absolute_uri(obj.image.url)
        return None
    
    def get_name(self, obj):
        return self._get_localized_field(obj, 'name')
    
    def get_role(self, obj):
        return self._get_localized_field(obj, 'role')
    
    def get_bio(self, obj):
        return self._get_localized_field(obj, 'bio')
    
    def get_department(self, obj):
        return self._get_localized_field(obj, 'department')


class LocalizedCoreValueSerializer(serializers.ModelSerializer):
    """
    Returns only fields for the requested language
    """
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    
    class Meta:
        model = CoreValue
        fields = [
            'id', 'title', 'description', 'icon', 'order'
        ]
    
    def _get_language(self):
        return self.context.get('language', 'en')
    
    def _get_localized_field(self, obj, field_name):
        language = self._get_language()
        if language == 'ar':
            ar_value = getattr(obj, f"{field_name}_ar")
            if ar_value:  # Only use Arabic if it's available
                return ar_value
        return getattr(obj, field_name)
    
    def get_title(self, obj):
        return self._get_localized_field(obj, 'title')
    
    def get_description(self, obj):
        return self._get_localized_field(obj, 'description')


class LocalizedTestimonialSerializer(serializers.ModelSerializer):
    """
    Returns only fields for the requested language
    """
    image_url = serializers.SerializerMethodField()
    client_name = serializers.SerializerMethodField()
    quote = serializers.SerializerMethodField()
    project = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    company = serializers.SerializerMethodField()
    industry = serializers.SerializerMethodField()
    
    class Meta:
        model = Testimonial
        fields = [
            'id', 'client_name', 'quote', 'project', 'is_featured',
            'role', 'company', 'image', 'image_url', 'rating', 'industry', 'created_at'
        ]
    
    def _get_language(self):
        return self.context.get('language', 'en')
    
    def _get_localized_field(self, obj, field_name):
        language = self._get_language()
        if language == 'ar':
            ar_value = getattr(obj, f"{field_name}_ar", None)
            if ar_value:  # Only use Arabic if it's available
                return ar_value
        return getattr(obj, field_name)
    
    def get_image_url(self, obj):
        if obj.image:
            try:
                return self.context['request'].build_absolute_uri(obj.image.url)
            except (KeyError, AttributeError):
                if hasattr(obj.image, 'url'):
                    return obj.image.url
        return None
    
    def get_client_name(self, obj):
        return self._get_localized_field(obj, 'client_name')
    
    def get_quote(self, obj):
        return self._get_localized_field(obj, 'quote')
    
    def get_project(self, obj):
        return self._get_localized_field(obj, 'project')
    
    def get_role(self, obj):
        return self._get_localized_field(obj, 'role')
    
    def get_company(self, obj):
        return self._get_localized_field(obj, 'company')
    
    def get_industry(self, obj):
        return self._get_localized_field(obj, 'industry')


class LocalizedCompanyHistorySerializer(serializers.ModelSerializer):
    """
    Returns only fields for the requested language
    """
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    
    class Meta:
        model = CompanyHistory
        fields = [
            'id', 'year', 'title', 'description'
        ]
    
    def _get_language(self):
        return self.context.get('language', 'en')
    
    def _get_localized_field(self, obj, field_name):
        language = self._get_language()
        if language == 'ar':
            ar_value = getattr(obj, f"{field_name}_ar")
            if ar_value:  # Only use Arabic if it's available
                return ar_value
        return getattr(obj, field_name)
    
    def get_title(self, obj):
        return self._get_localized_field(obj, 'title')
    
    def get_description(self, obj):
        return self._get_localized_field(obj, 'description')


class LocalizedCompanyStatisticSerializer(serializers.ModelSerializer):
    """
    Returns only fields for the requested language
    """
    title = serializers.SerializerMethodField()
    unit = serializers.SerializerMethodField()
    
    class Meta:
        model = CompanyStatistic
        fields = [
            'id', 'title', 'value', 'unit', 'order'
        ]
    
    def _get_language(self):
        return self.context.get('language', 'en')
    
    def _get_localized_field(self, obj, field_name):
        language = self._get_language()
        if language == 'ar':
            ar_value = getattr(obj, f"{field_name}_ar")
            if ar_value:  # Only use Arabic if it's available
                return ar_value
        return getattr(obj, field_name)
    
    def get_title(self, obj):
        return self._get_localized_field(obj, 'title')
    
    def get_unit(self, obj):
        return self._get_localized_field(obj, 'unit')


class LocalizedClientLogoSerializer(serializers.ModelSerializer):
    """
    Returns only fields for the requested language
    """
    logo_url = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    
    class Meta:
        model = ClientLogo
        fields = [
            'id', 'name', 'logo', 'logo_url', 'url', 'order'
        ]
    
    def _get_language(self):
        return self.context.get('language', 'en')
    
    def _get_localized_field(self, obj, field_name):
        language = self._get_language()
        if language == 'ar':
            ar_value = getattr(obj, f"{field_name}_ar")
            if ar_value:  # Only use Arabic if it's available
                return ar_value
        return getattr(obj, field_name)
    
    def get_logo_url(self, obj):
        if obj.logo:
            return self.context['request'].build_absolute_uri(obj.logo.url)
        return None
    
    def get_name(self, obj):
        return self._get_localized_field(obj, 'name')
