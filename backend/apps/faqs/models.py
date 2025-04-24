from django.db import models
from django.utils.translation import gettext_lazy as _
from django.utils.translation import get_language


class FAQCategory(models.Model):
    """Category for grouping related FAQ items"""
    name_en = models.CharField(_("Name (English)"), max_length=100)
    name_ar = models.CharField(_("Name (Arabic)"), max_length=100, blank=True)
    slug = models.SlugField(_("Slug"), unique=True, help_text=_("URL-friendly identifier"))
    order = models.PositiveIntegerField(_("Display Order"), default=0, help_text=_("Order in which category is displayed"))
    is_active = models.BooleanField(_("Active"), default=True)
    created_at = models.DateTimeField(_("Created At"), auto_now_add=True)
    updated_at = models.DateTimeField(_("Updated At"), auto_now=True)

    class Meta:
        verbose_name = _("FAQ Category")
        verbose_name_plural = _("FAQ Categories")
        ordering = ["order", "name_en"]

    def __str__(self):
        return self.name_en
    
    @property
    def name(self):
        """Get name based on currently active translation"""
        # Get current language or use request context if available
        lang_code = get_language()
        
        # Get from context if available
        if hasattr(self, '_current_language') and self._current_language:
            lang_code = self._current_language
            
        # Default to English if no language is found
        if not lang_code:
            return self.name_en
            
        # Return name based on language
        if lang_code.startswith('ar'):
            return self.name_ar if self.name_ar else self.name_en
        
        # Default to English
        return self.name_en


class FAQ(models.Model):
    """Frequently Asked Question model with category and language support"""
    category = models.ForeignKey(
        FAQCategory, 
        on_delete=models.CASCADE, 
        related_name="faqs",
        verbose_name=_("Category")
    )
    question_text = models.CharField(
        max_length=255,
        verbose_name=_('Question')
    )
    answer_text = models.TextField(
        verbose_name=_('Answer')
    )
    language = models.CharField(
        max_length=10,
        choices=[
            ('en', _('English')),
            ('ar', _('Arabic')),
            ('fr', _('French')),
            ('de', _('German')),
        ],
        default='en',
        verbose_name=_('Language')
    )
    order = models.PositiveIntegerField(
        default=0,
        verbose_name=_('Display Order'),
        help_text=_("Order in which question is displayed within its category")
    )
    is_active = models.BooleanField(
        default=True, 
        verbose_name=_('Active')
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Created At')
    )
    updated_at = models.DateTimeField(
        auto_now=True,
        verbose_name=_('Updated At')
    )

    class Meta:
        verbose_name = _('FAQ')
        verbose_name_plural = _('FAQs')
        ordering = ['category', 'order', 'created_at']
        indexes = [
            models.Index(fields=['language']),
            models.Index(fields=['is_active']),
            models.Index(fields=['category', 'order']),
        ]
    
    def __str__(self):
        return f"{self.question_text} ({self.get_language_display()})"
    
    @property
    def question(self):
        """Get question text"""
        return self.question_text
    
    @property
    def answer(self):
        """Get answer text"""
        return self.answer_text 