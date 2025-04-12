from django.db import models


class Booking(models.Model):
    """Placeholder model for bookings."""
    name = models.CharField(max_length=200)
    
    def __str__(self):
        return self.name 