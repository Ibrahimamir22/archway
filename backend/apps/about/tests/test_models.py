from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile
from ..models import (
    AboutPage, TeamMember, CoreValue, Testimonial,
    CompanyHistory, CompanyStatistic, ClientLogo
)

class AboutPageModelTest(TestCase):
    """Test the AboutPage model"""
    
    def setUp(self):
        self.about_page = AboutPage.objects.create(
            title='Test About Page',
            subtitle='Test Subtitle',
            mission_title='Test Mission',
            mission_description='Test Mission Description',
            vision_title='Test Vision',
            vision_description='Test Vision Description',
            team_section_title='Test Team Section',
            values_section_title='Test Values Section',
            testimonials_section_title='Test Testimonials Section',
            history_section_title='Test History Section',
            meta_description='Test Meta Description',
            title_ar='اختبار صفحة عنا',
            subtitle_ar='اختبار العنوان الفرعي',
            mission_title_ar='اختبار المهمة',
            mission_description_ar='اختبار وصف المهمة',
            vision_title_ar='اختبار الرؤية',
            vision_description_ar='اختبار وصف الرؤية',
            team_section_title_ar='اختبار قسم الفريق',
            values_section_title_ar='اختبار قسم القيم',
            testimonials_section_title_ar='اختبار قسم الشهادات',
            history_section_title_ar='اختبار قسم التاريخ',
            meta_description_ar='اختبار وصف الميتا'
        )
    
    def test_about_page_str(self):
        """Test the string representation of the AboutPage model"""
        self.assertEqual(str(self.about_page), 'Test About Page')
    
    def test_about_page_fields(self):
        """Test that the AboutPage model fields are saved correctly"""
        self.assertEqual(self.about_page.title, 'Test About Page')
        self.assertEqual(self.about_page.subtitle, 'Test Subtitle')
        self.assertEqual(self.about_page.mission_title, 'Test Mission')
        self.assertEqual(self.about_page.mission_description, 'Test Mission Description')
        self.assertEqual(self.about_page.vision_title, 'Test Vision')
        self.assertEqual(self.about_page.vision_description, 'Test Vision Description')
        self.assertEqual(self.about_page.team_section_title, 'Test Team Section')
        self.assertEqual(self.about_page.values_section_title, 'Test Values Section')
        self.assertEqual(self.about_page.testimonials_section_title, 'Test Testimonials Section')
        self.assertEqual(self.about_page.history_section_title, 'Test History Section')
        self.assertEqual(self.about_page.meta_description, 'Test Meta Description')
        self.assertEqual(self.about_page.title_ar, 'اختبار صفحة عنا')
        self.assertEqual(self.about_page.subtitle_ar, 'اختبار العنوان الفرعي')
        self.assertEqual(self.about_page.mission_title_ar, 'اختبار المهمة')


class TeamMemberModelTest(TestCase):
    """Test the TeamMember model"""
    
    def setUp(self):
        # Create a dummy image for testing
        self.image = SimpleUploadedFile(
            name='test_image.jpg',
            content=b'',  # Empty content for simplicity
            content_type='image/jpeg'
        )
        
        self.team_member = TeamMember.objects.create(
            name='Test Member',
            role='Test Role',
            bio='Test Bio',
            image=self.image,
            email='test@example.com',
            linkedin='https://linkedin.com/test',
            order=1,
            is_active=True,
            is_featured=True,
            department='Test Department',
            name_ar='اختبار عضو',
            role_ar='اختبار دور',
            bio_ar='اختبار السيرة الذاتية',
            department_ar='اختبار الإدارة'
        )
    
    def test_team_member_str(self):
        """Test the string representation of the TeamMember model"""
        self.assertEqual(str(self.team_member), 'Test Member')
    
    def test_team_member_fields(self):
        """Test that the TeamMember model fields are saved correctly"""
        self.assertEqual(self.team_member.name, 'Test Member')
        self.assertEqual(self.team_member.role, 'Test Role')
        self.assertEqual(self.team_member.bio, 'Test Bio')
        self.assertEqual(self.team_member.email, 'test@example.com')
        self.assertEqual(self.team_member.linkedin, 'https://linkedin.com/test')
        self.assertEqual(self.team_member.order, 1)
        self.assertTrue(self.team_member.is_active)
        self.assertTrue(self.team_member.is_featured)
        self.assertEqual(self.team_member.department, 'Test Department')
        self.assertEqual(self.team_member.name_ar, 'اختبار عضو')
        self.assertEqual(self.team_member.role_ar, 'اختبار دور')
        self.assertEqual(self.team_member.bio_ar, 'اختبار السيرة الذاتية')
        self.assertEqual(self.team_member.department_ar, 'اختبار الإدارة')


class CoreValueModelTest(TestCase):
    """Test the CoreValue model"""
    
    def setUp(self):
        self.core_value = CoreValue.objects.create(
            title='Test Value',
            description='Test Description',
            icon='icon-test',
            order=1,
            title_ar='اختبار القيمة',
            description_ar='اختبار الوصف'
        )
    
    def test_core_value_str(self):
        """Test the string representation of the CoreValue model"""
        self.assertEqual(str(self.core_value), 'Test Value')
    
    def test_core_value_fields(self):
        """Test that the CoreValue model fields are saved correctly"""
        self.assertEqual(self.core_value.title, 'Test Value')
        self.assertEqual(self.core_value.description, 'Test Description')
        self.assertEqual(self.core_value.icon, 'icon-test')
        self.assertEqual(self.core_value.order, 1)
        self.assertEqual(self.core_value.title_ar, 'اختبار القيمة')
        self.assertEqual(self.core_value.description_ar, 'اختبار الوصف')
