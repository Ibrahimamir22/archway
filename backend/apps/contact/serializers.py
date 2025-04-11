from rest_framework import serializers
from .models import ContactMessage, ContactInfo
import re

class ContactMessageSerializer(serializers.ModelSerializer):
    """Serializer for contact form submissions"""
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'phone', 'message']
        
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

class ContactInfoSerializer(serializers.ModelSerializer):
    """Serializer for company contact information"""
    class Meta:
        model = ContactInfo
        fields = [
            'address_en', 'address_ar', 'email', 
            'phone', 'facebook_url', 'instagram_url'
        ]
    
    def to_representation(self, instance):
        """Customize output based on language preference"""
        data = super().to_representation(instance)
        request = self.context.get('request')
        
        # Handle language preference if available
        if request and request.query_params.get('lang') == 'ar':
            # For Arabic, we might want to reorder fields or make other adjustments
            pass
        
        return data 