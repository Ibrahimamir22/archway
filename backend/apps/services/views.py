from django.shortcuts import render
from rest_framework import viewsets, permissions, filters, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.utils.translation import get_language
from django.db.models import Q
from django_filters.rest_framework import DjangoFilterBackend
from .models import Service, ServiceCategory, ServiceFeature
from .serializers import (
    ServiceListSerializer, ServiceDetailSerializer, ServiceCategorySerializer, 
    ServiceFeatureSerializer, LocalizedServiceListSerializer, 
    LocalizedServiceDetailSerializer, LocalizedServiceCategorySerializer,
    LocalizedServiceFeatureSerializer
)


class ServiceViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows services to be viewed.
    """
    queryset = Service.objects.all()
    permission_classes = [permissions.AllowAny]
    filter_backends = [filters.SearchFilter, DjangoFilterBackend, filters.OrderingFilter]
    search_fields = ['title_en', 'title_ar', 'description_en', 'description_ar']
    filterset_fields = ['category__slug', 'is_featured', 'is_published']
    ordering_fields = ['order', 'title_en', 'created_at']
    ordering = ['order', 'title_en']
    lookup_field = 'slug'
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['language'] = self.request.query_params.get('lang', get_language() or 'en')
        # Make sure the request is included in context for building absolute URLs
        context['request'] = self.request
        return context
    
    def get_serializer_class(self):
        if self.action == 'list':
            return LocalizedServiceListSerializer
        return LocalizedServiceDetailSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # By default, only show published services unless explicitly requested
        if 'is_published' not in self.request.query_params:
            queryset = queryset.filter(is_published=True)
        
        # Filter by category
        category_slug = self.request.query_params.get('category')
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        
        # Filter by featured status
        featured = self.request.query_params.get('featured')
        if featured:
            queryset = queryset.filter(is_featured=featured.lower() == 'true')
        
        # Search functionality
        search_query = self.request.query_params.get('search')
        if search_query:
            language = self.request.query_params.get('lang', get_language() or 'en')
            if language == 'ar':
                queryset = queryset.filter(
                    Q(title_ar__icontains=search_query) |
                    Q(description_ar__icontains=search_query)
                )
            else:
                queryset = queryset.filter(
                    Q(title_en__icontains=search_query) |
                    Q(description_en__icontains=search_query)
                )
        
        return queryset


class ServiceCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows service categories to be viewed.
    """
    queryset = ServiceCategory.objects.all()
    permission_classes = [permissions.AllowAny]
    lookup_field = 'slug'
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['language'] = self.request.query_params.get('lang', get_language() or 'en')
        return context
    
    def get_serializer_class(self):
        return LocalizedServiceCategorySerializer
    
    def list(self, request, *args, **kwargs):
        """Override list method to return empty list instead of 404 when no categories exist"""
        queryset = self.filter_queryset(self.get_queryset())
        
        # If queryset is empty, return an empty list rather than 404
        if not queryset.exists():
            serializer = self.get_serializer([], many=True)
            return Response(serializer.data)
            
        # Otherwise proceed with standard pagination
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
