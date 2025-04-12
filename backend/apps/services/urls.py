from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet, ServiceCategoryViewSet

router = DefaultRouter()
router.register(r'', ServiceViewSet, basename='services')
router.register(r'categories', ServiceCategoryViewSet, basename='service-categories')

urlpatterns = [
    path('', include(router.urls)),
] 