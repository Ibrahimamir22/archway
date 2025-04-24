from .base import * 

# Override base settings for Production environment

DEBUG = False

# SECRET_KEY, ALLOWED_HOSTS, DATABASES are loaded from environment variables in base.py
# Ensure these are set correctly in your production environment!

# Production CORS origins - loaded from .env
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', cast=Csv())
CORS_ALLOW_CREDENTIALS = config('CORS_ALLOW_CREDENTIALS', default=False, cast=bool)

# Email settings for production (e.g., SendGrid)
# Ensure these are loaded from environment variables in base.py
# Example: Use SMTP backend defined in base, ensure EMAIL_HOST_PASSWORD etc. are set
EMAIL_BACKEND = config('EMAIL_BACKEND', default='django.core.mail.backends.smtp.EmailBackend')

# Production Timezone
TIME_ZONE = 'UTC'

# Security settings for production
CSRF_COOKIE_SECURE = True
SESSION_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True
SECURE_SSL_REDIRECT = config('SECURE_SSL_REDIRECT', default=True, cast=bool) # Set to False behind a proxy handling HTTPS

# Static files handling for production
STATIC_ROOT = BASE_DIR / 'staticfiles' # Directory where collectstatic will gather files
# Consider using Whitenoise or cloud storage (S3) for serving static files
# MIDDLEWARE.insert(1, 'whitenoise.middleware.WhiteNoiseMiddleware') # Example for Whitenoise
# STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage' # Example for Whitenoise


# Logging configuration for production
# Example: Configure logging to file or external service
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
        # Add file handlers or integrations with logging services here
    },
    'root': {
        'handlers': ['console'], # Adjust as needed
        'level': 'WARNING', # Log WARNING and above in production
    },
    'loggers': {
        'django': {
            'handlers': ['console'], # Adjust as needed
            'level': config('DJANGO_LOG_LEVEL', default='INFO'),
            'propagate': False,
        },
    },
}

# Optional: Enable ratelimit middleware
# MIDDLEWARE.append('django_ratelimit.middleware.RatelimitMiddleware') 