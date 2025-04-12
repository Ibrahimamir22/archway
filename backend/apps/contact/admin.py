from django.contrib import admin
from .models import (
    ContactMessage, ContactInfo, 
    FooterSettings, FooterSection, FooterLink, 
    SocialMedia, NewsletterSubscription
)

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

class FooterLinkInline(admin.TabularInline):
    model = FooterLink
    extra = 1
    fields = ('title_en', 'title_ar', 'url', 'is_active', 'open_in_new_tab', 'order')

@admin.register(FooterSection)
class FooterSectionAdmin(admin.ModelAdmin):
    list_display = ('title_en', 'slug', 'is_active', 'order')
    list_filter = ('is_active',)
    search_fields = ('title_en', 'title_ar', 'slug')
    prepopulated_fields = {'slug': ('title_en',)}
    ordering = ('order', 'title_en')
    inlines = [FooterLinkInline]
    fieldsets = (
        (None, {
            'fields': ('is_active', 'order')
        }),
        ('English', {
            'fields': ('title_en',),
        }),
        ('Arabic', {
            'fields': ('title_ar',),
        }),
        ('Settings', {
            'fields': ('slug',),
        }),
    )

@admin.register(FooterLink)
class FooterLinkAdmin(admin.ModelAdmin):
    list_display = ('title_en', 'section', 'url', 'is_active', 'order')
    list_filter = ('section', 'is_active')
    search_fields = ('title_en', 'title_ar', 'url')
    ordering = ('section', 'order', 'title_en')
    fieldsets = (
        (None, {
            'fields': ('section', 'url', 'is_active', 'open_in_new_tab', 'order')
        }),
        ('English', {
            'fields': ('title_en',),
        }),
        ('Arabic', {
            'fields': ('title_ar',),
        }),
    )

@admin.register(SocialMedia)
class SocialMediaAdmin(admin.ModelAdmin):
    list_display = ('platform', 'url', 'is_active', 'order')
    list_filter = ('platform', 'is_active')
    search_fields = ('platform', 'url')
    ordering = ('order', 'platform')

@admin.register(FooterSettings)
class FooterSettingsAdmin(admin.ModelAdmin):
    list_display = ('company_name_en', 'email', 'phone', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('email', 'phone')
        }),
        ('English', {
            'fields': ('company_name_en', 'description_en', 'address_en', 'copyright_text_en'),
        }),
        ('Arabic', {
            'fields': ('company_name_ar', 'description_ar', 'address_ar', 'copyright_text_ar'),
        }),
        ('Newsletter', {
            'fields': ('show_newsletter', 'newsletter_text_en', 'newsletter_text_ar'),
        }),
    )
    
    def has_add_permission(self, request):
        # Check if we already have a footer settings object
        if FooterSettings.objects.exists():
            return False
        return True

@admin.register(NewsletterSubscription)
class NewsletterSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('email', 'is_active', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('email',)
    date_hierarchy = 'created_at'
    ordering = ('-created_at',) 