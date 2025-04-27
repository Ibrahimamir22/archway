# Base settings will be added here 

"""
Base Django settings for interior_platform project.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.1/ref/settings/
"""

from pathlib import Path
import os
from decouple import config, Csv
from django.utils.translation import gettext_lazy as _

# Build paths inside the project like this: BASE_DIR / 'subdir'.
# `settings` directory is now one level deeper, so go up two levels
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
# Loaded from .env file
SECRET_KEY = config('SECRET_KEY')

# SECURITY WARNING: don't run with debug turned on in production!
# Loaded from .env file, defaults to False for safety
DEBUG = config('DEBUG', default=False, cast=bool)

# Host names allowed to access this server
# Loaded from .env file (comma-separated string)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='127.0.0.1,localhost', cast=Csv())

# CORS settings
# Loaded from .env file (comma-separated string)
CORS_ALLOWED_ORIGINS = config('CORS_ALLOWED_ORIGINS', default='http://localhost:3000,http://127.0.0.1:3000', cast=Csv())
CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]
CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
]
# Loaded from .env file, defaults to False
CORS_ALLOW_CREDENTIALS = config('CORS_ALLOW_CREDENTIALS', default=False, cast=bool)


# Application definition

INSTALLED_APPS = [
    # Admin interface
    'admin_interface',  # Admin UI customization
    'colorfield',  # Color picker for admin interface

    # Django built-in apps
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    # Third-party apps
    'rest_framework',
    'corsheaders',
    'django_filters',

    # Project apps
    'apps.projects',
    'apps.testimonials',
    'apps.services',
    'apps.footer',  # New app for footer functionality
    'apps.newsletter',  # New app for newsletter functionality
    'apps.contact_management',  # New app for contact management
    'apps.email_system',  # New app for email delivery and automation
    'apps.faqs',  # FAQ app
    'apps.about',  # About page content app
    
    # Commented out apps
    # 'apps.contact',  # Original contact app (temporarily disabled for testing)
    # 'apps.users',  # Commented out to fix ModuleNotFoundError
    # 'apps.analytics',  # Commented out to fix ModuleNotFoundError
    # 'apps.blog',  # Commented out to fix ModuleNotFoundError
    # 'apps.bookings',  # Commented out to fix ModuleNotFoundError
    # 'apps.chatbot',  # Commented out to fix ModuleNotFoundError
    # 'apps.jobs',  # Commented out to fix ModuleNotFoundError
    # 'apps.users',  # Commented out to fix ModuleNotFoundError
]

# Admin Interface settings
X_FRAME_OPTIONS = 'SAMEORIGIN'
SILENCED_SYSTEM_CHECKS = ['security.W019'] # Consider removing this if not strictly needed after reviewing security implications

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # CORS middleware
    'django.middleware.locale.LocaleMiddleware',  # Internationalization middleware
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    # 'django_ratelimit.middleware.RatelimitMiddleware',  # Consider enabling in production.py
    # 'apps.contact.middleware.DynamicEmailSettingsMiddleware',  # Disabled since contact app is disabled
    'apps.email_system.middleware.DynamicEmailSettingsMiddleware',  # New middleware for email settings
]

# Rate limiting settings - Consider environment-specific rates
RATELIMIT_USE_CACHE = 'default'
RATELIMIT_VIEW = 'django_ratelimit.views.limited'
RATELIMIT_RATE = config('RATELIMIT_RATE', default='100/h') # Load rate from .env

ROOT_URLCONF = 'interior_platform.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'django.template.context_processors.i18n',  # Internationalization
            ],
        },
    },
]

WSGI_APPLICATION = 'interior_platform.wsgi.application'


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases
# Database connection details loaded from .env
DATABASES = {
    'default': {
        'ENGINE': config('DB_ENGINE', default='django.db.backends.postgresql'),
        'NAME': config('DB_NAME', default='postgres'),
        'USER': config('DB_USER', default='postgres'),
        'PASSWORD': config('DB_PASSWORD', default='postgres'),
        'HOST': config('DB_HOST', default='localhost'),
        'PORT': config('DB_PORT', default='5432'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

# TIME_ZONE setting should be environment-specific (dev vs prod)
# TIME_ZONE = 'UTC' # Default suggestion, override in dev/prod files

USE_I18N = True
USE_L10N = True # DEPRECATED since Django 5.0, prefer USE_I18N for formatting
USE_TZ = True

# Available languages
LANGUAGES = [
    ('en', _('English')),
    ('ar', _('Arabic')),
]

LOCALE_PATHS = [
    BASE_DIR / 'locale',
]


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = '/static/'
# STATIC_ROOT should typically be set only in production.py for collectstatic
STATIC_ROOT = BASE_DIR / 'staticfiles'  # Directory where collectstatic will gather files
STATICFILES_DIRS = [
    # This is usually for finding static files within your project structure during development
    # If you only have static files in apps, this might not be needed.
    BASE_DIR / 'static',  # For project-level static files
]

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media' # Ensure this directory exists and is writable by the server process

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# REST Framework settings
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
        # 'rest_framework_simplejwt.authentication.JWTAuthentication', # To be added in Phase 3
    ],
    'DEFAULT_PERMISSION_CLASSES': [
        'rest_framework.permissions.IsAuthenticatedOrReadOnly', # Default, may override per-view
    ],
    'DEFAULT_FILTER_BACKENDS': [
        'django_filters.rest_framework.DjangoFilterBackend',
        'rest_framework.filters.SearchFilter',
        'rest_framework.filters.OrderingFilter',
    ],
    'DEFAULT_PAGINATION_CLASS': 'rest_framework.pagination.PageNumberPagination',
    'PAGE_SIZE': 12,
}

# CSRF security settings
# Loaded from .env, defaults to False
CSRF_COOKIE_SECURE = config('CSRF_COOKIE_SECURE', default=False, cast=bool)
CSRF_COOKIE_HTTPONLY = True # Generally keep True
CSRF_COOKIE_SAMESITE = 'Lax' # 'Strict' if possible, 'Lax' is often more compatible

# Session security settings
# Loaded from .env, defaults to False
SESSION_COOKIE_SECURE = config('SESSION_COOKIE_SECURE', default=False, cast=bool)
SESSION_COOKIE_HTTPONLY = True # Keep True for security


# Email settings
# Default to console backend, override in dev/prod
EMAIL_BACKEND = config('EMAIL_BACKEND', default='django.core.mail.backends.console.EmailBackend')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='info@archwaydesign.com')
CONTACT_NOTIFICATION_EMAILS = config('CONTACT_NOTIFICATION_EMAILS', default='info@archwaydesign.com', cast=Csv())

# SMTP settings (loaded from .env, used if EMAIL_BACKEND is set to smtp)
EMAIL_HOST = config('EMAIL_HOST', default='')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='') # Often 'apikey' for SendGrid
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='') # The actual API key 