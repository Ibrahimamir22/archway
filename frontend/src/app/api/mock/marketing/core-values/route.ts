import { NextResponse } from 'next/server';

// Mock data for core values
const coreValuesData = {
  en: [
    {
      id: 'value1',
      title: 'Excellence',
      description: 'We strive for excellence in every project, ensuring the highest quality in design and execution.',
      icon: 'fas fa-medal',
      order: 1
    },
    {
      id: 'value2',
      title: 'Innovation',
      description: 'We embrace innovative approaches to create unique and forward-thinking designs.',
      icon: 'fas fa-lightbulb',
      order: 2
    },
    {
      id: 'value3',
      title: 'Integrity',
      description: 'We maintain the highest standards of integrity in all our client and partner relationships.',
      icon: 'fas fa-handshake',
      order: 3
    },
    {
      id: 'value4',
      title: 'Sustainability',
      description: 'We are committed to environmentally conscious design practices that minimize ecological impact.',
      icon: 'fas fa-leaf',
      order: 4
    }
  ],
  ar: [
    {
      id: 'value1',
      title: 'التميز',
      description: 'نسعى جاهدين لتحقيق التميز في كل مشروع، مما يضمن أعلى جودة في التصميم والتنفيذ.',
      icon: 'fas fa-medal',
      order: 1
    },
    {
      id: 'value2',
      title: 'الابتكار',
      description: 'نحن نتبنى نهجًا مبتكرًا لإنشاء تصميمات فريدة ومتطورة.',
      icon: 'fas fa-lightbulb',
      order: 2
    },
    {
      id: 'value3',
      title: 'النزاهة',
      description: 'نحافظ على أعلى معايير النزاهة في جميع علاقاتنا مع العملاء والشركاء.',
      icon: 'fas fa-handshake',
      order: 3
    },
    {
      id: 'value4',
      title: 'الاستدامة',
      description: 'نحن ملتزمون بممارسات التصميم المراعية للبيئة التي تقلل الأثر البيئي.',
      icon: 'fas fa-leaf',
      order: 4
    }
  ]
};

// Add a delay to simulate real-world API latency
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 150));

export async function GET(request: Request) {
  // Get the URL and extract parameters
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  
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
  const data = locale === 'ar' ? coreValuesData.ar : coreValuesData.en;
  
  // Return the mock data
  return NextResponse.json({
    success: true,
    data: data
  }, { 
    status: 200,
    headers: {
      // Add cache control headers
      'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
    }
  });
} 