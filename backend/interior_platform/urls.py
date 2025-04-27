"""
URL configuration for interior_platform project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.conf.urls.i18n import i18n_patterns
from django.views.static import serve
from rest_framework import routers
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.reverse import reverse
from apps.projects.views import ProjectViewSet, CategoryViewSet, TagViewSet
from apps.testimonials.views import TestimonialViewSet
# from apps.contact.views import ContactViewSet, ContactInfoViewSet, FooterAPIView
from apps.contact_management.views import ContactViewSet, ContactInfoViewSet
from apps.footer.views import FooterSectionViewSet
from apps.newsletter.views import NewsletterSubscriptionViewSet
from apps.email_system.views import EmailDeliveryViewSet
from apps.services.views import ServiceViewSet, ServiceCategoryViewSet
from apps.faqs.views import FAQViewSet

@api_view(['GET'])
@permission_classes([AllowAny])
def api_root(request, format=None):
    """
    API root view that lists all available endpoints
    """
    return Response({
        'projects': reverse('project-list', request=request, format=format),
        'categories': reverse('projectcategory-list', request=request, format=format),
        'tags': reverse('tag-list', request=request, format=format),
        'testimonials': reverse('testimonial-list', request=request, format=format),
        'contact': reverse('contact-list', request=request, format=format),
        'contact-info': reverse('contact-info-list', request=request, format=format),
        'services': reverse('service-list', request=request, format=format),
        'service-categories': reverse('servicecategory-list', request=request, format=format),
        'footer': reverse('footer', request=request, format=format),
        # New endpoints
        'newsletter': reverse('newsletter:subscription-list', request=request, format=format),
        'footer-sections': reverse('footer:section-list', request=request, format=format),
        'email-system': reverse('email_system:delivery-list', request=request, format=format),
        'faqs': reverse('faqs:faq-list', request=request, format=format),
        # Commented until analytics app is enabled
        # 'analytics': reverse('pageview-list', request=request, format=format),
    })

# Default router for API endpoints
router = routers.DefaultRouter()
router.register(r'projects', ProjectViewSet, basename='project')
router.register(r'categories', CategoryViewSet, basename='projectcategory')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'testimonials', TestimonialViewSet, basename='testimonial')
router.register(r'contact', ContactViewSet, basename='contact')
router.register(r'contact-info', ContactInfoViewSet, basename='contact-info')
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'service-categories', ServiceCategoryViewSet, basename='servicecategory')
router.register(r'faqs', FAQViewSet, basename='faq')

# API URLs
api_patterns = [
    path('v1/', include(router.urls)),
    path('v1/', api_root, name='api-root'),
    # Original contact app for backward compatibility
    # path('v1/', include('apps.contact.urls')),  
    
    # New reorganized apps
    path('v1/newsletter/', include('apps.newsletter.urls')),
    path('v1/footer/', include('apps.footer.urls')),
    path('v1/contact/', include('apps.contact_management.urls')),
    path('v1/email/', include('apps.email_system.urls')),
    path('v1/faqs/', include('apps.faqs.urls', namespace='faqs')),
    path('v1/about/', include('apps.about.urls', namespace='about')),
    
    # Commented until analytics app is enabled
    # path('v1/analytics/', include('apps.analytics.urls')),
    path('auth/', include('rest_framework.urls')),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(api_patterns)),
    path('i18n/', include('django.conf.urls.i18n')),
]

# Add static and media URLs for development
urlpatterns += [
    path('static/<path:path>', serve, {'document_root': settings.STATIC_ROOT}),
    path('media/<path:path>', serve, {'document_root': settings.MEDIA_ROOT}),
]

# Add internationalization to core patterns (except API and admin)
urlpatterns += i18n_patterns(
    # Add localized views here if needed
    prefix_default_language=True,
)

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
