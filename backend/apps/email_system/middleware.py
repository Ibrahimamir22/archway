from django.conf import settings
import logging

logger = logging.getLogger(__name__)

class DynamicEmailSettingsMiddleware:
    """
    Middleware that configures email settings dynamically based on current database settings.
    This allows changing email configuration without restarting the server.
    """
    
    def __init__(self, get_response):
        self.get_response = get_response
        logger.info("DynamicEmailSettingsMiddleware initialized")
        
    def __call__(self, request):
        # Process request: load settings from database before view is called
        self._load_email_settings()
        
        # Get response
        response = self.get_response(request)
        
        # Return response
        return response
    
    def _load_email_settings(self):
        """
        Load email settings from the database and update Django settings.
        If no settings are found or an error occurs, the default settings remain unchanged.
        """
        try:
            # Import here to avoid circular imports
            from apps.email_system.models import EmailConfiguration
            
            # Get latest configuration
            config = EmailConfiguration.objects.filter(active=True).order_by('-updated_at').first()
            
            if config:
                # Update Django settings with database values
                settings.EMAIL_BACKEND = config.email_backend
                settings.EMAIL_HOST = config.email_host
                settings.EMAIL_PORT = config.email_port
                settings.EMAIL_HOST_USER = config.email_host_user
                settings.EMAIL_HOST_PASSWORD = config.email_host_password
                settings.EMAIL_USE_TLS = config.email_use_tls
                settings.DEFAULT_FROM_EMAIL = config.default_from_email
                
                logger.debug(f"Email settings updated from database: {settings.EMAIL_HOST}:{settings.EMAIL_PORT}")
            else:
                logger.debug("No active email configuration found in database")
                
        except Exception as e:
            # If anything goes wrong, log the error but don't crash
            logger.error(f"Error loading email settings from database: {str(e)}") 