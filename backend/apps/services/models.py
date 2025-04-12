import uuid
from django.db import models
from django.utils.text import slugify


class ServiceCategory(models.Model):
    """Category for organizing services"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name_en = models.CharField(max_length=100)
    name_ar = models.CharField(max_length=100, blank=True)
    slug = models.SlugField(max_length=120, unique=True)
    description_en = models.TextField(blank=True)
    description_ar = models.TextField(blank=True)
    icon = models.CharField(max_length=100, blank=True, help_text="Icon name from icon library (e.g., 'home')")
    order = models.PositiveIntegerField(default=0, help_text="Order of appearance in listing")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Service Category"
        verbose_name_plural = "Service Categories"
        ordering = ['order', 'name_en']

    def __str__(self):
        return self.name_en

    @property
    def name(self):
        return self.name_en
        
    @property
    def description(self):
        return self.description_en
        
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name_en)
        super().save(*args, **kwargs)


class Service(models.Model):
    """Model for interior design services"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title_en = models.CharField(max_length=200)
    title_ar = models.CharField(max_length=200, blank=True)
    slug = models.SlugField(max_length=250, unique=True)
    description_en = models.TextField()
    description_ar = models.TextField(blank=True)
    short_description_en = models.CharField(max_length=200, blank=True)
    short_description_ar = models.CharField(max_length=200, blank=True)
    category = models.ForeignKey(ServiceCategory, on_delete=models.SET_NULL, null=True, related_name='services')
    icon = models.CharField(max_length=100, blank=True, help_text="Icon name from icon library (e.g., 'home')")
    image = models.ImageField(upload_to='services/', blank=True, null=True)
    cover_image = models.ImageField(upload_to='services/covers/', blank=True, null=True, help_text="Cover image displayed at the top of the service page")
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_unit = models.CharField(max_length=50, blank=True, help_text="e.g., 'per hour', 'per sq ft', etc.")
    duration = models.CharField(max_length=50, blank=True, help_text="e.g., '2-3 weeks'")
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0, help_text="Order of appearance in listing")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['order', 'title_en']

    def __str__(self):
        return self.title_en

    @property
    def title(self):
        return self.title_en
        
    @property
    def description(self):
        return self.description_en
        
    @property
    def short_description(self):
        return self.short_description_en
        
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title_en)
        super().save(*args, **kwargs)


class ServiceFeature(models.Model):
    """Features of a service"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    service = models.ForeignKey(Service, on_delete=models.CASCADE, related_name='features')
    name_en = models.CharField(max_length=200)
    name_ar = models.CharField(max_length=200, blank=True)
    description_en = models.TextField(blank=True)
    description_ar = models.TextField(blank=True)
    is_included = models.BooleanField(default=True)
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"{self.name_en} - {self.service.title_en}"
        
    @property
    def name(self):
        return self.name_en
        
    @property
    def description(self):
        return self.description_en
