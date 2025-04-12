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
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Newsletter Subscription"
        verbose_name_plural = "Newsletter Subscriptions"
        ordering = ['-created_at']

    def __str__(self):
        return self.email 