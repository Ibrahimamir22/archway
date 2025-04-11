import uuid
from django.db import models

class Testimonial(models.Model):
    """Client testimonials/reviews"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    client_name_en = models.CharField(max_length=100)
    client_name_ar = models.CharField(max_length=100, blank=True)
    quote_en = models.TextField()
    quote_ar = models.TextField(blank=True)
    project = models.CharField(max_length=200, blank=True)
    approved = models.BooleanField(default=False, help_text="Only approved testimonials will be displayed on the website")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = "Testimonial"
        verbose_name_plural = "Testimonials"

    def __str__(self):
        return f"Testimonial from {self.client_name_en}"
    
    @property
    def client_name(self):
        return self.client_name_en
    
    @property
    def quote(self):
        return self.quote_en 