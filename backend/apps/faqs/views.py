from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils.translation import get_language
from .models import FAQCategory, FAQ
from .serializers import (
    FAQSerializer, 
    FAQCategorySerializer, 
    FAQCategoryWithFAQsSerializer,
    FAQListSerializer,
    FAQLanguageSerializer
)
from rest_framework import viewsets, filters
from rest_framework.decorators import action
from django.db.models import Prefetch


class FAQListView(APIView):
    """API view for listing all FAQs with optional language parameter"""
    
    def get(self, request, format=None):
        """Get all active FAQs and categories"""
        # Get language from query parameter or use default
        language = request.query_params.get('locale', get_language() or 'en')
        
        # Validate language - restrict to supported languages
        if language not in ['en', 'ar']:
            language = 'en'
        
        # Get active categories ordered by their display order
        categories = FAQCategory.objects.filter(is_active=True).order_by('order')
        category_serializer = FAQCategorySerializer(
            categories, 
            many=True, 
            context={'language': language}
        )
        
        # Get active FAQs ordered by category and display order
        faqs = FAQ.objects.filter(
            is_active=True, 
            category__is_active=True
        ).order_by('category__order', 'order')
        faq_serializer = FAQSerializer(
            faqs, 
            many=True, 
            context={'language': language}
        )
        
        # Return combined response
        serializer = FAQListSerializer({
            'categories': category_serializer.data,
            'faqs': faq_serializer.data
        })
        
        return Response(serializer.data)


class FAQCategoryListView(APIView):
    """API view for listing FAQ categories with their FAQs"""
    
    def get(self, request, format=None):
        """Get all active categories with their FAQs"""
        # Get language from query parameter or use default
        language = request.query_params.get('locale', get_language() or 'en')
        
        # Validate language - restrict to supported languages
        if language not in ['en', 'ar']:
            language = 'en'
        
        # Get active categories ordered by their display order
        categories = FAQCategory.objects.filter(is_active=True).order_by('order')
        serializer = FAQCategoryWithFAQsSerializer(
            categories, 
            many=True, 
            context={'language': language}
        )
        
        return Response({
            'categories': serializer.data
        })


class FAQCategoryDetailView(APIView):
    """API view for a specific FAQ category with its FAQs"""
    
    def get(self, request, slug, format=None):
        """Get a specific category with its FAQs"""
        # Get language from query parameter or use default
        language = request.query_params.get('locale', get_language() or 'en')
        
        # Validate language - restrict to supported languages
        if language not in ['en', 'ar']:
            language = 'en'
        
        try:
            # Get the requested category
            category = FAQCategory.objects.get(slug=slug, is_active=True)
        except FAQCategory.DoesNotExist:
            return Response(
                {'error': 'Category not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        serializer = FAQCategoryWithFAQsSerializer(
            category, 
            context={'language': language}
        )
        
        return Response(serializer.data)


class FAQViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for retrieving FAQ items.
    
    list:
        Return a list of all active FAQs.
        
    retrieve:
        Return the given FAQ.
        
    by_category:
        Return a list of FAQ categories with their FAQs.
        
    languages:
        Return a list of languages with active FAQs.
    """
    queryset = FAQ.objects.filter(is_active=True)
    serializer_class = FAQSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['question', 'answer']
    
    def get_queryset(self):
        """
        Optionally restricts the returned FAQs to a given language
        by filtering against a `language` query parameter in the URL.
        """
        queryset = super().get_queryset()
        language = self.request.query_params.get('language', None)
        if language:
            queryset = queryset.filter(language=language)
        return queryset
    
    def get_serializer_context(self):
        """
        Add language to serializer context.
        """
        context = super().get_serializer_context()
        language = self.request.query_params.get('language', 'en')
        context['language'] = language
        return context
    
    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """
        Return a list of FAQ categories with their FAQs.
        Optionally filter by language.
        """
        language = request.query_params.get('language', 'en')
        
        # Get active categories and prefetch related FAQs with language filter
        categories = FAQCategory.objects.filter(
            is_active=True
        ).prefetch_related(
            Prefetch(
                'faqs',
                queryset=FAQ.objects.filter(
                    is_active=True,
                    language=language
                ).order_by('order')
            )
        ).order_by('order')
        
        # Serialize categories with their FAQs
        serializer = FAQCategoryWithFAQsSerializer(
            categories, 
            many=True,
            context={'request': request, 'language': language}
        )
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def languages(self, request):
        """Return a list of languages with active FAQs."""
        languages = set(FAQ.objects.filter(is_active=True).values_list('language', flat=True))
        return Response(sorted(languages))


class FAQCategoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for retrieving FAQ categories.
    
    list:
        Return a list of all active FAQ categories.
        
    retrieve:
        Return the given FAQ category.
    """
    queryset = FAQCategory.objects.filter(is_active=True).order_by('order')
    serializer_class = FAQCategorySerializer
    
    def get_serializer_context(self):
        """
        Add language to serializer context.
        """
        context = super().get_serializer_context()
        language = self.request.query_params.get('language', 'en')
        context['language'] = language
        return context 