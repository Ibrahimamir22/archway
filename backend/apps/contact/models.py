import uuid
from django.db import models
from django.utils.text import slugify

class ContactMessage(models.Model):
    """Contact form submissions"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    message = models.TextField()
    ip_address = models.GenericIPAddressField(blank=True, null=True)
    read = models.BooleanField(default=False)
    responded = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Contact Message"
        verbose_name_plural = "Contact Messages"

    def __str__(self):
        return f"Message from {self.name} ({self.email})"

class ContactInfo(models.Model):
    """Company contact information"""
    address_en = models.TextField(verbose_name="Address (English)")
    address_ar = models.TextField(verbose_name="Address (Arabic)")
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    facebook_url = models.URLField(blank=True, verbose_name="Facebook URL")
    instagram_url = models.URLField(blank=True, verbose_name="Instagram URL")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Contact Information"
        verbose_name_plural = "Contact Information"
    
    def __str__(self):
        return f"Contact Information (Last updated: {self.updated_at.strftime('%Y-%m-%d')})"

class FooterSettings(models.Model):
    """Global settings for the footer"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    company_name_en = models.CharField(max_length=100)
    company_name_ar = models.CharField(max_length=100, blank=True)
    description_en = models.TextField(blank=True)
    description_ar = models.TextField(blank=True)
    address_en = models.CharField(max_length=200, blank=True)
    address_ar = models.CharField(max_length=200, blank=True)
    email = models.EmailField(max_length=100, blank=True)
    phone = models.CharField(max_length=50, blank=True)
    copyright_text_en = models.CharField(max_length=200, blank=True)
    copyright_text_ar = models.CharField(max_length=200, blank=True)
    show_newsletter = models.BooleanField(default=False)
    newsletter_text_en = models.CharField(max_length=200, blank=True)
    newsletter_text_ar = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Footer Settings"
        verbose_name_plural = "Footer Settings"

    def __str__(self):
        return "Footer Settings"
    
    @property
    def company_name(self):
        return self.company_name_en
    
    @property
    def description(self):
        return self.description_en
        
    @property
    def address(self):
        return self.address_en
        
    @property
    def copyright_text(self):
        return self.copyright_text_en
        
    @property
    def newsletter_text(self):
        return self.newsletter_text_en


class FooterSection(models.Model):
    """Sections in the footer like Quick Links, Services, etc."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title_en = models.CharField(max_length=100)
    title_ar = models.CharField(max_length=100, blank=True)
    slug = models.SlugField(max_length=120, unique=True)
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Order of appearance in the footer")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Footer Section"
        verbose_name_plural = "Footer Sections"
        ordering = ['order', 'title_en']

    def __str__(self):
        return self.title_en
    
    @property
    def title(self):
        return self.title_en
        
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title_en)
        super().save(*args, **kwargs)


class FooterLink(models.Model):
    """Links within a footer section"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    section = models.ForeignKey(FooterSection, on_delete=models.CASCADE, related_name='links')
    title_en = models.CharField(max_length=100)
    title_ar = models.CharField(max_length=100, blank=True)
    url = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)
    open_in_new_tab = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0, help_text="Order of appearance in the section")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Footer Link"
        verbose_name_plural = "Footer Links"
        ordering = ['section', 'order', 'title_en']

    def __str__(self):
        return f"{self.title_en} ({self.section.title_en})"
    
    @property
    def title(self):
        return self.title_en


