from django.core.cache import cache
from .models import (
    AboutPage, TeamMember, CoreValue, Testimonial,
    CompanyHistory, CompanyStatistic, ClientLogo
)
from .serializers import (
    AboutPageSerializer, TeamMemberSerializer, CoreValueSerializer,
    TestimonialSerializer, CompanyHistorySerializer, CompanyStatisticSerializer,
    ClientLogoSerializer, LocalizedAboutPageSerializer
)

def get_about_page_content(language, request=None):
    """
    Returns combined data for the About page.
    Provides a single API endpoint for all About page content.
    
    Args:
        language (str): Language code (en or ar)
        request: HTTP request object for URL building
    
    Returns:
        dict: Combined data for the About page
    """
    # Debug logging
    print(f"Getting about page content for language: {language}")
    
    cache_key = f"about_page_combined_content:{language}"
    cached_data = cache.get(cache_key)
    
    if cached_data:
        print("Returning cached data")
        return cached_data
    
    # Get the main content
    about_page = AboutPage.objects.first()
    if not about_page:
        print("Creating new about page")
        about_page = AboutPage.objects.create(
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
            # Arabic defaults
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
    
    # Get related data
    team_members = TeamMember.objects.filter(is_active=True, is_featured=True).order_by('order', 'name')
    print(f"Found {team_members.count()} team members, IDs: {[tm.id for tm in team_members]}")
    
    core_values = CoreValue.objects.all().order_by('order')
    print(f"Found {core_values.count()} core values")
    
    testimonials = Testimonial.objects.filter(is_featured=True).order_by('-created_at')
    print(f"Found {testimonials.count()} testimonials")
    
    company_history = CompanyHistory.objects.all().order_by('-year')
    print(f"Found {company_history.count()} history events")
    
    statistics = CompanyStatistic.objects.all().order_by('order')
    print(f"Found {statistics.count()} statistics")
    
    client_logos = ClientLogo.objects.filter(is_active=True).order_by('order', 'name')
    print(f"Found {client_logos.count()} client logos")
    
    # Serialize data
    context = {'request': request, 'language': language}
    
    if language in ['en', 'ar']:
        about_serializer = LocalizedAboutPageSerializer(about_page, context=context)
    else:
        about_serializer = AboutPageSerializer(about_page, context=context)
    
    team_serializer = TeamMemberSerializer(team_members, many=True, context=context)
    print(f"Team serializer data length: {len(team_serializer.data)}")
    
    values_serializer = CoreValueSerializer(core_values, many=True, context=context)
    testimonials_serializer = TestimonialSerializer(testimonials, many=True, context=context)
    history_serializer = CompanyHistorySerializer(company_history, many=True, context=context)
    statistics_serializer = CompanyStatisticSerializer(statistics, many=True, context=context)
    logos_serializer = ClientLogoSerializer(client_logos, many=True, context=context)
    
    # Combine data
    result = {
        'main_content': about_serializer.data,
        'team_members': team_serializer.data,
        'core_values': values_serializer.data,
        'testimonials': testimonials_serializer.data,
        'company_history': history_serializer.data,
        'statistics': statistics_serializer.data,
        'client_logos': logos_serializer.data,
        'metadata': {
            'team_count': team_members.count(),
            'values_count': core_values.count(),
            'testimonials_count': testimonials.count(),
            'history_count': company_history.count(),
            'statistics_count': statistics.count(),
            'logos_count': client_logos.count(),
            'language': language
        }
    }
    
    # For debugging
    print(f"Team members in result: {len(result['team_members'])}")
    
    # Cache the result - comment out for debugging
    # cache.set(cache_key, result, 3600)  # Cache for 1 hour
    
    return result

def get_departments():
    """
    Returns a list of unique department names for team members.
    Useful for filtering and dropdown menus.
    
    Returns:
        list: List of unique department names
    """
    departments = TeamMember.objects.filter(
        is_active=True, 
        department__isnull=False
    ).exclude(
        department=''
    ).values_list('department', flat=True).distinct().order_by('department')
    
    return list(departments)
