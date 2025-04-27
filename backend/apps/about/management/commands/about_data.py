import os
import json
from django.core.management.base import BaseCommand, CommandError
from django.core.serializers.json import DjangoJSONEncoder
from django.utils.translation import gettext_lazy as _
from apps.about.models import (
    AboutPage, TeamMember, CoreValue, Testimonial,
    CompanyHistory, CompanyStatistic, ClientLogo
)

class Command(BaseCommand):
    help = 'Manage About page data (export/import/reset)'
    
    def add_arguments(self, parser):
        parser.add_argument(
            'action',
            choices=['export', 'import', 'reset'],
            help='Action to perform: export, import, or reset About page data'
        )
        parser.add_argument(
            '--file',
            help='JSON file path for import/export operations',
            default='about_data.json'
        )
        parser.add_argument(
            '--force',
            action='store_true',
            help='Force reset without confirmation'
        )
    
    def handle(self, *args, **options):
        action = options['action']
        file_path = options['file']
        force = options['force']
        
        if action == 'export':
            self.export_data(file_path)
        elif action == 'import':
            self.import_data(file_path)
        elif action == 'reset':
            self.reset_data(force)
    
    def export_data(self, file_path):
        """Export About page data to a JSON file"""
        data = {
            'about_page': list(AboutPage.objects.all().values()),
            'team_members': list(TeamMember.objects.all().values()),
            'core_values': list(CoreValue.objects.all().values()),
            'testimonials': list(Testimonial.objects.all().values()),
            'company_history': list(CompanyHistory.objects.all().values()),
            'company_statistics': list(CompanyStatistic.objects.all().values()),
            'client_logos': list(ClientLogo.objects.all().values()),
        }
        
        try:
            with open(file_path, 'w') as f:
                json.dump(data, f, cls=DjangoJSONEncoder, indent=2)
            self.stdout.write(self.style.SUCCESS(f'Successfully exported data to {file_path}'))
        except Exception as e:
            raise CommandError(f'Error exporting data: {e}')
    
    def import_data(self, file_path):
        """Import About page data from a JSON file"""
        if not os.path.exists(file_path):
            raise CommandError(f'File {file_path} does not exist')
        
        try:
            with open(file_path, 'r') as f:
                data = json.load(f)
            
            # Process AboutPage
            AboutPage.objects.all().delete()
            for item in data.get('about_page', []):
                AboutPage.objects.create(**item)
            
            # Process TeamMember
            TeamMember.objects.all().delete()
            for item in data.get('team_members', []):
                TeamMember.objects.create(**item)
            
            # Process CoreValue
            CoreValue.objects.all().delete()
            for item in data.get('core_values', []):
                CoreValue.objects.create(**item)
            
            # Process Testimonial
            Testimonial.objects.all().delete()
            for item in data.get('testimonials', []):
                Testimonial.objects.create(**item)
            
            # Process CompanyHistory
            CompanyHistory.objects.all().delete()
            for item in data.get('company_history', []):
                CompanyHistory.objects.create(**item)
            
            # Process CompanyStatistic
            CompanyStatistic.objects.all().delete()
            for item in data.get('company_statistics', []):
                CompanyStatistic.objects.create(**item)
            
            # Process ClientLogo
            ClientLogo.objects.all().delete()
            for item in data.get('client_logos', []):
                ClientLogo.objects.create(**item)
            
            self.stdout.write(self.style.SUCCESS(f'Successfully imported data from {file_path}'))
        except Exception as e:
            raise CommandError(f'Error importing data: {e}')
    
    def reset_data(self, force=False):
        """Reset About page data to default values"""
        if not force:
            self.stdout.write(self.style.WARNING('This will delete all About page data. Are you sure?'))
            confirmation = input('Type "yes" to confirm: ')
            if confirmation.lower() != 'yes':
                self.stdout.write(self.style.ERROR('Operation cancelled'))
                return
        
        try:
            # Delete all existing data
            AboutPage.objects.all().delete()
            TeamMember.objects.all().delete()
            CoreValue.objects.all().delete()
            Testimonial.objects.all().delete()
            CompanyHistory.objects.all().delete()
            CompanyStatistic.objects.all().delete()
            ClientLogo.objects.all().delete()
            
            # Create default AboutPage
            AboutPage.objects.create(
                title='About Archway Innovations',
                subtitle='Transforming Spaces, Enhancing Lives',
                mission_title='Our Mission',
                mission_description='To create innovative interior designs that balance aesthetics, functionality, and sustainability while exceeding client expectations.',
                vision_title='Our Vision',
                vision_description='To be the leading interior design firm, recognized for our exceptional designs and sustainable practices that enhance quality of life.',
                team_section_title='Meet Our Team',
                values_section_title='Our Core Values',
                testimonials_section_title='What Our Clients Say',
                history_section_title='Our Journey',
                title_ar='عن آركواي للابتكارات',
                subtitle_ar='تحويل المساحات، تعزيز الحياة',
                mission_title_ar='مهمتنا',
                mission_description_ar='إنشاء تصاميم داخلية مبتكرة توازن بين الجماليات والوظائف والاستدامة مع تجاوز توقعات العملاء.',
                vision_title_ar='رؤيتنا',
                vision_description_ar='أن نكون شركة التصميم الداخلي الرائدة، المعروفة بتصاميمنا الاستثنائية وممارساتنا المستدامة التي تعزز جودة الحياة.',
                team_section_title_ar='تعرف على فريقنا',
                values_section_title_ar='قيمنا الأساسية',
                testimonials_section_title_ar='ماذا يقول عملاؤنا',
                history_section_title_ar='رحلتنا',
            )
            
            # Create default core values
            CoreValue.objects.create(
                title='Excellence',
                description='We strive for excellence in every project, paying meticulous attention to detail.',
                icon='star',
                order=1,
                title_ar='التميز',
                description_ar='نسعى للتميز في كل مشروع، مع الاهتمام الدقيق بالتفاصيل.'
            )
            CoreValue.objects.create(
                title='Innovation',
                description='We embrace innovative ideas and cutting-edge design techniques.',
                icon='lightbulb',
                order=2,
                title_ar='الابتكار',
                description_ar='نتبنى الأفكار المبتكرة وتقنيات التصميم المتطورة.'
            )
            CoreValue.objects.create(
                title='Sustainability',
                description='We\'re committed to sustainable design practices and environmentally friendly solutions.',
                icon='leaf',
                order=3,
                title_ar='الاستدامة',
                description_ar='نحن ملتزمون بممارسات التصميم المستدامة والحلول الصديقة للبيئة.'
            )
            
            # Create default statistics
            CompanyStatistic.objects.create(
                title='Projects Completed',
                value=150,
                unit='+',
                order=1,
                title_ar='المشاريع المنجزة',
                unit_ar='+'
            )
            CompanyStatistic.objects.create(
                title='Happy Clients',
                value=120,
                unit='+',
                order=2,
                title_ar='العملاء السعداء',
                unit_ar='+'
            )
            
            self.stdout.write(self.style.SUCCESS('Successfully reset About page data to defaults'))
        except Exception as e:
            raise CommandError(f'Error resetting data: {e}') 