from django.contrib import admin
from django.utils import timezone
import base64
from .models import (
    ContactMessage, ContactInfo, 
    NewsletterSubscription, SubscriberSegment,
    NewsletterTemplate, NewsletterCampaign, EmailDelivery,
    LinkClick, NewsletterAutomation, AutomationStep, 
    AutomationExecution, SubscriberSegmentMembership, EmailConfiguration
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


class EmailDeliveryInline(admin.TabularInline):
    model = EmailDelivery
    extra = 0
    readonly_fields = ('subscriber', 'status', 'sent_at', 'opened_at', 'clicked_at', 'open_count', 'click_count')
    can_delete = False
    max_num = 0
    fields = ('subscriber', 'status', 'sent_at', 'opened_at', 'clicked_at', 'open_count', 'click_count')


@admin.register(NewsletterCampaign)
class NewsletterCampaignAdmin(admin.ModelAdmin):
    list_display = ('name', 'status', 'scheduled_at', 'sent_at', 'total_recipients', 'opens', 'clicks', 'created_at')
    list_filter = ('status', 'scheduled_at', 'sent_at', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('-created_at',)
    readonly_fields = ('successful_deliveries', 'opens', 'clicks', 'bounces')
    filter_horizontal = ('segments',)
    inlines = [EmailDeliveryInline]
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


@admin.register(EmailDelivery)
class EmailDeliveryAdmin(admin.ModelAdmin):
    list_display = ('campaign_name', 'subscriber_email', 'status', 'sent_at', 'opened_at', 'click_count')
    list_filter = ('status', 'sent_at', 'opened_at', 'clicked_at')
    search_fields = ('subscriber__email', 'campaign__name')
    ordering = ('-created_at',)
    readonly_fields = ('campaign', 'subscriber', 'tracking_key', 'sent_at', 'delivered_at', 'opened_at', 'clicked_at', 'open_count', 'click_count')
    
    def campaign_name(self, obj):
        return obj.campaign.name
    campaign_name.short_description = 'Campaign'
    
    def subscriber_email(self, obj):
        return obj.subscriber.email
    subscriber_email.short_description = 'Subscriber'


class LinkClickInline(admin.TabularInline):
    model = LinkClick
    extra = 0
    readonly_fields = ('url', 'clicked_at', 'user_agent', 'ip_address')
    can_delete = False
    max_num = 0


@admin.register(LinkClick)
class LinkClickAdmin(admin.ModelAdmin):
    list_display = ('url', 'subscriber_email', 'campaign_name', 'clicked_at')
    list_filter = ('clicked_at',)
    search_fields = ('url', 'delivery__subscriber__email', 'delivery__campaign__name')
    ordering = ('-clicked_at',)
    readonly_fields = ('delivery', 'url', 'clicked_at', 'user_agent', 'ip_address')
    
    def subscriber_email(self, obj):
        return obj.delivery.subscriber.email
    subscriber_email.short_description = 'Subscriber'
    
    def campaign_name(self, obj):
        return obj.delivery.campaign.name
    campaign_name.short_description = 'Campaign'


class AutomationStepInline(admin.TabularInline):
    model = AutomationStep
    extra = 1
    fields = ('template', 'order', 'delay_days', 'is_active')


@admin.register(NewsletterAutomation)
class NewsletterAutomationAdmin(admin.ModelAdmin):
    list_display = ('name', 'trigger_type', 'segment', 'is_active', 'step_count', 'created_at')
    list_filter = ('trigger_type', 'is_active', 'created_at')
    search_fields = ('name', 'description')
    ordering = ('name',)
    inlines = [AutomationStepInline]
    
    def step_count(self, obj):
        return obj.steps.count()
    step_count.short_description = 'Steps'


@admin.register(AutomationStep)
class AutomationStepAdmin(admin.ModelAdmin):
    list_display = ('automation_name', 'template_name', 'order', 'delay_days', 'is_active')
    list_filter = ('is_active', 'automation')
    search_fields = ('automation__name', 'template__name')
    ordering = ('automation', 'order')
    
    def automation_name(self, obj):
        return obj.automation.name
    automation_name.short_description = 'Automation'
    
    def template_name(self, obj):
        return obj.template.name
    template_name.short_description = 'Template'


@admin.register(AutomationExecution)
class AutomationExecutionAdmin(admin.ModelAdmin):
    list_display = ('automation_name', 'subscriber_email', 'status', 'current_step_name', 'next_step_scheduled_at', 'started_at')
    list_filter = ('status', 'started_at')
    search_fields = ('automation__name', 'subscriber__email')
    ordering = ('-started_at',)
    readonly_fields = ('automation', 'subscriber', 'started_at')
    
    def automation_name(self, obj):
        return obj.automation.name
    automation_name.short_description = 'Automation'
    
    def subscriber_email(self, obj):
        return obj.subscriber.email
    subscriber_email.short_description = 'Subscriber'
    
    def current_step_name(self, obj):
        if obj.current_step:
            return f"{obj.current_step.template.name} (Step {obj.current_step.order})"
        return "Not started"
    current_step_name.short_description = 'Current Step'


@admin.register(EmailConfiguration)
class EmailConfigurationAdmin(admin.ModelAdmin):
    """Admin interface for managing email delivery configuration"""
    list_display = ('name', 'email_host_user', 'email_host', 'active', 'updated_at')
    list_filter = ('active', 'email_host')
    search_fields = ('name', 'email_host', 'email_host_user')
    readonly_fields = ('created_at', 'updated_at')
    fieldsets = (
        (None, {
            'fields': ('name', 'active')
        }),
        ('SMTP Configuration', {
            'fields': ('email_backend', 'email_host', 'email_port', 'email_use_tls'),
        }),
        ('Authentication', {
            'fields': ('email_host_user', 'email_host_password', 'default_from_email'),
            'classes': ('collapse',),
            'description': 'For Gmail, use an App Password, not your regular password.'
        }),
    )
    
    def save_model(self, request, obj, form, change):
        # Ensure only one configuration is active at a time
        if obj.active:
            EmailConfiguration.objects.exclude(pk=obj.pk).update(active=False)
        
        # Save the model
        super().save_model(request, obj, form, change)
        
        # Add a message to the user
        if obj.active:
            self.message_user(request, f"Email configuration '{obj.name}' is now active and will be used for all emails")
        else:
            self.message_user(request, f"Email configuration '{obj.name}' has been saved but is not active") 