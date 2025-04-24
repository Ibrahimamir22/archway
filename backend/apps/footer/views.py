from django.shortcuts import render, get_object_or_404
from rest_framework import viewsets, permissions, status, views
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils.translation import gettext_lazy as _
from django.utils.translation import get_language
from .models import FooterSettings, FooterSection, FooterLink, SocialMedia, FooterBottomLink
from .serializers import (
    FooterSettingsSerializer, FooterSectionSerializer, FooterLinkSerializer, 
    SocialMediaSerializer, LocalizedFooterSettingsSerializer, 
    LocalizedFooterSectionSerializer, FooterSerializer, FooterBottomLinkSerializer
)

# Create your views here.

class FooterSettingsViewSet(viewsets.ModelViewSet):
    """
    Viewset for managing footer settings
    """
    queryset = FooterSettings.objects.all()
    serializer_class = FooterSettingsSerializer

    @action(detail=False, methods=['get'])
    def localized(self, request):
        """Get footer settings with proper localization based on language parameter"""
        lang = request.query_params.get('lang') or get_language()
        settings = self.get_queryset().first()
        
        if not settings:
            return Response({"detail": "No footer settings found"}, status=status.HTTP_404_NOT_FOUND)
            
        serializer = self.get_serializer(settings)
        data = serializer.data
        
        # Apply language-specific overrides if available
        if lang == 'ar' and settings.contact_title_ar:
            data['contact_us_title'] = settings.contact_title_ar
            
        return Response(data)

class FooterSectionViewSet(viewsets.ModelViewSet):
    """
    Viewset for managing footer sections
    """
    queryset = FooterSection.objects.all()
    serializer_class = FooterSectionSerializer
    
    def get_queryset(self):
        """Filter to show only active sections by default"""
        queryset = super().get_queryset()
        
        # If in admin context or explicitly requesting all, return everything
        if self.request.query_params.get('all') == 'true':
            return queryset
        
        # Otherwise return only active sections
        return queryset.filter(is_active=True)
    
    @action(detail=True, methods=['get'])
    def links(self, request, pk=None):
        """Get all links for a specific section"""
        section = self.get_object()
        links = FooterLink.objects.filter(section=section, is_active=True)
        serializer = FooterLinkSerializer(links, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def localized(self, request):
        """
        Get localized footer sections based on the language parameter.
        
        Example: /api/footer/sections/localized/?lang=ar
        """
        # Get language from query parameter or use the current language
        language = request.query_params.get('lang', get_language())
        
        # Get active sections 
        sections = self.get_queryset()
        
        serializer = LocalizedFooterSectionSerializer(
            sections, 
            many=True, 
            context={'language': language}
        )
        return Response(serializer.data)

class FooterLinkViewSet(viewsets.ModelViewSet):
    """
    Viewset for managing footer links
    """
    queryset = FooterLink.objects.all()
    serializer_class = FooterLinkSerializer
    
    def get_queryset(self):
        """Filter to show only active links by default"""
        queryset = super().get_queryset()
        
        # If in admin context or explicitly requesting all, return everything
        if self.request.query_params.get('all') == 'true':
            return queryset
        
        # Otherwise return only active links
        return queryset.filter(is_active=True)
    
    @action(detail=False, methods=['get'])
    def for_section(self, request):
        """Get links for a specific section by slug"""
        section_slug = request.query_params.get('section_slug')
        if not section_slug:
            return Response(
                {"detail": "section_slug parameter is required"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        section = get_object_or_404(FooterSection, slug=section_slug, is_active=True)
        links = self.get_queryset().filter(section=section)
        serializer = self.get_serializer(links, many=True)
        return Response(serializer.data)

class SocialMediaViewSet(viewsets.ModelViewSet):
    """
    Viewset for managing social media links
    """
    queryset = SocialMedia.objects.all()
    serializer_class = SocialMediaSerializer
    
    def get_queryset(self):
        """Filter to show only active social media links by default"""
        queryset = super().get_queryset()
        
        # If in admin context or explicitly requesting all, return everything
        if self.request.query_params.get('all') == 'true':
            return queryset
        
        # Otherwise return only active social media links
        return queryset.filter(is_active=True)

class FooterBottomLinkViewSet(viewsets.ModelViewSet):
    """
    Viewset for managing footer bottom links (Terms, Privacy Policy, etc.)
    """
    queryset = FooterBottomLink.objects.all()
    serializer_class = FooterBottomLinkSerializer
    
    def get_queryset(self):
        """Filter to show only active bottom links by default"""
        queryset = super().get_queryset()
        
        # If in admin context or explicitly requesting all, return everything
        if self.request.query_params.get('all') == 'true':
            return queryset
        
        # Otherwise return only active links
        return queryset.filter(is_active=True)

class FooterCompleteView(views.APIView):
    """
    View to get complete footer data in a single API call
    """
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        """Get complete footer data with optional language parameter"""
        lang = request.query_params.get('lang') or get_language()
        
        # Get footer settings
        settings = FooterSettings.objects.first()
        settings_serializer = LocalizedFooterSettingsSerializer(settings, context={'language': lang}) if settings else None
        
        # Get active sections with their links
        sections = FooterSection.objects.filter(is_active=True).order_by('order')
        sections_serializer = LocalizedFooterSectionSerializer(sections, many=True, context={'language': lang})
        
        # Get active social media links
        social_media = SocialMedia.objects.filter(is_active=True).order_by('order')
        social_media_serializer = SocialMediaSerializer(social_media, many=True)
        
        # Get active bottom links
        bottom_links = FooterBottomLink.objects.filter(is_active=True).order_by('order')
        bottom_links_serializer = FooterBottomLinkSerializer(bottom_links, many=True, context={'language': lang})
        
        # Combine all data
        data = {
            'settings': settings_serializer.data if settings else None,
            'sections': sections_serializer.data,
            'social_media': social_media_serializer.data,
            'bottom_links': bottom_links_serializer.data
        }
        
        return Response(data) 