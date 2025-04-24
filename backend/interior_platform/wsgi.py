"""
WSGI config for interior_platform project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/wsgi/
"""

import os

from django.core.wsgi import get_wsgi_application

# Point to production settings by default for WSGI server
# The actual settings used can be overridden by the DJANGO_SETTINGS_MODULE env var in deployment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'interior_platform.settings.production')

application = get_wsgi_application()
