import { NextResponse } from 'next/server';

// Mock data for company statistics
const companyStatsData = {
  en: {
    stats: [
      {
        id: 'stat1',
        title: 'Client Satisfaction',
        value: 98.5,
        suffix: '%',
        description: 'Overall satisfaction rate from our clients',
        icon: 'fas fa-smile',
        order: 1
      },
      {
        id: 'stat2',
        title: 'Happy Clients',
        value: 120,
        prefix: '+',
        description: 'Clients who have trusted us with their projects',
        icon: 'fas fa-users',
        order: 2
      },
      {
        id: 'stat3',
        title: 'Years of Experience',
        value: 9,
        prefix: '+',
        description: 'Combined years of expertise in interior design',
        icon: 'fas fa-calendar',
        order: 3
      },
      {
        id: 'stat4',
        title: 'Completed Projects',
        value: 250,
        prefix: '+',
        description: 'Successful projects delivered to our clients',
        icon: 'fas fa-building',
        order: 4
      }
    ],
    meta: {
      title: 'Company Stats',
      description: 'Our achievements and growth over the years'
    }
  },
  ar: {
    stats: [
      {
        id: 'stat1',
        title: 'رضا العملاء',
        value: 98.5,
        suffix: '%',
        description: 'معدل الرضا العام من عملائنا',
        icon: 'fas fa-smile',
        order: 1
      },
      {
        id: 'stat2',
        title: 'عملاء سعداء',
        value: 120,
        prefix: '+',
        description: 'عملاء وثقوا بنا في مشاريعهم',
        icon: 'fas fa-users',
        order: 2
      },
      {
        id: 'stat3',
        title: 'سنوات الخبرة',
        value: 9,
        prefix: '+',
        description: 'سنوات الخبرة المشتركة في التصميم الداخلي',
        icon: 'fas fa-calendar',
        order: 3
      },
      {
        id: 'stat4',
        title: 'المشاريع المنجزة',
        value: 250,
        prefix: '+',
        description: 'مشاريع ناجحة تم تسليمها لعملائنا',
        icon: 'fas fa-building',
        order: 4
      }
    ],
    meta: {
      title: 'إحصائيات الشركة',
      description: 'إنجازاتنا ونمونا على مر السنين'
    }
  }
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
  const data = locale === 'ar' ? companyStatsData.ar : companyStatsData.en;
  
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