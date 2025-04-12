from django.db import models
from django.contrib.auth.models import User


class Profile(models.Model):
    """Placeholder model for user profiles."""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    
    def __str__(self):
        return self.user.username 