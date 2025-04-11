from django.contrib import admin
from .models import Testimonial

@admin.register(Testimonial)
class TestimonialAdmin(admin.ModelAdmin):
    list_display = ('client_name_en', 'project', 'approved', 'created_at')
    list_filter = ('approved', 'created_at')
    search_fields = ('client_name_en', 'client_name_ar', 'quote_en', 'quote_ar', 'project')
    list_editable = ('approved',)
    fieldsets = (
        (None, {
            'fields': ('approved',)
        }),
        ('English Content', {
            'fields': ('client_name_en', 'quote_en')
        }),
        ('Arabic Content', {
            'fields': ('client_name_ar', 'quote_ar')
        }),
        ('Additional Information', {
            'fields': ('project',)
        }),
    ) 