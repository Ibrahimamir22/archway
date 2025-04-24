import uuid
from django.db import models
from django.utils.text import slugify
from django.utils.html import mark_safe, format_html
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from django.utils.safestring import mark_safe
from django.conf import settings
from django.core.cache import cache

# Define TimeStampedModel locally
class TimeStampedModel(models.Model):
    """An abstract base class model that provides self-updating created_at and updated_at fields."""
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        abstract = True

class FooterSettings(TimeStampedModel):
    """
    Global settings for the website footer.
    Only one instance of this model should exist.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    # Toggle fields
    is_active = models.BooleanField(default=True, verbose_name="Show Footer")
    show_newsletter = models.BooleanField(default=False, verbose_name="Show Newsletter Signup")
    show_company_info = models.BooleanField(default=True, verbose_name="Show Company Information")
    show_contact_info = models.BooleanField(default=True, verbose_name="Show Contact Information")
    show_copyright = models.BooleanField(default=True, verbose_name="Show Copyright")
    show_contact_section = models.BooleanField(default=True, verbose_name="Show Contact Section")
    
    # Company Info fields
    company_name_en = models.CharField(max_length=100, blank=True, verbose_name="Company Name (English)")
    company_name_ar = models.CharField(max_length=100, blank=True, verbose_name="Company Name (Arabic)")
    
    description_en = models.TextField(blank=True, verbose_name="Description (English)")
    description_ar = models.TextField(blank=True, verbose_name="Description (Arabic)")
    
    # Contact Info fields
    email = models.EmailField(blank=True, verbose_name="Email")
    phone = models.CharField(max_length=20, blank=True, verbose_name="Phone")
    
    address_en = models.TextField(blank=True, verbose_name="Address (English)")
    address_ar = models.TextField(blank=True, verbose_name="Address (Arabic)")
    
    # Copyright field
    copyright_text_en = models.CharField(max_length=255, blank=True, verbose_name="Copyright Text (English)")
    copyright_text_ar = models.CharField(max_length=255, blank=True, verbose_name="Copyright Text (Arabic)")
    
    # Newsletter fields
    newsletter_text_en = models.CharField(max_length=255, blank=True, verbose_name="Newsletter Text (English)")
    newsletter_text_ar = models.CharField(max_length=255, blank=True, verbose_name="Newsletter Text (Arabic)")
    
    newsletter_label_en = models.CharField(max_length=255, blank=True, verbose_name="Newsletter Label (English)", 
                                          help_text="Label for the newsletter signup button")
    newsletter_label_ar = models.CharField(max_length=255, blank=True, verbose_name="Newsletter Label (Arabic)", 
                                          help_text="Label for the newsletter signup button")
    
    # Contact Section Override
    contact_title_en = models.CharField(max_length=100, blank=True, default='', verbose_name="Contact Section Title (English)")
    contact_title_ar = models.CharField(max_length=100, blank=True, default='', verbose_name="Contact Section Title (Arabic)")
    
    # timestamp fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"Footer Settings - Updated {self.updated_at.strftime('%Y-%m-%d')}"
    
    def clean(self):
        """Validate required fields based on toggle states"""
        errors = {}
        
        # Validate company info
        if self.show_company_info and not (self.company_name_en or self.company_name_ar):
            errors['company_name_en'] = "Company name is required when company information is enabled"
        
        # Validate contact info
        if self.show_contact_info and not (self.email or self.phone):
            if not self.email:
                errors['email'] = "Email is required when contact information is enabled"
            if not self.phone:
                errors['phone'] = "Phone is required when contact information is enabled"
        
        # Validate copyright
        if self.show_copyright and not (self.copyright_text_en or self.copyright_text_ar):
            errors['copyright_text_en'] = "Copyright text is required when copyright is enabled"
        
        # Validate contact section
        if self.show_contact_section and not (self.contact_title_en or self.contact_title_ar):
            errors['contact_title_en'] = "Contact section title is required when contact section is enabled"
        
        # Validate newsletter
        if self.show_newsletter and not (self.newsletter_text_en or self.newsletter_text_ar or 
                                       self.newsletter_label_en or self.newsletter_label_ar):
            errors['newsletter_text_en'] = "Newsletter text and label are required when newsletter is enabled"
        
        if errors:
            raise ValidationError(errors)
    
    def save(self, *args, **kwargs):
        """Override save to clear cache"""
        super().save(*args, **kwargs)
        self.clear_cache()
        
    @classmethod
    def clear_cache(cls):
        for lang_code, _ in settings.LANGUAGES:
            cache_key = f'footer_settings_{lang_code}'
            cache.delete(cache_key)


class FooterSection(TimeStampedModel):
    """
    A section in the footer (e.g., "Quick Links", "Services").
    Each section can contain multiple links.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title_en = models.CharField(
        max_length=100,
        verbose_name=_('Title (English)'),
        help_text=_('Section heading displayed in the footer. Example: "Quick Links", "Services", "Information"')
    )
    title_ar = models.CharField(
        max_length=100,
        verbose_name=_('Title (Arabic)'),
        help_text=_('Arabic translation of the section title')
    )
    slug = models.SlugField(
        max_length=120, 
        unique=True, 
        verbose_name=_('Slug'),
        help_text=_('Unique identifier used in URLs and templates. Auto-generated from title if left blank.')
    )
    order = models.PositiveIntegerField(
        default=0, 
        verbose_name=_('Display Order'),
        help_text=_('Sections are displayed in ascending order (0 appears first)')
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('Active'),
        help_text=_('Enable or disable this section in the footer')
    )
    
    # Add a nullable title field for backwards compatibility
    title = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        editable=False,
        help_text=_('Legacy field for backwards compatibility')
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Created At'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Updated At'))
    
    def active_links_count(self):
        """Count of active links in this section."""
        count = self.links.filter(is_active=True).count()
        return format(count, ',d')
    active_links_count.short_description = _("Active Links")
    
    def preview(self):
        """Preview of links in this section."""
        if not self.is_active:
            return mark_safe(f'<span style="color: #dc3545;">⚠️ {_("Hidden")}</span>')
            
        links = self.links.filter(is_active=True).order_by('order')[:3]
        if not links:
            return mark_safe(f'<em style="color: #ffc107;">⚠️ {_("No active links")}</em>')
            
        link_list = ', '.join([link.title for link in links])
        more = ''
        if self.links.filter(is_active=True).count() > 3:
            more = f' <em>+ {self.links.filter(is_active=True).count() - 3} {_("more")}</em>'
            
        return mark_safe(f'<strong>{link_list}</strong>{more}')
    preview.short_description = _("Link Preview")
    
    class Meta:
        verbose_name = _("Footer Section")
        verbose_name_plural = _("Footer Sections")
        ordering = ['order', 'title']
    
    def __str__(self):
        status = _("Active") if self.is_active else _("Inactive")
        return f"{self.title} ({status})"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)
    
    @property
    def active_links(self):
        """Return the count of active links in this section."""
        return self.links.filter(is_active=True).count()


