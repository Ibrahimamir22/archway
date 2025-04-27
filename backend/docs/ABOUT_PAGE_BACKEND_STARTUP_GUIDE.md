# About Page Backend Startup Guide

## Getting Started

This guide provides step-by-step instructions for implementing the about page backend functionality in Django. Follow these instructions to create the required app, models, and API endpoints.

## Prerequisites

- Django project is set up with the existing app structure
- Django REST Framework is installed and configured
- Basic understanding of Django models, views, and serializers
- Access to the project's database

## Step 1: Create the About App

```bash
# Navigate to the project directory
cd apps

# Create the new app
python ../manage.py startapp about
```

## Step 2: Register the App

Add the about app to the `INSTALLED_APPS` in `interior_platform/settings/base.py`:

```python
INSTALLED_APPS = [
    # ...
    'apps.about',
    # ...
]
```

## Step 3: Create Models

Create the models in `apps/about/models.py`:

```python
from django.db import models
from django.utils.translation import gettext_lazy as _

class AboutPage(models.Model):
    """Main about page content model"""
    title = models.CharField(_("Title"), max_length=200)
    subtitle = models.CharField(_("Subtitle"), max_length=500)
    mission_title = models.CharField(_("Mission Title"), max_length=200)
    mission_description = models.TextField(_("Mission Description"))
    vision_title = models.CharField(_("Vision Title"), max_length=200)
    vision_description = models.TextField(_("Vision Description"))
    team_section_title = models.CharField(_("Team Section Title"), max_length=200)
    values_section_title = models.CharField(_("Values Section Title"), max_length=200)
    testimonials_section_title = models.CharField(_("Testimonials Section Title"), max_length=200)
    history_section_title = models.CharField(_("History Section Title"), max_length=200, blank=True)
    meta_description = models.TextField(_("Meta Description"), blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Localization fields
    title_ar = models.CharField(_("Title (Arabic)"), max_length=200)
    subtitle_ar = models.CharField(_("Subtitle (Arabic)"), max_length=500)
    mission_title_ar = models.CharField(_("Mission Title (Arabic)"), max_length=200)
    mission_description_ar = models.TextField(_("Mission Description (Arabic)"))
    vision_title_ar = models.CharField(_("Vision Title (Arabic)"), max_length=200)
    vision_description_ar = models.TextField(_("Vision Description (Arabic)"))
    team_section_title_ar = models.CharField(_("Team Section Title (Arabic)"), max_length=200)
    values_section_title_ar = models.CharField(_("Values Section Title (Arabic)"), max_length=200)
    testimonials_section_title_ar = models.CharField(_("Testimonials Section Title (Arabic)"), max_length=200)
    history_section_title_ar = models.CharField(_("History Section Title (Arabic)"), max_length=200, blank=True)
    meta_description_ar = models.TextField(_("Meta Description (Arabic)"), blank=True)
    
    class Meta:
        verbose_name = _("About Page Content")
        verbose_name_plural = _("About Page Content")
    
    def __str__(self):
        return self.title


class TeamMember(models.Model):
    """Team member model"""
    name = models.CharField(_("Name"), max_length=100)
    role = models.CharField(_("Role"), max_length=100)
    bio = models.TextField(_("Biography"))
    image = models.ImageField(_("Image"), upload_to='team/')
    email = models.EmailField(_("Email"), blank=True)
    linkedin = models.URLField(_("LinkedIn"), blank=True)
    order = models.PositiveIntegerField(_("Order"), default=0)
    is_active = models.BooleanField(_("Active"), default=True)
    is_featured = models.BooleanField(_("Featured"), default=False)
    department = models.CharField(_("Department"), max_length=100, blank=True)
    
    # Localization fields
    name_ar = models.CharField(_("Name (Arabic)"), max_length=100)
    role_ar = models.CharField(_("Role (Arabic)"), max_length=100)
    bio_ar = models.TextField(_("Biography (Arabic)"))
    department_ar = models.CharField(_("Department (Arabic)"), max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name = _("Team Member")
        verbose_name_plural = _("Team Members")
    
    def __str__(self):
        return self.name


class CoreValue(models.Model):
    """Company core values model"""
    title = models.CharField(_("Title"), max_length=100)
    description = models.TextField(_("Description"))
    icon = models.CharField(_("Icon"), max_length=50, help_text=_("Icon name or identifier"))
    order = models.PositiveIntegerField(_("Order"), default=0)
    
    # Localization fields
    title_ar = models.CharField(_("Title (Arabic)"), max_length=100)
    description_ar = models.TextField(_("Description (Arabic)"))
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = _("Core Value")
        verbose_name_plural = _("Core Values")
    
    def __str__(self):
        return self.title


class Testimonial(models.Model):
    """Client testimonials model"""
    client_name = models.CharField(_("Client Name"), max_length=100)
    quote = models.TextField(_("Quote"))
    project = models.CharField(_("Project"), max_length=100, blank=True)
    is_featured = models.BooleanField(_("Featured"), default=False)
    
    # Localization fields
    client_name_ar = models.CharField(_("Client Name (Arabic)"), max_length=100)
    quote_ar = models.TextField(_("Quote (Arabic)"))
    project_ar = models.CharField(_("Project (Arabic)"), max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = _("Testimonial")
        verbose_name_plural = _("Testimonials")
    
    def __str__(self):
        return f"{self.client_name}"
```

