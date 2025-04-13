from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    EmailDeliveryViewSet, LinkClickViewSet,
    NewsletterAutomationViewSet, AutomationStepViewSet,
    AutomationExecutionViewSet, EmailConfigurationViewSet,
    TrackOpenView, TrackClickView
)

router = DefaultRouter()
router.register('deliveries', EmailDeliveryViewSet, basename='delivery')
router.register('link-clicks', LinkClickViewSet, basename='link-click')
router.register('automations', NewsletterAutomationViewSet, basename='automation')
router.register('automation-steps', AutomationStepViewSet, basename='automation-step')
router.register('executions', AutomationExecutionViewSet, basename='execution')
router.register('configurations', EmailConfigurationViewSet, basename='configuration')

app_name = 'email_system'

urlpatterns = [
    path('', include(router.urls)),
    # Tracking endpoints
    path('track/open/<uuid:tracking_key>/', TrackOpenView.as_view(), name='track-open'),
    path('track/click/<uuid:tracking_key>/', TrackClickView.as_view(), name='track-click'),
] 