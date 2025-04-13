from django.contrib import admin
from django.utils import timezone
from .models import (
    NewsletterSubscription, SubscriberSegment, 
    NewsletterTemplate, NewsletterCampaign, 
    SubscriberSegmentMembership
)

@admin.register(NewsletterSubscription)
class NewsletterSubscriptionAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'confirmed', 'is_active', 'language_preference', 'created_at')
    list_filter = ('is_active', 'confirmed', 'language_preference', 'created_at')
    search_fields = ('email', 'first_name', 'last_name')
    date_hierarchy = 'created_at'
    ordering = ('-created_at',)
    readonly_fields = ('confirmation_token',)
    actions = ['mark_as_confirmed', 'mark_as_unconfirmed']
    
    def mark_as_confirmed(self, request, queryset):
        updated = queryset.update(confirmed=True)
        self.message_user(request, f"{updated} subscribers marked as confirmed.")
    mark_as_confirmed.short_description = "Mark selected subscribers as confirmed"
    
    def mark_as_unconfirmed(self, request, queryset):
        updated = queryset.update(confirmed=False)
        self.message_user(request, f"{updated} subscribers marked as unconfirmed.")
    mark_as_unconfirmed.short_description = "Mark selected subscribers as unconfirmed"


class SubscriberSegmentMembershipInline(admin.TabularInline):
    model = SubscriberSegmentMembership
    extra = 1
    autocomplete_fields = ['subscriber']


@admin.register(SubscriberSegment)
class SubscriberSegmentAdmin(admin.ModelAdmin):
    list_display = ('name', 'description', 'is_active', 'get_subscriber_count', 'created_at')
    list_filter = ('is_active', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('name',)
    inlines = [SubscriberSegmentMembershipInline]
    
    def get_subscriber_count(self, obj):
        return obj.subscribers.count()
    get_subscriber_count.short_description = 'Subscribers'


@admin.register(NewsletterTemplate)
class NewsletterTemplateAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'is_active', 'updated_at')
    list_filter = ('type', 'is_active', 'created_at')
    search_fields = ('name', 'description', 'subject_en', 'subject_ar')
    ordering = ('-updated_at',)
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'type', 'is_active')
        }),
        ('English Content', {
            'fields': ('subject_en', 'content_en'),
        }),
        ('Arabic Content', {
            'fields': ('subject_ar', 'content_ar'),
        }),
    )


@admin.register(NewsletterCampaign)
class NewsletterCampaignAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'scheduled_at', 'sent_at', 'total_recipients', 'opens', 'clicks', 'created_at')
    list_filter = ('status', 'scheduled_at', 'sent_at', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('-created_at',)
    readonly_fields = ('successful_deliveries', 'opens', 'clicks', 'bounces')
    filter_horizontal = ('segments',)
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'template', 'status', 'scheduled_at')
        }),
        ('Segments', {
            'fields': ('segments',),
        }),
        ('Statistics', {
            'fields': ('total_recipients', 'successful_deliveries', 'opens', 'clicks', 'bounces'),
        }),
    )
    actions = ['schedule_for_now', 'cancel_campaign']
    
    def schedule_for_now(self, request, queryset):
        # Only schedule draft campaigns
        count = 0
        for campaign in queryset.filter(status='draft'):
            campaign.status = 'scheduled'
            campaign.scheduled_at = timezone.now()
            campaign.save()
            count += 1
        self.message_user(request, f"{count} campaigns scheduled for immediate sending.")
    schedule_for_now.short_description = "Schedule selected campaigns for immediate sending"
    
    def cancel_campaign(self, request, queryset):
        # Only cancel draft or scheduled campaigns
        updated = queryset.filter(status__in=['draft', 'scheduled']).update(status='cancelled')
        self.message_user(request, f"{updated} campaigns cancelled.")
    cancel_campaign.short_description = "Cancel selected campaigns"
