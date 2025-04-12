from django.db import models


class JobPosting(models.Model):
    """Placeholder model for job postings."""
    title = models.CharField(max_length=200)
    
    def __str__(self):
        return self.title 