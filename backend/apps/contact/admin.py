from django.contrib import admin
from .models import ContactMessage

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