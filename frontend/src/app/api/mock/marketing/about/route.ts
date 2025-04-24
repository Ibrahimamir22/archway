import { NextResponse } from 'next/server';

// Mock data for About page
const aboutData = {
  en: {
    hero: {
      title: 'About Archway Innovations',
      subtitle: 'Transforming Spaces, Enhancing Lives',
      backgroundImage: '/images/about-bg.jpg'
    },
    missionVision: {
      mission: {
        title: 'Our Mission',
        content: 'To become the leading interior design firm in Egypt known for our exceptional designs and sustainable practices that enhance quality of life.',
        icon: 'fas fa-bullseye'
      },
      vision: {
        title: 'Our Vision',
        content: 'Creating innovative interior designs that balance aesthetics, functionality, and sustainability while exceeding client expectations.',
        icon: 'fas fa-eye'
      }
    },
    coreValuesTitle: 'Our Core Values',
    coreValues: [
      {
        id: 'value1',
        title: 'Excellence',
        description: 'We strive for excellence in every project, ensuring the highest quality in design and execution.',
        icon: 'fas fa-star'
      },
      {
        id: 'value2',
        title: 'Innovation',
        description: 'We embrace innovative approaches to create unique and forward-thinking designs.',
        icon: 'fas fa-lightbulb'
      },
      {
        id: 'value3',
        title: 'Integrity',
        description: 'We maintain the highest standards of integrity in all our client and partner relationships.',
        icon: 'fas fa-handshake'
      },
      {
        id: 'value4',
        title: 'Sustainability',
        description: 'We are committed to environmentally conscious design practices that minimize ecological impact.',
        icon: 'fas fa-leaf'
      }
    ],
    teamMembers: {
      featured: [
        {
          id: 'tm1',
          name: 'Sarah Johnson',
          position: 'Founder & CEO',
          department: 'Leadership',
          bio: 'With over 15 years of experience in interior design, Sarah founded Archway Innovations to transform spaces into extraordinary experiences.',
          profileImage: '/images/team/sarah.jpg',
          featured: true,
          isPriority: true,
          social: {
            linkedin: 'https://linkedin.com/in/sarahjohnson',
            twitter: 'https://twitter.com/sarahjohnson',
            email: 'sarah@archwayinnovations.com'
          }
        },
        {
          id: 'tm2',
          name: 'Michael Chen',
          position: 'Creative Director',
          department: 'Design',
          bio: 'Michael brings a unique perspective to each project, blending contemporary aesthetics with functional design principles.',
          profileImage: '/images/team/michael.jpg',
          featured: true,
          isPriority: true,
          social: {
            linkedin: 'https://linkedin.com/in/michaelchen',
            twitter: null,
            email: 'michael@archwayinnovations.com'
          }
        }
      ],
      meta: {
        total: 12,
        departments: ['Leadership', 'Design', 'Project Management', 'Client Relations']
      }
    },
    companyStats: {
      stats: [
        {
          id: 'stat1',
          title: 'Client Satisfaction',
          value: 98.5,
          suffix: '%',
          icon: 'fas fa-smile',
          order: 1
        },
        {
          id: 'stat2',
          title: 'Happy Clients',
          value: 120,
          prefix: '+',
          icon: 'fas fa-users',
          order: 2
        },
        {
          id: 'stat3',
          title: 'Years of Experience',
          value: 9,
          prefix: '+',
          icon: 'fas fa-calendar',
          order: 3
        },
        {
          id: 'stat4',
          title: 'Completed Projects',
          value: 250,
          prefix: '+',
          icon: 'fas fa-building',
          order: 4
        }
      ],
      meta: {
        title: 'Company Stats',
        description: 'Our achievements in numbers'
      }
    }
  },
  ar: {
    hero: {
      title: 'عن شركة آركواي',
      subtitle: 'تحويل المساحات، تعزيز الحياة',
      backgroundImage: '/images/about-bg.jpg'
    },
    missionVision: {
      mission: {
        title: 'مهمتنا',
        content: 'أن نصبح لشركة التصميم الداخلي الرائدة في مصر المعروفة بتصميماتنا الاستثنائية وممارساتنا المستدامة التي تعزز جودة الحياة.',
        icon: 'fas fa-bullseye'
      },
      vision: {
        title: 'رؤيتنا',
        content: 'إنشاء تصميمات داخلية مبتكرة توازن بين الجماليات والوظائف والاستدامة مع تجاوز توقعات العملاء.',
        icon: 'fas fa-eye'
      }
    },
    coreValuesTitle: 'قيمنا الأساسية',
    coreValues: [
      {
        id: 'value1',
        title: 'التميز',
        description: 'نسعى جاهدين لتحقيق التميز في كل مشروع، مما يضمن أعلى جودة في التصميم والتنفيذ.',
        icon: 'fas fa-star'
      },
      {
        id: 'value2',
        title: 'الابتكار',
        description: 'نحن نتبنى نهجًا مبتكرًا لإنشاء تصميمات فريدة ومتطورة.',
        icon: 'fas fa-lightbulb'
      },
      {
        id: 'value3',
        title: 'النزاهة',
        description: 'نحافظ على أعلى معايير النزاهة في جميع علاقاتنا مع العملاء والشركاء.',
        icon: 'fas fa-handshake'
      },
      {
        id: 'value4',
        title: 'الاستدامة',
        description: 'نحن ملتزمون بممارسات التصميم المراعية للبيئة التي تقلل الأثر البيئي.',
        icon: 'fas fa-leaf'
      }
    ],
    teamMembers: {
      featured: [
        {
          id: 'tm1',
          name: 'سارة جونسون',
          position: 'المؤسس والرئيس التنفيذي',
          department: 'القيادة',
          bio: 'مع أكثر من 15 عامًا من الخبرة في التصميم الداخلي، أسست سارة آركواي لتحويل المساحات إلى تجارب استثنائية.',
          profileImage: '/images/team/sarah.jpg',
          featured: true,
          isPriority: true,
          social: {
            linkedin: 'https://linkedin.com/in/sarahjohnson',
            twitter: 'https://twitter.com/sarahjohnson',
            email: 'sarah@archwayinnovations.com'
          }
        },
        {
          id: 'tm2',
          name: 'مايكل تشن',
          position: 'المدير الإبداعي',
          department: 'التصميم',
          bio: 'يجلب مايكل منظورًا فريدًا لكل مشروع، حيث يمزج بين الجماليات المعاصرة ومبادئ التصميم الوظيفي.',
          profileImage: '/images/team/michael.jpg',
          featured: true,
          isPriority: true,
          social: {
            linkedin: 'https://linkedin.com/in/michaelchen',
            twitter: null,
            email: 'michael@archwayinnovations.com'
          }
        }
      ],
      meta: {
        total: 12,
        departments: ['القيادة', 'التصميم', 'إدارة المشاريع', 'علاقات العملاء']
      }
    },
    companyStats: {
      stats: [
        {
          id: 'stat1',
          title: 'رضا العملاء',
          value: 98.5,
          suffix: '%',
          icon: 'fas fa-smile',
          order: 1
        },
        {
          id: 'stat2',
          title: 'عملاء سعداء',
          value: 120,
          prefix: '+',
          icon: 'fas fa-users',
          order: 2
        },
        {
          id: 'stat3',
          title: 'سنوات الخبرة',
          value: 9,
          prefix: '+',
          icon: 'fas fa-calendar',
          order: 3
        },
        {
          id: 'stat4',
          title: 'المشاريع المنجزة',
          value: 250,
          prefix: '+',
          icon: 'fas fa-building',
          order: 4
        }
      ],
      meta: {
        title: 'إحصائيات الشركة',
        description: 'إنجازاتنا بالأرقام'
      }
    }
  }
};

// Add a delay to simulate real-world API latency
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 300));

export async function GET(request: Request) {
  // Get the URL and extract locale parameter
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  
  // Simulate network delay
  await simulateNetworkDelay();
  
  // Randomly simulate failure (10% of the time) to demonstrate fallback chain
  if (Math.random() < 0.1) {
    return NextResponse.json(
      { success: false, error: { code: 'RANDOM_FAILURE', message: 'Random mock API failure for testing fallback' } },
      { status: 500 }
    );
  }
  
  // Check if we have data for the requested locale
  if (['en', 'ar'].includes(locale)) {
    // Return the mock data for the selected locale
    return NextResponse.json({
      success: true,
      data: aboutData[locale as 'en' | 'ar'],
    }, { 
      status: 200,
      headers: {
        // Add cache control headers
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
      }
    });
  } else {
    // Fall back to English if the locale is not supported
    return NextResponse.json({
      success: true,
      data: aboutData.en,
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
      }
    });
  }
} 