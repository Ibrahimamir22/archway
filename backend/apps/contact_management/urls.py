from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ContactViewSet, ContactInfoViewSet

router = DefaultRouter()
router.register('messages', ContactViewSet, basename='contact-message')
router.register('info', ContactInfoViewSet, basename='contact-info')

app_name = 'contact_management'

urlpatterns = [
    path('', include(router.urls)),
    # Add other URL patterns here
] 