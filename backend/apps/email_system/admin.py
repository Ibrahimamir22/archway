from django.contrib import admin
from .models import (
    EmailDelivery, LinkClick, NewsletterAutomation, 
    AutomationStep, AutomationExecution, EmailConfiguration
)


class EmailDeliveryInline(admin.TabularInline):
    model = EmailDelivery
    extra = 0
    readonly_fields = ('subscriber', 'status', 'sent_at', 'opened_at', 'clicked_at', 'open_count', 'click_count')
    can_delete = False
    max_num = 0
    fields = ('subscriber', 'status', 'sent_at', 'opened_at', 'clicked_at', 'open_count', 'click_count')


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
