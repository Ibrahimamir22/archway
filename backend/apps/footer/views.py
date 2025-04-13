from django.shortcuts import render
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.utils.translation import get_language
from .models import FooterSettings, FooterSection, FooterLink, SocialMedia
from .serializers import (
    FooterSettingsSerializer, FooterSectionSerializer, FooterLinkSerializer, 
    SocialMediaSerializer, LocalizedFooterSettingsSerializer, 
    LocalizedFooterSectionSerializer, FooterSerializer
)

# Create your views here.

class FooterSettingsViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for footer settings"""
    queryset = FooterSettings.objects.all()
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['language'] = self.request.query_params.get('lang', get_language() or 'en')
        return context
    
    def get_serializer_class(self):
        return LocalizedFooterSettingsSerializer
    
    def list(self, request, *args, **kwargs):
        # Always return the first footer settings if it exists
        try:
            settings = FooterSettings.objects.first()
            if settings:
                serializer = self.get_serializer(settings)
                return Response(serializer.data)
            # Return empty object if no settings exist
            return Response({})
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class FooterSectionViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for footer sections"""
    queryset = FooterSection.objects.filter(is_active=True)
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['language'] = self.request.query_params.get('lang', get_language() or 'en')
        return context
    
    def get_serializer_class(self):
        return LocalizedFooterSectionSerializer

class FooterLinkViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for footer links"""
    queryset = FooterLink.objects.filter(is_active=True)
    serializer_class = FooterLinkSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        queryset = FooterLink.objects.filter(is_active=True)
        section_slug = self.request.query_params.get('section', None)
        if section_slug:
            queryset = queryset.filter(section__slug=section_slug)
        return queryset.order_by('section', 'order')

class SocialMediaViewSet(viewsets.ReadOnlyModelViewSet):
    """API endpoint for social media links"""
    queryset = SocialMedia.objects.filter(is_active=True)
    serializer_class = SocialMediaSerializer
    permission_classes = [permissions.AllowAny]

class FooterAPIView(APIView):
    """API endpoint that returns all footer data in a single request"""
    permission_classes = [permissions.AllowAny]
    
    def get(self, request, format=None):
        # Get language from query params or default to Django's active language
        language = request.query_params.get('lang', get_language() or 'en')
        
        # Create a dummy object for the serializer
        serializer = FooterSerializer({}, context={'language': language})
        return Response(serializer.data)
