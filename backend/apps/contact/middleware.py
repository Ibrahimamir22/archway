from django.conf import settings
from .models import EmailConfiguration

class DynamicEmailSettingsMiddleware:
    """Middleware to dynamically apply email settings from database configuration"""
    
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Apply the email settings at the start of each request
        try:
            email_config = EmailConfiguration.objects.filter(active=True).first()
            if email_config:
                # Apply email settings from the database configuration
                settings.EMAIL_BACKEND = email_config.email_backend
                settings.EMAIL_HOST = email_config.email_host
                settings.EMAIL_PORT = email_config.email_port
                settings.EMAIL_USE_TLS = email_config.email_use_tls
                settings.EMAIL_HOST_USER = email_config.email_host_user
                settings.EMAIL_HOST_PASSWORD = email_config.email_host_password
                settings.DEFAULT_FROM_EMAIL = email_config.default_from_email
        except Exception as e:
            # Log the error but continue with default settings
            import logging
            logger = logging.getLogger(__name__)
            logger.error(f"Error applying email settings: {str(e)}")

        # Process the request
        response = self.get_response(request)
        return response 