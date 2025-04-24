import { NextResponse } from 'next/server';

// Mock data for team members
const teamMembersData = {
  en: [
    {
      id: 'tm1',
      name: 'Sarah Johnson',
      position: 'Founder & CEO',
      department: 'Leadership',
      bio: 'With over 15 years of experience in interior design, Sarah founded Archway Innovations to transform spaces into extraordinary experiences. Her vision drives our commitment to excellence.',
      profileImage: '/images/team/sarah.jpg',
      order: 1,
      featured: true,
      isPriority: true,
      social: {
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        twitter: 'https://twitter.com/sarahjohnson',
        email: 'sarah@archwayinnovations.com'
      },
      skills: ['Interior Design', 'Project Management', 'Client Relations']
    },
    {
      id: 'tm2',
      name: 'Michael Chen',
      position: 'Creative Director',
      department: 'Design',
      bio: 'Michael brings a unique perspective to each project, blending contemporary aesthetics with functional design principles. His award-winning approach has transformed countless spaces.',
      profileImage: '/images/team/michael.jpg',
      order: 2,
      featured: true,
      isPriority: true,
      social: {
        linkedin: 'https://linkedin.com/in/michaelchen',
        email: 'michael@archwayinnovations.com'
      },
      skills: ['Creative Direction', 'Spatial Design', 'Color Theory']
    },
    {
      id: 'tm3',
      name: 'Aisha Patel',
      position: 'Senior Designer',
      department: 'Design',
      bio: 'Aisha specializes in creating harmonious spaces that blend functionality with beauty. Her attention to detail and commitment to sustainability has made her a valuable team member.',
      profileImage: '/images/team/aisha.jpg',
      order: 3,
      featured: true,
      isPriority: false,
      social: {
        linkedin: 'https://linkedin.com/in/aishapatel',
        instagram: 'https://instagram.com/aisha_designs',
        email: 'aisha@archwayinnovations.com'
      },
      skills: ['Residential Design', 'Commercial Spaces', 'Sustainable Design']
    },
    {
      id: 'tm4',
      name: 'David Rodriguez',
      position: 'Project Manager',
      department: 'Project Management',
      bio: 'David ensures every project is delivered on time and within budget without compromising on quality. His meticulous approach keeps our projects running smoothly.',
      profileImage: '/images/team/david.jpg',
      order: 4,
      featured: true,
      isPriority: false,
      social: {
        linkedin: 'https://linkedin.com/in/davidrodriguez',
        email: 'david@archwayinnovations.com'
      },
      skills: ['Project Planning', 'Budget Management', 'Team Coordination']
    },
    {
      id: 'tm5',
      name: 'Emma Wilson',
      position: 'Client Relations Manager',
      department: 'Client Relations',
      bio: 'Emma ensures our clients receive exceptional service throughout their journey with us. Her warm approach and attention to detail create lasting client relationships.',
      profileImage: '/images/team/emma.jpg',
      order: 5,
      featured: false,
      isPriority: false,
      social: {
        linkedin: 'https://linkedin.com/in/emmawilson',
        email: 'emma@archwayinnovations.com'
      },
      skills: ['Client Communication', 'Needs Assessment', 'Service Excellence']
    },
    {
      id: 'tm6',
      name: 'Omar Hassan',
      position: 'Architectural Designer',
      department: 'Design',
      bio: 'Omar brings architectural expertise to our interior design projects, ensuring seamless integration between structural elements and interior spaces.',
      profileImage: '/images/team/omar.jpg',
      order: 6,
      featured: false,
      isPriority: false,
      social: {
        linkedin: 'https://linkedin.com/in/omarhassan',
        email: 'omar@archwayinnovations.com'
      },
      skills: ['Architectural Design', 'Space Planning', '3D Modeling']
    }
  ],
  ar: [
    {
      id: 'tm1',
      name: 'سارة جونسون',
      position: 'المؤسس والرئيس التنفيذي',
      department: 'القيادة',
      bio: 'مع أكثر من 15 عامًا من الخبرة في التصميم الداخلي، أسست سارة آركواي لتحويل المساحات إلى تجارب استثنائية. رؤيتها تقود التزامنا بالتميز.',
      profileImage: '/images/team/sarah.jpg',
      order: 1,
      featured: true,
      isPriority: true,
      social: {
        linkedin: 'https://linkedin.com/in/sarahjohnson',
        twitter: 'https://twitter.com/sarahjohnson',
        email: 'sarah@archwayinnovations.com'
      },
      skills: ['التصميم الداخلي', 'إدارة المشاريع', 'علاقات العملاء']
    },
    {
      id: 'tm2',
      name: 'مايكل تشن',
      position: 'المدير الإبداعي',
      department: 'التصميم',
      bio: 'يجلب مايكل منظورًا فريدًا لكل مشروع، حيث يمزج بين الجماليات المعاصرة ومبادئ التصميم الوظيفي. نهجه الحائز على جوائز حوّل عددًا لا يحصى من المساحات.',
      profileImage: '/images/team/michael.jpg',
      order: 2,
      featured: true,
      isPriority: true,
      social: {
        linkedin: 'https://linkedin.com/in/michaelchen',
        email: 'michael@archwayinnovations.com'
      },
      skills: ['التوجيه الإبداعي', 'التصميم المكاني', 'نظرية الألوان']
    },
    {
      id: 'tm3',
      name: 'عائشة باتيل',
      position: 'مصممة أولى',
      department: 'التصميم',
      bio: 'تتخصص عائشة في إنشاء مساحات متناغمة تمزج بين الوظائف والجمال. اهتمامها بالتفاصيل والتزامها بالاستدامة جعلها عضوًا قيمًا في الفريق.',
      profileImage: '/images/team/aisha.jpg',
      order: 3,
      featured: true,
      isPriority: false,
      social: {
        linkedin: 'https://linkedin.com/in/aishapatel',
        instagram: 'https://instagram.com/aisha_designs',
        email: 'aisha@archwayinnovations.com'
      },
      skills: ['تصميم المساكن', 'المساحات التجارية', 'التصميم المستدام']
    },
    {
      id: 'tm4',
      name: 'ديفيد رودريغيز',
      position: 'مدير المشروع',
      department: 'إدارة المشاريع',
      bio: 'يضمن ديفيد تسليم كل مشروع في الوقت المحدد وضمن الميزانية دون المساس بالجودة. نهجه الدقيق يحافظ على سير مشاريعنا بسلاسة.',
      profileImage: '/images/team/david.jpg',
      order: 4,
      featured: true,
      isPriority: false,
      social: {
        linkedin: 'https://linkedin.com/in/davidrodriguez',
        email: 'david@archwayinnovations.com'
      },
      skills: ['تخطيط المشاريع', 'إدارة الميزانية', 'تنسيق الفريق']
    },
    {
      id: 'tm5',
      name: 'إيما ويلسون',
      position: 'مديرة علاقات العملاء',
      department: 'علاقات العملاء',
      bio: 'تضمن إيما حصول عملائنا على خدمة استثنائية طوال رحلتهم معنا. نهجها الدافئ واهتمامها بالتفاصيل يخلق علاقات دائمة مع العملاء.',
      profileImage: '/images/team/emma.jpg',
      order: 5,
      featured: false,
      isPriority: false,
      social: {
        linkedin: 'https://linkedin.com/in/emmawilson',
        email: 'emma@archwayinnovations.com'
      },
      skills: ['التواصل مع العملاء', 'تقييم الاحتياجات', 'التميز في الخدمة']
    },
    {
      id: 'tm6',
      name: 'عمر حسن',
      position: 'مصمم معماري',
      department: 'التصميم',
      bio: 'يجلب عمر خبرة معمارية لمشاريع التصميم الداخلي لدينا، مما يضمن التكامل السلس بين العناصر الهيكلية والمساحات الداخلية.',
      profileImage: '/images/team/omar.jpg',
      order: 6,
      featured: false,
      isPriority: false,
      social: {
        linkedin: 'https://linkedin.com/in/omarhassan',
        email: 'omar@archwayinnovations.com'
      },
      skills: ['التصميم المعماري', 'تخطيط المساحات', 'النمذجة ثلاثية الأبعاد']
    }
  ]
};

