from django.contrib import admin
from .models import ContactMessage, ContactInfo

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'phone', 'created_at', 'read', 'responded')
    list_filter = ('read', 'responded', 'created_at')
    search_fields = ('name', 'email', 'phone', 'message')
    readonly_fields = ('id', 'created_at', 'updated_at', 'ip_address')
    list_editable = ('read', 'responded')
    fieldsets = (
        (None, {
            'fields': ('name', 'email', 'phone', 'message')
        }),
        ('Status', {
            'fields': ('read', 'responded')
        }),
        ('Metadata', {
            'fields': ('id', 'ip_address', 'created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    list_display = ('email', 'phone', 'updated_at')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        ('English Content', {
            'fields': ('address_en',)
        }),
        ('Arabic Content', {
            'fields': ('address_ar',)
        }),
        ('Contact Details', {
            'fields': ('email', 'phone')
        }),
        ('Social Media', {
            'fields': ('facebook_url', 'instagram_url')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    
    def has_add_permission(self, request):
        """Limit to one instance of ContactInfo"""
        return ContactInfo.objects.count() == 0
    
    def has_delete_permission(self, request, obj=None):
        """Prevent deletion of the only ContactInfo instance"""
        return ContactInfo.objects.count() > 1 