from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    NewsletterSubscriptionViewSet, SubscriberSegmentViewSet,
    NewsletterTemplateViewSet, NewsletterCampaignViewSet
)

router = DefaultRouter()
router.register('subscriptions', NewsletterSubscriptionViewSet, basename='subscription')
router.register('segments', SubscriberSegmentViewSet, basename='segment')
router.register('templates', NewsletterTemplateViewSet, basename='template')
router.register('campaigns', NewsletterCampaignViewSet, basename='campaign')

app_name = 'newsletter'

urlpatterns = [
    path('', include(router.urls)),
    # Add other URL patterns here
] 