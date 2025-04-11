from rest_framework import serializers
from .models import Testimonial

class TestimonialSerializer(serializers.ModelSerializer):
    """Base serializer for testimonials"""
    class Meta:
        model = Testimonial
        fields = ['id', 'client_name', 'quote', 'project', 'created_at']

class TestimonialDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer that includes all fields including translations"""
    class Meta:
        model = Testimonial
        fields = [
            'id', 'client_name_en', 'client_name_ar', 'quote_en', 'quote_ar',
            'project', 'approved', 'created_at', 'updated_at'
        ]

class LocalizedTestimonialSerializer(serializers.ModelSerializer):
    """Serializer that returns fields based on the requested language"""
    client_name = serializers.SerializerMethodField()
    quote = serializers.SerializerMethodField()
    
    class Meta:
        model = Testimonial
        fields = ['id', 'client_name', 'quote', 'project', 'created_at']
        
    def get_client_name(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'client_name_{language}') if getattr(obj, f'client_name_{language}') else obj.client_name_en
    
    def get_quote(self, obj):
        language = self.context.get('language', 'en')
        return getattr(obj, f'quote_{language}') if getattr(obj, f'quote_{language}') else obj.quote_en 