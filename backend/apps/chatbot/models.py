from django.db import models


class ChatSession(models.Model):
    """Placeholder model for chat sessions."""
    session_id = models.CharField(max_length=100, unique=True)
    
    def __str__(self):
        return self.session_id 