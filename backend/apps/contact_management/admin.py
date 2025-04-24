from django.contrib import admin
from django import forms
from .models import ContactMessage, ContactInfo

@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'message', 'created_at', 'read', 'responded')
    list_filter = ('read', 'responded', 'created_at')
    search_fields = ('name', 'email', 'message')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    readonly_fields = ('created_at',)

class ContactInfoForm(forms.ModelForm):
    class Meta:
        model = ContactInfo
        fields = '__all__'
        widgets = {
            'address_en': forms.Textarea(attrs={'rows': 3, 'cols': 60}),
            'address_ar': forms.Textarea(attrs={'rows': 3, 'cols': 60}),
            'working_hours_en': forms.Textarea(attrs={'rows': 3, 'cols': 60}),
            'working_hours_ar': forms.Textarea(attrs={'rows': 3, 'cols': 60}),
        }

@admin.register(ContactInfo)
class ContactInfoAdmin(admin.ModelAdmin):
    form = ContactInfoForm
    list_display = ('email', 'phone', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('email', 'phone')
        }),
        ('English', {
            'fields': ('address_en', 'working_hours_en'),
        }),
        ('Arabic', {
            'fields': ('address_ar', 'working_hours_ar'),
        }),
        ('Social Media', {
            'fields': ('facebook_url', 'instagram_url'),
        }),
    )
