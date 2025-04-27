from django.db import models
from django.utils.translation import gettext_lazy as _

class AboutPage(models.Model):
    """Main about page content model"""
    title = models.CharField(_("Title"), max_length=200)
    subtitle = models.CharField(_("Subtitle"), max_length=500)
    mission_title = models.CharField(_("Mission Title"), max_length=200)
    mission_description = models.TextField(_("Mission Description"))
    vision_title = models.CharField(_("Vision Title"), max_length=200)
    vision_description = models.TextField(_("Vision Description"))
    team_section_title = models.CharField(_("Team Section Title"), max_length=200)
    values_section_title = models.CharField(_("Values Section Title"), max_length=200)
    testimonials_section_title = models.CharField(_("Testimonials Section Title"), max_length=200)
    history_section_title = models.CharField(_("History Section Title"), max_length=200, blank=True)
    meta_description = models.TextField(_("Meta Description"), blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Localization fields
    title_ar = models.CharField(_("Title (Arabic)"), max_length=200)
    subtitle_ar = models.CharField(_("Subtitle (Arabic)"), max_length=500)
    mission_title_ar = models.CharField(_("Mission Title (Arabic)"), max_length=200)
    mission_description_ar = models.TextField(_("Mission Description (Arabic)"))
    vision_title_ar = models.CharField(_("Vision Title (Arabic)"), max_length=200)
    vision_description_ar = models.TextField(_("Vision Description (Arabic)"))
    team_section_title_ar = models.CharField(_("Team Section Title (Arabic)"), max_length=200)
    values_section_title_ar = models.CharField(_("Values Section Title (Arabic)"), max_length=200)
    testimonials_section_title_ar = models.CharField(_("Testimonials Section Title (Arabic)"), max_length=200)
    history_section_title_ar = models.CharField(_("History Section Title (Arabic)"), max_length=200, blank=True)
    meta_description_ar = models.TextField(_("Meta Description (Arabic)"), blank=True)
    
    class Meta:
        verbose_name = _("About Page Content")
        verbose_name_plural = _("About Page Content")
    
    def __str__(self):
        return self.title


class TeamMember(models.Model):
    """Team member model"""
    name = models.CharField(_("Name"), max_length=100)
    role = models.CharField(_("Role"), max_length=100)
    bio = models.TextField(_("Biography"))
    image = models.ImageField(_("Image"), upload_to='team/')
    email = models.EmailField(_("Email"), blank=True)
    linkedin = models.URLField(_("LinkedIn"), blank=True)
    order = models.PositiveIntegerField(_("Order"), default=0)
    is_active = models.BooleanField(_("Active"), default=True)
    is_featured = models.BooleanField(_("Featured"), default=False)
    department = models.CharField(_("Department"), max_length=100, blank=True)
    
    # Localization fields
    name_ar = models.CharField(_("Name (Arabic)"), max_length=100)
    role_ar = models.CharField(_("Role (Arabic)"), max_length=100)
    bio_ar = models.TextField(_("Biography (Arabic)"))
    department_ar = models.CharField(_("Department (Arabic)"), max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'name']
        verbose_name = _("Team Member")
        verbose_name_plural = _("Team Members")
    
    def __str__(self):
        return self.name


class CoreValue(models.Model):
    """Company core values model"""
    title = models.CharField(_("Title"), max_length=100)
    description = models.TextField(_("Description"))
    icon = models.CharField(_("Icon"), max_length=50, help_text=_("Icon name or identifier"))
    order = models.PositiveIntegerField(_("Order"), default=0)
    
    # Localization fields
    title_ar = models.CharField(_("Title (Arabic)"), max_length=100)
    description_ar = models.TextField(_("Description (Arabic)"))
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order']
        verbose_name = _("Core Value")
        verbose_name_plural = _("Core Values")
    
    def __str__(self):
        return self.title


class Testimonial(models.Model):
    """Client testimonials model"""
    client_name = models.CharField(_("Client Name"), max_length=100)
    quote = models.TextField(_("Quote"))
    project = models.CharField(_("Project"), max_length=100, blank=True)
    is_featured = models.BooleanField(_("Featured"), default=False)
    
    # Localization fields
    client_name_ar = models.CharField(_("Client Name (Arabic)"), max_length=100)
    quote_ar = models.TextField(_("Quote (Arabic)"))
    project_ar = models.CharField(_("Project (Arabic)"), max_length=100, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name = _("Testimonial")
        verbose_name_plural = _("Testimonials")
    
    def __str__(self):
        return f"{self.client_name}"


class CompanyHistory(models.Model):
    """Company history events"""
    year = models.PositiveIntegerField(_("Year"))
    title = models.CharField(_("Title"), max_length=200)
    description = models.TextField(_("Description"))
    
    # Localization fields
    title_ar = models.CharField(_("Title (Arabic)"), max_length=200)
    description_ar = models.TextField(_("Description (Arabic)"))
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ["-year"]
        verbose_name = _("Company History Event")
        verbose_name_plural = _("Company History Events")
    
    def __str__(self):
        return f"{self.year}: {self.title}"


class CompanyStatistic(models.Model):
    """Company statistics"""
    title = models.CharField(_("Title"), max_length=100)
    value = models.PositiveIntegerField(_("Value"))
    unit = models.CharField(_("Unit"), max_length=20, blank=True)
    order = models.PositiveIntegerField(_("Order"), default=0)
    
    # Localization fields
    title_ar = models.CharField(_("Title (Arabic)"), max_length=100)
    unit_ar = models.CharField(_("Unit (Arabic)"), max_length=20, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ["order"]
        verbose_name = _("Company Statistic")
        verbose_name_plural = _("Company Statistics")
    
    def __str__(self):
        return f"{self.title}: {self.value}"


class ClientLogo(models.Model):
    """Client logo model"""
    name = models.CharField(_("Client Name"), max_length=100)
    logo = models.ImageField(_("Logo"), upload_to='clients/')
    url = models.URLField(_("Website URL"), blank=True)
    order = models.PositiveIntegerField(_("Order"), default=0)
    is_active = models.BooleanField(_("Active"), default=True)
    
    # Localization fields
    name_ar = models.CharField(_("Client Name (Arabic)"), max_length=100)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ["order", "name"]
        verbose_name = _("Client Logo")
        verbose_name_plural = _("Client Logos")
    
    def __str__(self):
        return self.name
