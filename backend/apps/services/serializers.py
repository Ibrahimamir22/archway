from rest_framework import serializers
from django.conf import settings
from .models import ServiceCategory, Service, ServiceFeature

# Helper function to get full media URL
def get_absolute_media_url(request, path):
    if not path:
        return None
    if path.startswith('http'):
        return path
    if request:
        return request.build_absolute_uri(f'{settings.MEDIA_URL}{path}')
    return f'/media/{path}'


class ServiceFeatureSerializer(serializers.ModelSerializer):
    """Serializer for service features"""
    class Meta:
        model = ServiceFeature
        fields = ['id', 'name', 'description', 'is_included', 'order']


class ServiceCategorySerializer(serializers.ModelSerializer):
    """Serializer for service categories"""
    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'slug', 'description', 'icon', 'order']


class ServiceListSerializer(serializers.ModelSerializer):
    """Serializer for listing services"""
    category = ServiceCategorySerializer(read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = [
            'id', 'title', 'slug', 'short_description', 'description', 'category',
            'icon', 'image', 'image_url', 'price', 'price_unit', 'duration',
            'is_featured', 'is_published', 'order'
        ]
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        return get_absolute_media_url(request, str(obj.image)) if obj.image else None


class ServiceDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for a single service"""
    category = ServiceCategorySerializer(read_only=True)
    features = ServiceFeatureSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()

    class Meta:
        model = Service
        fields = [
            'id', 'title', 'slug', 'short_description', 'description', 'category',
            'icon', 'image', 'image_url', 'cover_image', 'cover_image_url', 'price', 'price_unit', 'duration',
            'is_featured', 'is_published', 'order', 'features'
        ]
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        return get_absolute_media_url(request, str(obj.image)) if obj.image else None
    
    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        return get_absolute_media_url(request, str(obj.cover_image)) if obj.cover_image else None


# Localized serializers
class LocalizedServiceFeatureSerializer(serializers.ModelSerializer):
    """Service feature serializer with localization support"""
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    
    class Meta:
        model = ServiceFeature
        fields = ['id', 'name', 'description', 'is_included', 'order']
    
    def get_name(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'name_{language}') if getattr(obj, f'name_{language}') else obj.name_en
    
    def get_description(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'description_{language}') if getattr(obj, f'description_{language}') else obj.description_en


class LocalizedServiceCategorySerializer(serializers.ModelSerializer):
    """Service category serializer with localization support"""
    name = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    
    class Meta:
        model = ServiceCategory
        fields = ['id', 'name', 'slug', 'description', 'icon', 'order']
    
    def get_name(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'name_{language}') if getattr(obj, f'name_{language}') else obj.name_en
    
    def get_description(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'description_{language}') if getattr(obj, f'description_{language}') else obj.description_en


class LocalizedServiceListSerializer(serializers.ModelSerializer):
    """Service list serializer with localization support"""
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    short_description = serializers.SerializerMethodField()
    category = LocalizedServiceCategorySerializer(read_only=True)
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Service
        fields = [
            'id', 'title', 'slug', 'short_description', 'description', 'category',
            'icon', 'image', 'image_url', 'price', 'price_unit', 'duration',
            'is_featured', 'is_published', 'order'
        ]
    
    def get_title(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'title_{language}') if getattr(obj, f'title_{language}') else obj.title_en
    
    def get_description(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'description_{language}') if getattr(obj, f'description_{language}') else obj.description_en
    
    def get_short_description(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'short_description_{language}') if getattr(obj, f'short_description_{language}') else obj.short_description_en
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        return get_absolute_media_url(request, str(obj.image)) if obj.image else None


class LocalizedServiceDetailSerializer(serializers.ModelSerializer):
    """Detailed service serializer with localization support"""
    title = serializers.SerializerMethodField()
    description = serializers.SerializerMethodField()
    short_description = serializers.SerializerMethodField()
    category = LocalizedServiceCategorySerializer(read_only=True)
    features = LocalizedServiceFeatureSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()
    cover_image_url = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()
    
    class Meta:
        model = Service
        fields = [
            'id', 'title', 'slug', 'short_description', 'description', 'category', 
            'icon', 'image', 'image_url', 'cover_image', 'cover_image_url', 'price', 'price_unit', 'duration',
            'is_featured', 'is_published', 'order', 'features'
        ]
    
    def get_title(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'title_{language}') if getattr(obj, f'title_{language}') else obj.title_en
    
    def get_description(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'description_{language}') if getattr(obj, f'description_{language}') else obj.description_en
    
    def get_short_description(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'short_description_{language}') if getattr(obj, f'short_description_{language}') else obj.short_description_en
    
    def get_image_url(self, obj):
        request = self.context.get('request')
        return get_absolute_media_url(request, str(obj.image)) if obj.image else None
    
    def get_cover_image_url(self, obj):
        request = self.context.get('request')
        return get_absolute_media_url(request, str(obj.cover_image)) if obj.cover_image else None
    
    def get_price(self, obj):
        language = self.context.get('language', 'en')
        if obj.price is None:
            return None
            
        # Use Arabic numerals for Arabic language
        if language == 'ar':
            # Convert to Arabic numerals
            price_str = str(obj.price)
            eastern_arabic = '٠١٢٣٤٥٦٧٨٩'
            western_arabic = '0123456789'
            for i, num in enumerate(western_arabic):
                price_str = price_str.replace(num, eastern_arabic[i])
            return price_str
        return obj.price 