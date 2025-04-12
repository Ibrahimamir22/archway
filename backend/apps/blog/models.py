from django.db import models


class BlogPost(models.Model):
    """Placeholder model for blog posts."""
    title = models.CharField(max_length=200)
    
    def __str__(self):
        return self.title 