class FooterLink(TimeStampedModel):
    """
    A link within a footer section.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    section = models.ForeignKey(
        FooterSection,
        on_delete=models.CASCADE,
        related_name='links',
        verbose_name=_('Section'),
        help_text=_('The footer section this link belongs to')
    )
    title_en = models.CharField(
        max_length=100,
        verbose_name=_('Link Title (English)'),
        help_text=_('Text displayed for this link. Example: "About Us", "Services", "Contact"')
    )
    title_ar = models.CharField(
        max_length=100,
        verbose_name=_('Link Title (Arabic)'),
        help_text=_('Arabic translation of the link title')
    )
    url = models.CharField(
        max_length=255,
        verbose_name=_('URL'),
        help_text=_(
            'URL for this link. Can be a relative path (e.g., "/about") or an absolute URL (e.g., "https://example.com"). '
            'For internal pages, use relative paths starting with "/" (e.g., "/services").'
        )
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name=_('Display Order'),
        help_text=_('Links are displayed in ascending order (0 appears first) within each section')
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('Active'),
        help_text=_('Enable or disable this link in the footer')
    )
    open_in_new_tab = models.BooleanField(
        default=False,
        verbose_name=_('Open in New Tab'),
        help_text=_('If enabled, the link will open in a new browser tab/window')
    )
    
    # Add a nullable title field for backwards compatibility
    title = models.CharField(
        max_length=100,
        null=True,
        blank=True,
        editable=False,
        help_text=_('Legacy field for backwards compatibility')
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Created At'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Updated At'))
    
    class Meta:
        verbose_name = _("Footer Link")
        verbose_name_plural = _("Footer Links")
        ordering = ['section', 'order', 'title']
    
    def __str__(self):
        status = _("Active") if self.is_active else _("Inactive")
        return f"{self.section.title} - {self.title} ({status})"


SOCIAL_MEDIA_PLATFORMS = [
    ('facebook', _('Facebook')),
    ('twitter', _('Twitter')),
    ('instagram', _('Instagram')),
    ('linkedin', _('LinkedIn')),
    ('youtube', _('YouTube')),
    ('pinterest', _('Pinterest')),
    ('tiktok', _('TikTok')),
    ('whatsapp', _('WhatsApp')),
    ('telegram', _('Telegram')),
    ('snapchat', _('Snapchat')),
    ('behance', _('Behance')),
    ('dribbble', _('Dribbble')),
    ('github', _('GitHub')),
    ('medium', _('Medium')),
    ('other', _('Other')),
]


class SocialMedia(TimeStampedModel):
    """
    Social media links for the footer.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    platform = models.CharField(
        max_length=50, 
        choices=SOCIAL_MEDIA_PLATFORMS,
        verbose_name=_("Platform"),
        help_text=_("Select the social media platform")
    )
    url = models.URLField(
        max_length=255, 
        verbose_name=_("URL"),
        help_text=_("Full URL to your social media profile. Example: 'https://www.instagram.com/your_profile'")
    )
    icon = models.CharField(
        max_length=100, 
        blank=True, 
        null=True, 
        verbose_name=_("Custom Icon Class"),
        help_text=_(
            'Optional: Font Awesome icon class to override the default icon. Leave blank to use default. '
            'Example: "fab fa-instagram"'
        )
    )
    order = models.PositiveIntegerField(
        default=0, 
        verbose_name=_("Display Order"),
        help_text=_("Social media links are displayed in ascending order (0 appears first)")
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_("Active"),
        help_text=_("Enable or disable this social media link in the footer")
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_("Created At"))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_("Updated At"))
    
    @property
    def get_icon(self):
        """Return the appropriate icon class for this social media platform."""
        if self.icon:
            return self.icon
        
        # Default Font Awesome icons for common platforms
        icon_map = {
            'facebook': 'fab fa-facebook-f',
            'twitter': 'fab fa-twitter',
            'instagram': 'fab fa-instagram',
            'linkedin': 'fab fa-linkedin-in',
            'youtube': 'fab fa-youtube',
            'pinterest': 'fab fa-pinterest-p',
            'tiktok': 'fab fa-tiktok',
            'whatsapp': 'fab fa-whatsapp',
            'snapchat': 'fab fa-snapchat-ghost',
            'telegram': 'fab fa-telegram-plane',
            'other': 'fas fa-link',
        }
        
        return icon_map.get(self.platform, 'fas fa-link')
    
    class Meta:
        verbose_name = _("Social Media Link")
        verbose_name_plural = _("Social Media Links")
        ordering = ['order', 'platform']
    
    def __str__(self):
        status = _("Active") if self.is_active else _("Inactive")
        return f"{self.get_platform_display()} ({status})"


