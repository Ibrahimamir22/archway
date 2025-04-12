import os
from django.core.management.base import BaseCommand
from django.conf import settings

class Command(BaseCommand):
    help = 'Checks the static files directory'

    def handle(self, *args, **options):
        static_root = settings.STATIC_ROOT
        static_url = settings.STATIC_URL
        
        self.stdout.write(f'STATIC_ROOT: {static_root}')
        self.stdout.write(f'STATIC_URL: {static_url}')
        
        if os.path.exists(static_root):
            self.stdout.write(f'Static root exists: Yes')
            static_files = os.listdir(static_root)
            self.stdout.write(f'Number of files: {len(static_files)}')
            
            if 'admin' in static_files:
                admin_path = os.path.join(static_root, 'admin')
                admin_files = os.listdir(admin_path)
                self.stdout.write(f'Admin directory exists: Yes')
                self.stdout.write(f'Admin files: {len(admin_files)}')
                
                if 'css' in admin_files:
                    css_path = os.path.join(admin_path, 'css')
                    css_files = os.listdir(css_path)
                    self.stdout.write(f'CSS directory exists: Yes')
                    self.stdout.write(f'CSS files: {css_files}')
                else:
                    self.stdout.write(f'CSS directory exists: No')
            else:
                self.stdout.write(f'Admin directory exists: No')
        else:
            self.stdout.write(f'Static root exists: No') 