## Step 4: Configure Admin Interface

Set up the admin interface in `apps/about/admin.py`:

```python
from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from .models import AboutPage, TeamMember, CoreValue, Testimonial

@admin.register(AboutPage)
class AboutPageAdmin(admin.ModelAdmin):
    fieldsets = (
        (_('English Content'), {
            'fields': ('title', 'subtitle', 'mission_title', 'mission_description',
                       'vision_title', 'vision_description', 'team_section_title',
                       'values_section_title', 'testimonials_section_title',
                       'history_section_title', 'meta_description')
        }),
        (_('Arabic Content'), {
            'fields': ('title_ar', 'subtitle_ar', 'mission_title_ar', 'mission_description_ar',
                       'vision_title_ar', 'vision_description_ar', 'team_section_title_ar',
                       'values_section_title_ar', 'testimonials_section_title_ar',
                       'history_section_title_ar', 'meta_description_ar')
        }),
        (_('Metadata'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        })
    )
    readonly_fields = ('created_at', 'updated_at')
    list_display = ('title', 'updated_at')

    def has_add_permission(self, request):
        # Only allow one AboutPage instance
        return AboutPage.objects.count() == 0


@admin.register(TeamMember)
class TeamMemberAdmin(admin.ModelAdmin):
    fieldsets = (
        (_('Basic Information'), {
            'fields': ('name', 'role', 'department', 'bio', 'image')
        }),
        (_('Arabic Content'), {
            'fields': ('name_ar', 'role_ar', 'department_ar', 'bio_ar')
        }),
        (_('Contact Information'), {
            'fields': ('email', 'linkedin')
        }),
        (_('Display Options'), {
            'fields': ('order', 'is_active', 'is_featured')
        }),
        (_('Metadata'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        })
    )
    list_display = ('name', 'role', 'department', 'order', 'is_active', 'is_featured')
    list_filter = ('is_active', 'is_featured', 'department')
    search_fields = ('name', 'role', 'bio')
    readonly_fields = ('created_at', 'updated_at')
    list_editable = ('order', 'is_active', 'is_featured')


@admin.register(CoreValue)
class CoreValueAdmin(admin.ModelAdmin):
    fieldsets = (
        (_('English Content'), {
            'fields': ('title', 'description', 'icon')
        }),
        (_('Arabic Content'), {
            'fields': ('title_ar', 'description_ar')
        }),
        (_('Display Options'), {
            'fields': ('order',)
        }),
        (_('Metadata'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        })
    )
    list_display = ('title', 'order')
    list_editable = ('order',)
    readonly_fields = ('created_at', 'updated_at')


@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    fieldsets = (
        (_('English Content'), {
            'fields': ('client_name', 'quote', 'project')
        }),
        (_('Arabic Content'), {
            'fields': ('client_name_ar', 'quote_ar', 'project_ar')
        }),
        (_('Display Options'), {
            'fields': ('is_featured',)
        }),
        (_('Metadata'), {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',),
        })
    )
    list_display = ('client_name', 'project', 'is_featured', 'created_at')
    list_filter = ('is_featured',)
    search_fields = ('client_name', 'quote', 'project')
    list_editable = ('is_featured',)
    readonly_fields = ('created_at', 'updated_at')
```

## Step 5: Create Serializers

Create serializers in `apps/about/serializers.py`:

