import uuid
from django.db import models

# Import models from other apps to avoid circular imports
from apps.newsletter.models import NewsletterSubscription, NewsletterCampaign, NewsletterTemplate, SubscriberSegment


class EmailDelivery(models.Model):
    """Tracks individual email deliveries for campaigns"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('sent', 'Sent'),
        ('delivered', 'Delivered'),
        ('opened', 'Opened'),
        ('clicked', 'Clicked'),
        ('bounced', 'Bounced'),
        ('failed', 'Failed'),
        ('unsubscribed', 'Unsubscribed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    campaign = models.ForeignKey(NewsletterCampaign, on_delete=models.CASCADE, related_name='deliveries')
    subscriber = models.ForeignKey(NewsletterSubscription, on_delete=models.CASCADE, related_name='received_emails')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    tracking_key = models.UUIDField(default=uuid.uuid4, editable=False)
    sent_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    opened_at = models.DateTimeField(null=True, blank=True)
    clicked_at = models.DateTimeField(null=True, blank=True)
    open_count = models.PositiveIntegerField(default=0)
    click_count = models.PositiveIntegerField(default=0)
    bounce_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Email Delivery"
        verbose_name_plural = "Email Deliveries"
        ordering = ['-created_at']
        unique_together = ('campaign', 'subscriber')

    def __str__(self):
        return f"{self.campaign.name} to {self.subscriber.email}"


class LinkClick(models.Model):
    """Tracks clicks on links within campaign emails"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    delivery = models.ForeignKey(EmailDelivery, on_delete=models.CASCADE, related_name='link_clicks')
    url = models.URLField()
    clicked_at = models.DateTimeField(auto_now_add=True)
    user_agent = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)

    class Meta:
        verbose_name = "Link Click"
        verbose_name_plural = "Link Clicks"
        ordering = ['-clicked_at']

    def __str__(self):
        return f"Click on {self.url} by {self.delivery.subscriber.email}"


class NewsletterAutomation(models.Model):
    """Automated email sequences for subscribers"""
    TRIGGER_CHOICES = [
        ('subscription', 'New Subscription'),
        ('confirmation', 'Email Confirmed'),
        ('segment_added', 'Added to Segment'),
        ('time_delay', 'Time Delay'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    trigger_type = models.CharField(max_length=20, choices=TRIGGER_CHOICES)
    segment = models.ForeignKey(SubscriberSegment, on_delete=models.SET_NULL, null=True, blank=True, related_name='automations')
    delay_days = models.PositiveIntegerField(default=0, help_text="Days to wait before sending (for time_delay trigger)")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Newsletter Automation"
        verbose_name_plural = "Newsletter Automations"
        ordering = ['name']

    def __str__(self):
        return self.name


class AutomationStep(models.Model):
    """Steps in an email automation sequence"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    automation = models.ForeignKey(NewsletterAutomation, on_delete=models.CASCADE, related_name='steps')
    template = models.ForeignKey(NewsletterTemplate, on_delete=models.PROTECT, related_name='automation_steps')
    order = models.PositiveIntegerField(default=0)
    delay_days = models.PositiveIntegerField(default=0, help_text="Days to wait before sending this step after the previous one")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Automation Step"
        verbose_name_plural = "Automation Steps"
        ordering = ['automation', 'order']
        unique_together = ('automation', 'order')

    def __str__(self):
        return f"{self.automation.name} - Step {self.order}: {self.template.name}"


class AutomationExecution(models.Model):
    """Tracks the execution of automation sequences for subscribers"""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    automation = models.ForeignKey(NewsletterAutomation, on_delete=models.CASCADE, related_name='executions')
    subscriber = models.ForeignKey(NewsletterSubscription, on_delete=models.CASCADE, related_name='automation_executions')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    current_step = models.ForeignKey(AutomationStep, on_delete=models.SET_NULL, null=True, blank=True, related_name='executions')
    next_step_scheduled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        verbose_name = "Automation Execution"
        verbose_name_plural = "Automation Executions"
        ordering = ['-started_at']
        unique_together = ('automation', 'subscriber')

    def __str__(self):
        return f"{self.automation.name} for {self.subscriber.email}"


class EmailConfiguration(models.Model):
    """Configuration for email delivery backend"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100, help_text="Name for this configuration")
    email_backend = models.CharField(max_length=255, default='django.core.mail.backends.smtp.EmailBackend')
    email_host = models.CharField(max_length=255, help_text="SMTP server hostname")
    email_port = models.PositiveIntegerField(default=587)
    email_use_tls = models.BooleanField(default=True)
    email_host_user = models.CharField(max_length=255, help_text="SMTP username/email")
    email_host_password = models.CharField(max_length=255, help_text="SMTP password")
    default_from_email = models.EmailField()
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Email Configuration"
        verbose_name_plural = "Email Configurations"

    def __str__(self):
        return f"Email Config: {self.name} ({self.email_host})"
    
    def save(self, *args, **kwargs):
        # Ensure only one configuration is active
        if self.active:
            EmailConfiguration.objects.exclude(pk=self.pk).update(active=False)
        super().save(*args, **kwargs)
