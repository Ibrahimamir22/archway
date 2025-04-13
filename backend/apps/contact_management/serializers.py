from rest_framework import serializers
from .models import ContactMessage, ContactInfo

class ContactMessageSerializer(serializers.ModelSerializer):
    """Serializer for contact form submissions"""
    class Meta:
        model = ContactMessage
        fields = ['id', 'name', 'email', 'phone', 'message', 'created_at']
        read_only_fields = ['id', 'created_at']

class ContactInfoSerializer(serializers.ModelSerializer):
    """Serializer for company contact information"""
    class Meta:
        model = ContactInfo
        fields = ['address_en', 'address_ar', 'email', 'phone', 
                 'facebook_url', 'instagram_url', 'updated_at']
        read_only_fields = ['updated_at'] 