```python
from rest_framework import serializers
from .models import AboutPage, TeamMember, CoreValue, Testimonial

class AboutPageSerializer(serializers.ModelSerializer):
    class Meta:
        model = AboutPage
        fields = [
            'title', 'subtitle', 'mission_title', 'mission_description',
            'vision_title', 'vision_description', 'team_section_title',
            'values_section_title', 'testimonials_section_title',
            'history_section_title', 'meta_description',
            'title_ar', 'subtitle_ar', 'mission_title_ar', 'mission_description_ar',
            'vision_title_ar', 'vision_description_ar', 'team_section_title_ar',
            'values_section_title_ar', 'testimonials_section_title_ar',
            'history_section_title_ar', 'meta_description_ar'
        ]


class TeamMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeamMember
        fields = [
            'id', 'name', 'role', 'bio', 'image', 'email', 'linkedin',
            'department', 'is_featured', 'name_ar', 'role_ar', 'bio_ar',
            'department_ar'
        ]


class CoreValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = CoreValue
        fields = [
            'id', 'title', 'description', 'icon', 'order',
            'title_ar', 'description_ar'
        ]


class TestimonialSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testimonial
        fields = [
            'id', 'client_name', 'quote', 'project', 'is_featured',
            'client_name_ar', 'quote_ar', 'project_ar'
        ]
```

## Step 6: Create Views

Create views in `apps/about/views.py`:

```python
from rest_framework import viewsets, generics
from rest_framework.response import Response
from .models import AboutPage, TeamMember, CoreValue, Testimonial
from .serializers import (
    AboutPageSerializer, TeamMemberSerializer,
    CoreValueSerializer, TestimonialSerializer
)

class AboutPageView(generics.RetrieveAPIView):
    """
    Returns the main about page content
    """
    queryset = AboutPage.objects.all()
    serializer_class = AboutPageSerializer
    
    def get_object(self):
        # Get the first AboutPage object or create one if it doesn't exist
        obj, created = AboutPage.objects.get_or_create(
            pk=1,
            defaults={
                'title': 'About Us',
                'subtitle': 'Learn about our company',
                'mission_title': 'Our Mission',
                'mission_description': 'Default mission description',
                'vision_title': 'Our Vision',
                'vision_description': 'Default vision description',
                'team_section_title': 'Our Team',
                'values_section_title': 'Our Values',
                'testimonials_section_title': 'What Our Clients Say',
                # Arabic defaults
                'title_ar': 'معلومات عنا',
                'subtitle_ar': 'تعرف على شركتنا',
                'mission_title_ar': 'مهمتنا',
                'mission_description_ar': 'وصف المهمة الافتراضي',
                'vision_title_ar': 'رؤيتنا',
                'vision_description_ar': 'وصف الرؤية الافتراضي',
                'team_section_title_ar': 'فريقنا',
                'values_section_title_ar': 'قيمنا',
                'testimonials_section_title_ar': 'ماذا يقول عملاؤنا',
            }
        )
        return obj


class TeamMemberViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for team members
    """
    queryset = TeamMember.objects.filter(is_active=True).order_by('order', 'name')
    serializer_class = TeamMemberSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by featured status if specified
        featured = self.request.query_params.get('featured', None)
        if featured is not None:
            queryset = queryset.filter(is_featured=(featured.lower() == 'true'))
        
        # Filter by department if specified
        department = self.request.query_params.get('department', None)
        if department is not None:
            queryset = queryset.filter(department=department)
            
        return queryset


class CoreValueViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for company core values
    """
    queryset = CoreValue.objects.all().order_by('order')
    serializer_class = CoreValueSerializer


class TestimonialViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for testimonials
    """
    queryset = Testimonial.objects.all().order_by('-created_at')
    serializer_class = TestimonialSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Filter by featured status if specified
        featured = self.request.query_params.get('featured', None)
        if featured is not None:
            queryset = queryset.filter(is_featured=(featured.lower() == 'true'))
            
        return queryset
```

## Step 7: Configure URLs

Create URL patterns in `apps/about/urls.py`:

```python
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'team', views.TeamMemberViewSet)
router.register(r'core-values', views.CoreValueViewSet)
router.register(r'testimonials', views.TestimonialViewSet)

urlpatterns = [
    path('', views.AboutPageView.as_view(), name='about'),
    path('', include(router.urls)),
]
```

## Step 8: Add URLs to Main URLs

Add the about URLs to the main URL configuration in `interior_platform/urls.py`:

```python
# Add this to the existing urlpatterns list
urlpatterns += [
    path('api/about/', include('apps.about.urls')),
]
```

## Step 9: Create Migrations and Apply Them

```bash
# Create the migrations
python manage.py makemigrations about

# Apply the migrations
python manage.py migrate
```

## Step 10: Create Initial Data

Create a data fixture or add initial data through the Django admin interface.

For fixture creation, create `apps/about/fixtures/initial_data.json`:

