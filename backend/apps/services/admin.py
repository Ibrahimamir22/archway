from django.contrib import admin
from .models import ServiceCategory, Service, ServiceFeature


class ServiceFeatureInline(admin.StackedInline):
    model = ServiceFeature
    extra = 1


class ServiceAdmin(admin.ModelAdmin):
    list_display = ('title_en', 'category', 'is_featured', 'is_published', 'order')
    list_filter = ('category', 'is_featured', 'is_published')
    search_fields = ('title_en', 'title_ar', 'description_en', 'description_ar')
    prepopulated_fields = {'slug': ('title_en',)}
    inlines = [ServiceFeatureInline]
    fieldsets = (
        (None, {
            'fields': ('title_en', 'title_ar', 'slug', 'category', 'icon')
        }),
        ('Images', {
            'fields': ('image', 'cover_image')
        }),
        ('Content', {
            'fields': ('description_en', 'description_ar', 'short_description_en', 'short_description_ar')
        }),
        ('Service Details', {
            'fields': ('price', 'price_unit', 'duration')
        }),
        ('Display Options', {
            'fields': ('is_featured', 'is_published', 'order')
        }),
    )


class ServiceCategoryAdmin(admin.ModelAdmin):
    list_display = ('name_en', 'order', 'get_services_count')
    search_fields = ('name_en', 'name_ar', 'description_en', 'description_ar')
    prepopulated_fields = {'slug': ('name_en',)}
    
    def get_services_count(self, obj):
        return obj.services.count()
    get_services_count.short_description = 'Services Count'


admin.site.register(Service, ServiceAdmin)
admin.site.register(ServiceCategory, ServiceCategoryAdmin)
