from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    FooterSettingsViewSet, FooterSectionViewSet,
    FooterLinkViewSet, SocialMediaViewSet,
    FooterAPIView
)

router = DefaultRouter()
router.register('settings', FooterSettingsViewSet, basename='settings')
router.register('sections', FooterSectionViewSet, basename='section')
router.register('links', FooterLinkViewSet, basename='link')
router.register('social-media', SocialMediaViewSet, basename='social-media')

app_name = 'footer'

urlpatterns = [
    path('', include(router.urls)),
    path('all/', FooterAPIView.as_view(), name='footer-all'),
] 