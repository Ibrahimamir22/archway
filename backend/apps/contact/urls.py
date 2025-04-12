from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ContactViewSet, ContactMessageViewSet, 
    ContactInfoViewSet, FooterSettingsViewSet,
    FooterSectionViewSet, SocialMediaViewSet,
    NewsletterSubscriptionViewSet, FooterAPIView
)

router = DefaultRouter()
router.register(r'contact', ContactViewSet, basename='contact')
router.register(r'contact-messages', ContactMessageViewSet, basename='contact-messages')
router.register(r'contact-info', ContactInfoViewSet, basename='contact-info')
router.register(r'footer-settings', FooterSettingsViewSet, basename='footer-settings')
router.register(r'footer-sections', FooterSectionViewSet, basename='footer-sections')
router.register(r'social-media', SocialMediaViewSet, basename='social-media')
router.register(r'newsletter', NewsletterSubscriptionViewSet, basename='newsletter')

urlpatterns = [
    path('', include(router.urls)),
    path('footer/', FooterAPIView.as_view(), name='footer'),
] 