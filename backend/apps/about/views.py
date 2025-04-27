from django.utils.translation import gettext_lazy as _
from django.core.cache import cache
from django.conf import settings

from rest_framework import viewsets, generics, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    AboutPage, TeamMember, CoreValue, Testimonial,
    CompanyHistory, CompanyStatistic, ClientLogo
)
from .serializers import (
    AboutPageSerializer, TeamMemberSerializer, CoreValueSerializer,
    TestimonialSerializer, CompanyHistorySerializer, CompanyStatisticSerializer,
    ClientLogoSerializer, LocalizedAboutPageSerializer
)
from .services import get_about_page_content

class AboutPageView(generics.RetrieveAPIView):
    """
    Returns the main about page content
    """
    queryset = AboutPage.objects.all()
    serializer_class = AboutPageSerializer
    
    def get_serializer_class(self):
        if self.request.query_params.get('localized', 'false').lower() == 'true':
            return LocalizedAboutPageSerializer
        return AboutPageSerializer
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['language'] = self.request.query_params.get('lang', 'en')
        return context
    
    def get_object(self):
        # Get the first AboutPage object or create one if it doesn't exist
        cache_key = 'about_page_main_content'
        obj = cache.get(cache_key)
        
        if not obj:
            obj, created = AboutPage.objects.get_or_create(
                pk=1,
                defaults={
                    'title': 'About Archway Innovations',
                    'subtitle': 'Transforming Spaces, Enhancing Lives',
                    'mission_title': 'Our Mission',
                    'mission_description': 'To create innovative interior designs that balance aesthetics, functionality, and sustainability while exceeding client expectations.',
                    'vision_title': 'Our Vision',
                    'vision_description': 'To be the leading interior design firm, recognized for our exceptional designs and sustainable practices that enhance quality of life.',
                    'team_section_title': 'Meet Our Team',
                    'values_section_title': 'Our Core Values',
                    'testimonials_section_title': 'What Our Clients Say',
                    'history_section_title': 'Our Journey',
                    # Arabic defaults
                    'title_ar': 'عن آركواي للابتكارات',
                    'subtitle_ar': 'تحويل المساحات، تعزيز الحياة',
                    'mission_title_ar': 'مهمتنا',
                    'mission_description_ar': 'إنشاء تصاميم داخلية مبتكرة توازن بين الجماليات والوظائف والاستدامة مع تجاوز توقعات العملاء.',
                    'vision_title_ar': 'رؤيتنا',
                    'vision_description_ar': 'أن نكون شركة التصميم الداخلي الرائدة، المعروفة بتصاميمنا الاستثنائية وممارساتنا المستدامة التي تعزز جودة الحياة.',
                    'team_section_title_ar': 'تعرف على فريقنا',
                    'values_section_title_ar': 'قيمنا الأساسية',
                    'testimonials_section_title_ar': 'ماذا يقول عملاؤنا',
                    'history_section_title_ar': 'رحلتنا',
                }
            )
            cache.set(cache_key, obj, 3600)  # Cache for 1 hour
            
        return obj


class CombinedAboutView(APIView):
    """
    Returns combined data for the About page including:
    - Main content
    - Core values
    - Team members (featured)
    - Testimonials (featured)
    - Company statistics
    - Company history events
    """
    def get(self, request):
        language = request.query_params.get('lang', 'en')
        combined_data = get_about_page_content(language, request)
        return Response(combined_data)


class TeamMemberViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for team members
    """
    queryset = TeamMember.objects.filter(is_active=True)
    serializer_class = TeamMemberSerializer
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ['is_featured', 'department']
    search_fields = ['name', 'role', 'department']
    ordering_fields = ['order', 'name', 'created_at']
    ordering = ['order', 'name']
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Cache team members for better performance
        cache_key = f"team_members:{self.request.query_params}"
        cached_data = cache.get(cache_key)
        
        if cached_data is not None:
            return cached_data
        
        # Apply additional filters if needed
        department = self.request.query_params.get('department')
        if department:
            queryset = queryset.filter(department=department)
            
        # Cache the result
        cache.set(cache_key, queryset, 3600)  # Cache for 1 hour
        
        return queryset


class CoreValueViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for company core values
    """
    queryset = CoreValue.objects.all()
    serializer_class = CoreValueSerializer
    filter_backends = [OrderingFilter]
    ordering_fields = ['order']
    ordering = ['order']


class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for testimonials
    """
    queryset = Testimonial.objects.all()
    serializer_class = TestimonialSerializer
    filter_backends = [DjangoFilterBackend, OrderingFilter]
    filterset_fields = ['is_featured']
    ordering_fields = ['created_at']
    ordering = ['-created_at']


class CompanyHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for company history
    """
    queryset = CompanyHistory.objects.all()
    serializer_class = CompanyHistorySerializer
    filter_backends = [OrderingFilter]
    ordering_fields = ['year']
    ordering = ['-year']


class CompanyStatisticViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for company statistics
    """
    queryset = CompanyStatistic.objects.all()
    serializer_class = CompanyStatisticSerializer
    filter_backends = [OrderingFilter]
    ordering_fields = ['order']
    ordering = ['order']


class ClientLogoViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for client logos
    """
    queryset = ClientLogo.objects.filter(is_active=True)
    serializer_class = ClientLogoSerializer
    filter_backends = [OrderingFilter]
    ordering_fields = ['order', 'name']
    ordering = ['order', 'name']
