import uuid
from django.db import models
from django.utils.text import slugify


class ProjectCategory(models.Model):
    """Category for organizing projects"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name_en = models.CharField(max_length=100)
    name_ar = models.CharField(max_length=100, blank=True)
    slug = models.SlugField(max_length=120, unique=True)
    description_en = models.TextField(blank=True)
    description_ar = models.TextField(blank=True)
    parent = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='children')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = "Project Category"
        verbose_name_plural = "Project Categories"
        ordering = ['name_en']

    def __str__(self):
        return self.name_en

    @property
    def name(self):
        return self.name_en
        
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name_en)
        super().save(*args, **kwargs)


class Tag(models.Model):
    """Tags for projects"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name_en = models.CharField(max_length=50)
    name_ar = models.CharField(max_length=50, blank=True)
    slug = models.SlugField(max_length=70, unique=True)

    class Meta:
        ordering = ['name_en']

    def __str__(self):
        return self.name_en

    @property
    def name(self):
        return self.name_en
        
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name_en)
        super().save(*args, **kwargs)


class Project(models.Model):
    """Main project model representing interior design projects"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title_en = models.CharField(max_length=200)
    title_ar = models.CharField(max_length=200, blank=True)
    slug = models.SlugField(max_length=250, unique=True)
    description_en = models.TextField()
    description_ar = models.TextField(blank=True)
    category = models.ForeignKey(ProjectCategory, on_delete=models.SET_NULL, null=True, related_name='projects')
    client_en = models.CharField(max_length=100, blank=True)
    client_ar = models.CharField(max_length=100, blank=True)
    location_en = models.CharField(max_length=200, blank=True)
    location_ar = models.CharField(max_length=200, blank=True)
    area = models.FloatField(help_text="Area in square meters", null=True, blank=True)
    completed_date = models.DateField(null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False, help_text="Only published projects are displayed on the website")
    cover_image = models.ImageField(upload_to='projects/covers/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    tags = models.ManyToManyField(Tag, blank=True, related_name='projects')
    
    # Note: designer field will be added after User model is created
    # designer = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='projects')

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title_en

    @property
    def title(self):
        return self.title_en
        
    @property
    def description(self):
        return self.description_en
        
    @property
    def location(self):
        return self.location_en
        
    @property
    def client(self):
        return self.client_en
        
    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title_en)
        super().save(*args, **kwargs)


class ProjectImage(models.Model):
    """Images associated with projects"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='projects/%Y/%m/')
    alt_text_en = models.CharField(max_length=200, blank=True)
    alt_text_ar = models.CharField(max_length=200, blank=True)
    is_cover = models.BooleanField(default=False)
    order = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return f"Image for {self.project.title_en} - {self.order}"
        
    @property
    def alt_text(self):
        return self.alt_text_en
