import uuid
from django.db import models
from django.utils import timezone


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
