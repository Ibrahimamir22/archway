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
from rest_framework import routers
from apps.projects.views import ProjectViewSet, CategoryViewSet, TagViewSet
from apps.testimonials.views import TestimonialViewSet
from apps.contact.views import ContactViewSet

# Default router for API endpoints
router = routers.DefaultRouter()
router.register(r'projects', ProjectViewSet)
router.register(r'projects/categories', CategoryViewSet)
router.register(r'projects/tags', TagViewSet)
router.register(r'testimonials', TestimonialViewSet)
router.register(r'contact', ContactViewSet, basename='contact')

# API URLs
api_patterns = [
    path('v1/', include(router.urls)),
    path('auth/', include('rest_framework.urls')),
]

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(api_patterns)),
    path('i18n/', include('django.conf.urls.i18n')),
]

# Add internationalization to core patterns (except API and admin)
urlpatterns += i18n_patterns(
    # Add localized views here if needed
    prefix_default_language=True,
)

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
