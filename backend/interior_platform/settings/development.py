from .base import * 

# Override base settings for Development environment

DEBUG = True

# Use a simple fallback SECRET_KEY for development if not set in .env
# WARNING: Do not use this key in production!
SECRET_KEY = config('SECRET_KEY', default='django-insecure-6^&bpr5^!3)h#_$k5-dgg#$6)2a7#@%f6024pcla@aud)g6d@7') 

ALLOWED_HOSTS = ['localhost', '127.0.0.1', 'backend', 'frontend'] # Add 'backend' if accessing via docker service name

# Development-specific CORS origins (adjust if needed, or load from a DEV_CORS_ALLOWED_ORIGINS env var)
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://frontend:3000', 
]

# # Allow all CORS headers and methods for development
# CORS_ALLOW_ALL_ORIGINS = True  # For development only - more permissive
# CORS_ALLOW_METHODS = [
#     'DELETE',
#     'GET',
#     'OPTIONS',
#     'PATCH',
#     'POST',
#     'PUT',
# ]
# CORS_ALLOW_HEADERS = [
#     'accept',
#     'accept-encoding',
#     'authorization',
#     'content-type',
#     'dnt',
#     'origin',
#     'user-agent',
#     'x-csrftoken',
#     'x-requested-with',
# ]
CORS_ALLOW_CREDENTIALS = True # Often needed for frontend interaction during dev

# Use console email backend for development to see emails in the terminal
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Development Timezone
TIME_ZONE = 'Europe/London' 

# Disable secure cookies in development
CSRF_COOKIE_SECURE = False
SESSION_COOKIE_SECURE = False

# Optional: Add django-debug-toolbar for development (requires adding to requirements-dev.txt)
# INSTALLED_APPS += ['debug_toolbar']
# MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
# INTERNAL_IPS = ['127.0.0.1']

# Logging configuration can be simpler for development
# LOGGING = { ... } # Simplified logging config if needed 