class SocialMedia(models.Model):
    """Social media links for the footer"""
    PLATFORM_CHOICES = [
        ('facebook', 'Facebook'),
        ('twitter', 'Twitter'),
        ('instagram', 'Instagram'),
        ('linkedin', 'LinkedIn'),
        ('youtube', 'YouTube'),
        ('pinterest', 'Pinterest'),
        ('tiktok', 'TikTok'),
        ('behance', 'Behance'),
        ('whatsapp', 'WhatsApp'),
        ('other', 'Other'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    platform = models.CharField(max_length=50, choices=PLATFORM_CHOICES)
    url = models.URLField(max_length=200)
    icon = models.CharField(max_length=50, blank=True, help_text="Icon name (if different from platform)")
    is_active = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Social Media Link"
        verbose_name_plural = "Social Media Links"
        ordering = ['order', 'platform']

    def __str__(self):
        return self.platform
    
    @property
    def get_icon(self):
        """Returns the appropriate icon for the platform"""
        if self.icon:
            return self.icon
        return self.platform.lower()


class NewsletterSubscription(models.Model):
    """Newsletter subscriptions from footer form"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(max_length=100, unique=True)
    first_name = models.CharField(max_length=100, blank=True)
    last_name = models.CharField(max_length=100, blank=True)
    confirmed = models.BooleanField(default=False)
    confirmation_token = models.UUIDField(default=uuid.uuid4, editable=False)
    is_active = models.BooleanField(default=True)
    language_preference = models.CharField(max_length=2, choices=[('en', 'English'), ('ar', 'Arabic')], default='en')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Newsletter Subscription"
        verbose_name_plural = "Newsletter Subscriptions"
        ordering = ['-created_at']

    def __str__(self):
        return self.email
        
    def save(self, *args, **kwargs):
        """Generate a new confirmation token if being created"""
        if not self.pk:
            self.confirmation_token = uuid.uuid4()
        super().save(*args, **kwargs)


class SubscriberSegment(models.Model):
    """Segments for categorizing newsletter subscribers"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Subscriber Segment"
        verbose_name_plural = "Subscriber Segments"
        ordering = ['name']

    def __str__(self):
        return self.name


class SubscriberSegmentMembership(models.Model):
    """Many-to-many relationship between subscribers and segments"""
    subscriber = models.ForeignKey(NewsletterSubscription, on_delete=models.CASCADE, related_name='segment_memberships')
    segment = models.ForeignKey(SubscriberSegment, on_delete=models.CASCADE, related_name='subscribers')
    added_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = "Segment Membership"
        verbose_name_plural = "Segment Memberships"
        unique_together = ('subscriber', 'segment')

    def __str__(self):
        return f"{self.subscriber.email} in {self.segment.name}"


class NewsletterTemplate(models.Model):
    """Templates for newsletter emails"""
    TEMPLATE_TYPES = [
        ('welcome', 'Welcome Email'),
        ('confirmation', 'Confirmation Email'),
        ('newsletter', 'Regular Newsletter'),
        ('announcement', 'Announcement'),
        ('promotional', 'Promotional'),
        ('digest', 'Weekly/Monthly Digest'),
        ('event', 'Event Invitation'),
        ('custom', 'Custom'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    type = models.CharField(max_length=20, choices=TEMPLATE_TYPES)
    subject_en = models.CharField(max_length=200, verbose_name="Subject (English)")
    subject_ar = models.CharField(max_length=200, blank=True, verbose_name="Subject (Arabic)")
    content_en = models.TextField(verbose_name="Content (English)")
    content_ar = models.TextField(blank=True, verbose_name="Content (Arabic)")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Newsletter Template"
        verbose_name_plural = "Newsletter Templates"
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.name} ({self.get_type_display()})"
        
    @property
    def subject(self):
        return self.subject_en
        
    @property
    def content(self):
        return self.content_en


class NewsletterCampaign(models.Model):
    """Email campaigns sent to subscribers"""
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('scheduled', 'Scheduled'),
        ('sending', 'Sending'),
        ('sent', 'Sent'),
        ('cancelled', 'Cancelled'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    template = models.ForeignKey(NewsletterTemplate, on_delete=models.PROTECT, related_name='campaigns')
    segments = models.ManyToManyField(SubscriberSegment, blank=True, related_name='campaigns')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    scheduled_at = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Statistics
    total_recipients = models.PositiveIntegerField(default=0)
    successful_deliveries = models.PositiveIntegerField(default=0)
    opens = models.PositiveIntegerField(default=0)
    clicks = models.PositiveIntegerField(default=0)
    bounces = models.PositiveIntegerField(default=0)
    
    class Meta:
        verbose_name = "Newsletter Campaign"
        verbose_name_plural = "Newsletter Campaigns"
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.get_status_display()})"
        
    def get_all_subscribers(self):
        """Get all subscribers for this campaign, either from segments or all active subscribers if no segments"""
        if self.segments.exists():
            # Get subscribers from selected segments
            segment_ids = self.segments.values_list('id', flat=True)
            subscriber_ids = SubscriberSegmentMembership.objects.filter(
                segment_id__in=segment_ids
            ).values_list('subscriber_id', flat=True).distinct()
            return NewsletterSubscription.objects.filter(
                id__in=subscriber_ids, 
                is_active=True, 
                confirmed=True
            )
        else:
            # If no segments selected, get all active confirmed subscribers
            return NewsletterSubscription.objects.filter(is_active=True, confirmed=True)


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