```json
[
  {
    "model": "about.aboutpage",
    "pk": 1,
    "fields": {
      "title": "About Archway Innovations",
      "subtitle": "Transforming Spaces, Enhancing Lives",
      "mission_title": "Our Mission",
      "mission_description": "To create innovative interior designs that balance aesthetics, functionality, and sustainability while exceeding client expectations.",
      "vision_title": "Our Vision",
      "vision_description": "To be the leading interior design firm, recognized for our exceptional designs and sustainable practices that enhance quality of life.",
      "team_section_title": "Meet Our Team",
      "values_section_title": "Our Core Values",
      "testimonials_section_title": "What Our Clients Say",
      "history_section_title": "Our Journey",
      "meta_description": "Learn about Archway Innovations, our mission, vision, and the team behind our interior design expertise.",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-01-01T00:00:00Z",
      "title_ar": "عن آركواي للابتكارات",
      "subtitle_ar": "تحويل المساحات، تعزيز الحياة",
      "mission_title_ar": "مهمتنا",
      "mission_description_ar": "إنشاء تصاميم داخلية مبتكرة توازن بين الجماليات والوظائف والاستدامة مع تجاوز توقعات العملاء.",
      "vision_title_ar": "رؤيتنا",
      "vision_description_ar": "أن نكون شركة التصميم الداخلي الرائدة، المعروفة بتصاميمنا الاستثنائية وممارساتنا المستدامة التي تعزز جودة الحياة.",
      "team_section_title_ar": "تعرف على فريقنا",
      "values_section_title_ar": "قيمنا الأساسية",
      "testimonials_section_title_ar": "ماذا يقول عملاؤنا",
      "history_section_title_ar": "رحلتنا",
      "meta_description_ar": "تعرف على آركواي للابتكارات، مهمتنا، رؤيتنا، والفريق وراء خبرتنا في التصميم الداخلي."
    }
  }
]
```

Apply the fixture:

```bash
python manage.py loaddata apps/about/fixtures/initial_data.json
```

## Step 11: Test the API Endpoints

After implementation, test the endpoints:

1. `GET /api/about/` - Main about page content
2. `GET /api/about/team/` - List of team members
3. `GET /api/about/team/{id}/` - Team member detail
4. `GET /api/about/core-values/` - List of core values
5. `GET /api/about/testimonials/` - List of testimonials

## Step 12: Document the API

Create API documentation using Django REST Framework's built-in documentation or add a more comprehensive documentation using tools like Swagger.

## Additional Features (Optional)

### Implement Company History Model

```python
# Add to models.py
class CompanyHistory(models.Model):
    """Company history events"""
    year = models.PositiveIntegerField(_("Year"))
    title = models.CharField(_("Title"), max_length=200)
    description = models.TextField(_("Description"))
    
    # Localization fields
    title_ar = models.CharField(_("Title (Arabic)"), max_length=200)
    description_ar = models.TextField(_("Description (Arabic)"))
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ["-year"]
        verbose_name = _("Company History Event")
        verbose_name_plural = _("Company History Events")
    
    def __str__(self):
        return f"{self.year}: {self.title}"
```

### Implement Company Statistics Model

```python
# Add to models.py
class CompanyStatistic(models.Model):
    """Company statistics"""
    title = models.CharField(_("Title"), max_length=100)
    value = models.PositiveIntegerField(_("Value"))
    unit = models.CharField(_("Unit"), max_length=20, blank=True)
    order = models.PositiveIntegerField(_("Order"), default=0)
    
    # Localization fields
    title_ar = models.CharField(_("Title (Arabic)"), max_length=100)
    unit_ar = models.CharField(_("Unit (Arabic)"), max_length=20, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ["order"]
        verbose_name = _("Company Statistic")
        verbose_name_plural = _("Company Statistics")
    
    def __str__(self):
        return f"{self.title}: {self.value}"
```

## Troubleshooting

### Common Issues and Solutions

1. **Migration Errors**:
   - Check for proper field definitions
   - Make sure the app is properly installed in INSTALLED_APPS

2. **Admin Interface Issues**:
   - Ensure models are properly registered with admin.site.register()
   - Check fieldsets for correct field names

3. **API Endpoint Errors**:
   - Verify URL patterns are correct
   - Check serializer field definitions match model fields
   - Ensure proper permissions are set

4. **Image Handling**:
   - Confirm MEDIA_URL and MEDIA_ROOT are properly configured
   - Check upload_to paths in ImageField definitions

## Next Steps

After completing the basic implementation:

1. Implement caching for API responses
2. Add more advanced filtering options
3. Integrate with the frontend
4. Add performance optimizations
5. Expand test coverage 