from rest_framework import viewsets, permissions
from rest_framework.response import Response
from django.utils.translation import get_language
from .models import Testimonial
from .serializers import TestimonialSerializer, TestimonialDetailSerializer, LocalizedTestimonialSerializer

class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows testimonials to be viewed.
    Only approved testimonials are shown to the public.
    """
    queryset = Testimonial.objects.filter(approved=True)
    permission_classes = [permissions.AllowAny]
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['language'] = self.request.query_params.get('lang', get_language() or 'en')
        return context
    
    def get_serializer_class(self):
        if self.action == 'list':
            return LocalizedTestimonialSerializer
        return TestimonialDetailSerializer
        
    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data) 