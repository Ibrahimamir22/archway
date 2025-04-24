from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FooterSettingsViewSet, 
    FooterSectionViewSet, 
    FooterLinkViewSet, 
    SocialMediaViewSet,
    FooterCompleteView,
    FooterBottomLinkViewSet
)

# Create a router and register viewsets
router = DefaultRouter()
router.register(r'settings', FooterSettingsViewSet)
router.register(r'sections', FooterSectionViewSet)
router.register(r'links', FooterLinkViewSet)
router.register(r'social-media', SocialMediaViewSet)
router.register(r'bottom-links', FooterBottomLinkViewSet)

# URLs for the footer app
urlpatterns = [
    # Include the router URLs
    path('', include(router.urls)),
    
    # Complete footer data endpoint
    path('all/', FooterCompleteView.as_view(), name='footer-complete'),
]
