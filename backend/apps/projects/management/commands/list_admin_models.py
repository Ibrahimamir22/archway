from django.core.management.base import BaseCommand
from django.contrib import admin

class Command(BaseCommand):
    help = 'Lists all models registered in the admin site'

    def handle(self, *args, **options):
        self.stdout.write('Models registered in admin site:')
        for model, model_admin in admin.site._registry.items():
            self.stdout.write(f'- {model.__name__} ({model._meta.app_label}): {model_admin.__class__.__name__}') 