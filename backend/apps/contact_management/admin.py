from django.contrib import admin
from .models import ContactMessage, ContactInfo

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'message', 'created_at', 'read', 'responded')
    list_filter = ('read', 'responded', 'created_at')
    search_fields = ('name', 'email', 'message')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)

@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ('email', 'phone', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('email', 'phone')
        }),
        ('English', {
            'fields': ('address_en',),
        }),
        ('Arabic', {
            'fields': ('address_ar',),
        }),
        ('Social Media', {
            'fields': ('facebook_url', 'instagram_url'),
        }),
    )
