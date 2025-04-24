from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FAQViewSet, FAQCategoryViewSet

app_name = 'faqs'

router = DefaultRouter()
router.register(r'faqs', FAQViewSet)
router.register(r'categories', FAQCategoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
] 