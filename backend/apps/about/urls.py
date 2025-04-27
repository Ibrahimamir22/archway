from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

app_name = 'about'

router = DefaultRouter()
router.register(r'team', views.TeamMemberViewSet, basename='team')
router.register(r'core-values', views.CoreValueViewSet, basename='core-values')
router.register(r'testimonials', views.TestimonialViewSet, basename='testimonials')
router.register(r'history', views.CompanyHistoryViewSet, basename='history')
router.register(r'statistics', views.CompanyStatisticViewSet, basename='statistics')
router.register(r'client-logos', views.ClientLogoViewSet, basename='client-logos')

urlpatterns = [
    # Main about page content
    path('', views.AboutPageView.as_view(), name='main'),
    
    # Combined data endpoint
    path('combined/', views.CombinedAboutView.as_view(), name='combined'),
    
    # Include router URLs
    path('', include(router.urls)),
]
