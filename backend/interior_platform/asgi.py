"""
ASGI config for interior_platform project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

from django.core.asgi import get_asgi_application

# Point to production settings by default for ASGI server
# The actual settings used can be overridden by the DJANGO_SETTINGS_MODULE env var in deployment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'interior_platform.settings.production')

application = get_asgi_application()
# If using Channels, import ProtocolTypeRouter here and wrap application