class FooterBottomLink(TimeStampedModel):
    """
    Links displayed at the bottom of the footer (e.g., Terms of Service, Privacy Policy).
    These links appear below the copyright text.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title_en = models.CharField(
        max_length=100,
        verbose_name=_('Link Title (English)'),
        help_text=_('Text displayed for this link. Example: "Terms of Service", "Privacy Policy"')
    )
    title_ar = models.CharField(
        max_length=100,
        verbose_name=_('Link Title (Arabic)'),
        help_text=_('Arabic translation of the link title')
    )
    url = models.CharField(
        max_length=255,
        verbose_name=_('URL'),
        help_text=_(
            'URL for this link. Can be a relative path (e.g., "/terms") or an absolute URL. '
            'For internal pages, use relative paths starting with "/" (e.g., "/privacy").'
        )
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name=_('Display Order'),
        help_text=_('Links are displayed in ascending order (0 appears first)')
    )
    is_active = models.BooleanField(
        default=True,
        verbose_name=_('Active'),
        help_text=_('Enable or disable this link in the footer')
    )
    open_in_new_tab = models.BooleanField(
        default=False,
        verbose_name=_('Open in New Tab'),
        help_text=_('If enabled, the link will open in a new browser tab/window')
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True, verbose_name=_('Created At'))
    updated_at = models.DateTimeField(auto_now=True, verbose_name=_('Updated At'))
    
    class Meta:
        verbose_name = _("Footer Bottom Link")
        verbose_name_plural = _("Footer Bottom Links")
        ordering = ['order', 'title_en']
    
    def __str__(self):
        status = _("Active") if self.is_active else _("Inactive")
        return f"{self.title_en} ({status})"
        
    @property
    def title(self):
        """Return the English title for backward compatibility."""
        return self.title_en
