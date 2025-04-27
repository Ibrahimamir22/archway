import { NextResponse } from 'next/server';

// Mock data for company history
const companyHistoryData = {
  en: [
    {
      id: 1,
      year: 2014,
      title: 'Foundation',
      description: 'Archway Interiors was founded with a vision to transform spaces into artful experiences.',
      order: 1
    },
    {
      id: 2,
      year: 2015,
      title: 'First Major Project',
      description: 'Completed our first large-scale residential project, establishing our reputation for quality and creativity.',
      order: 2
    },
    {
      id: 3,
      year: 2016,
      title: 'Expansion of Services',
      description: 'Added commercial design to our service portfolio, broadening our market reach.',
      order: 3
    },
    {
      id: 4,
      year: 2018,
      title: 'Industry Recognition',
      description: 'Received our first design award, placing us among the top design firms in the region.',
      order: 4
    },
    {
      id: 5,
      year: 2019,
      title: 'International Project',
      description: 'Expanded internationally with our first project in Dubai, marking a significant milestone in our growth.',
      order: 5
    },
    {
      id: 6,
      year: 2020,
      title: 'Pandemic Pivot',
      description: 'Adapted to global challenges by introducing virtual design consultations and remote project management.',
      order: 6
    },
    {
      id: 7,
      year: 2021,
      title: '3D Visualization Studio',
      description: 'Launched our dedicated 3D visualization studio, enhancing our ability to bring designs to life before construction.',
      order: 7
    },
    {
      id: 8,
      year: 2023,
      title: 'Sustainability Initiative',
      description: 'Committed to sustainable design practices with eco-friendly materials and energy-efficient solutions.',
      order: 8
    },
    {
      id: 9,
      year: 2024,
      title: 'Looking Forward',
      description: 'Continuing to innovate and expand, with a focus on blending technology and artistry in interior design.',
      order: 9
    }
  ],
  ar: [
    {
      id: 1,
      year: 2014,
      title: 'التأسيس',
      description: 'تم تأسيس آركواي للتصميم الداخلي برؤية لتحويل المساحات إلى تجارب فنية.',
      order: 1
    },
    {
      id: 2,
      year: 2015,
      title: 'أول مشروع كبير',
      description: 'أكملنا أول مشروع سكني واسع النطاق، مما رسخ سمعتنا في الجودة والإبداع.',
      order: 2
    },
    {
      id: 3,
      year: 2016,
      title: 'توسيع الخدمات',
      description: 'أضفنا التصميم التجاري إلى محفظة خدماتنا، مما وسع نطاق وصولنا إلى السوق.',
      order: 3
    },
    {
      id: 4,
      year: 2018,
      title: 'الاعتراف بالصناعة',
      description: 'حصلنا على أول جائزة تصميم، مما وضعنا بين شركات التصميم الرائدة في المنطقة.',
      order: 4
    },
    {
      id: 5,
      year: 2019,
      title: 'مشروع دولي',
      description: 'توسعنا دوليًا مع أول مشروع لنا في دبي، مما يمثل علامة فارقة مهمة في نمونا.',
      order: 5
    },
    {
      id: 6,
      year: 2020,
      title: 'التكيف مع الوباء',
      description: 'تكيفنا مع التحديات العالمية من خلال تقديم استشارات تصميم افتراضية وإدارة المشاريع عن بعد.',
      order: 6
    },
    {
      id: 7,
      year: 2021,
      title: 'استوديو التصور ثلاثي الأبعاد',
      description: 'أطلقنا استوديو التصور ثلاثي الأبعاد المخصص، مما عزز قدرتنا على إحياء التصاميم قبل البناء.',
      order: 7
    },
    {
      id: 8,
      year: 2023,
      title: 'مبادرة الاستدامة',
      description: 'التزمنا بممارسات التصميم المستدام مع المواد الصديقة للبيئة والحلول الموفرة للطاقة.',
      order: 8
    },
    {
      id: 9,
      year: 2024,
      title: 'التطلع إلى المستقبل',
      description: 'نواصل الابتكار والتوسع، مع التركيز على الجمع بين التكنولوجيا والفن في التصميم الداخلي.',
      order: 9
    }
  ]
};

// Add a delay to simulate real-world API latency
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 250));

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
  const data = locale === 'ar' ? companyHistoryData.ar : companyHistoryData.en;
  
  // Return the mock data
  return NextResponse.json({
    success: true,
    data: data,
    meta: {
      total: data.length
    }
  }, { 
    status: 200,
    headers: {
      // Add cache control headers
      'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
    }
  });
} 