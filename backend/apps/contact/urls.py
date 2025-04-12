from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ContactViewSet, ContactMessageViewSet, 
    ContactInfoViewSet, FooterSettingsViewSet,
    FooterSectionViewSet, SocialMediaViewSet,
    NewsletterSubscriptionViewSet, FooterAPIView,
    SubscriberSegmentViewSet, NewsletterTemplateViewSet,
    NewsletterCampaignViewSet, NewsletterTrackingViewSet,
    NewsletterAutomationViewSet, AutomationStepViewSet
)

router = DefaultRouter()
router.register(r'contact', ContactViewSet, basename='contact')
router.register(r'contact-messages', ContactMessageViewSet, basename='contact-messages')
router.register(r'contact-info', ContactInfoViewSet, basename='contact-info')
router.register(r'footer-settings', FooterSettingsViewSet, basename='footer-settings')
router.register(r'footer-sections', FooterSectionViewSet, basename='footer-sections')
router.register(r'social-media', SocialMediaViewSet, basename='social-media')
router.register(r'newsletter', NewsletterSubscriptionViewSet, basename='newsletter')

# New newsletter system endpoints
router.register(r'subscriber-segments', SubscriberSegmentViewSet, basename='subscriber-segment')
router.register(r'newsletter-templates', NewsletterTemplateViewSet, basename='newsletter-template')
router.register(r'newsletter-campaigns', NewsletterCampaignViewSet, basename='newsletter-campaign')
router.register(r'newsletter-tracking', NewsletterTrackingViewSet, basename='newsletter-tracking')
router.register(r'newsletter-automations', NewsletterAutomationViewSet, basename='newsletter-automation')
router.register(r'automation-steps', AutomationStepViewSet, basename='automation-step')

urlpatterns = [
    path('', include(router.urls)),
    path('footer/', FooterAPIView.as_view(), name='footer'),
    
    # Newsletter specific endpoints
    path('newsletters/confirm/', NewsletterSubscriptionViewSet.as_view({'post': 'confirm'}), name='confirm-subscription'),
    path('newsletters/unsubscribe/', NewsletterSubscriptionViewSet.as_view({'post': 'unsubscribe'}), name='unsubscribe'),
] 