// Add a delay to simulate real-world API latency
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 300));

export async function GET(request: Request) {
  // Get the URL and extract parameters
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  const department = searchParams.get('department');
  const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
  const featured = searchParams.get('featured') === 'true';
  
  // Simulate network delay
  await simulateNetworkDelay();
  
  // Randomly simulate failure (5% of the time) to demonstrate fallback chain
  if (Math.random() < 0.05) {
    return NextResponse.json(
      { 
        success: false, 
        error: { 
          code: 'RANDOM_FAILURE', 
          message: 'Random mock API failure for testing fallback' 
        } 
      },
      { status: 500 }
    );
  }
  
  // Select data based on locale
  let data = locale === 'ar' ? teamMembersData.ar : teamMembersData.en;
  
  // Filter by department if provided
  if (department) {
    data = data.filter(member => member.department === department);
  }
  
  // Filter by featured if requested
  if (featured) {
    data = data.filter(member => member.featured);
  }
  
  // Apply limit if provided
  if (limit && limit > 0 && limit < data.length) {
    data = data.slice(0, limit);
  }
  
  // Collect unique departments for metadata
  const departments = Array.from(new Set(
    (locale === 'ar' ? teamMembersData.ar : teamMembersData.en)
      .map(member => member.department)
  ));
  
  // Return the mock data
  return NextResponse.json({
    success: true,
    data: data,
    meta: {
      total: (locale === 'ar' ? teamMembersData.ar : teamMembersData.en).length,
      departments: departments
    }
  }, { 
    status: 200,
    headers: {
      // Add cache control headers
      'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
    }
  });
} 