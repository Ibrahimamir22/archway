import { NextRequest, NextResponse } from 'next/server';

// Mock data for fallback
const mockCategories = [
  {
    id: 'general',
    name: 'General Information',
    name_ar: 'معلومات عامة',
    slug: 'general-information',
    order: 1,
    is_active: true,
    faqs: [
      {
        id: '1',
        question: 'What services does Archway Innovations offer?',
        question_ar: 'ما هي الخدمات التي تقدمونها؟',
        answer: 'We offer a complete range of interior design services including space planning, furniture selection, lighting design, color consulting, and project management for both residential and commercial spaces.',
        answer_ar: 'نقدم مجموعة واسعة من خدمات التصميم الداخلي للمساحات السكنية والتجارية.',
        order: 1,
        language: 'en'
      },
      {
        id: '6',
        question: 'What areas do you serve?',
        question_ar: 'ما هي المناطق التي تخدمونها؟',
        answer: 'We primarily serve Cairo, Egypt and surrounding areas. For projects outside this region, we offer virtual design services or can make arrangements for on-site visits depending on the project scope.',
        answer_ar: 'نخدم بشكل أساسي القاهرة ومصر والمناطق المحيطة بها. للمشاريع خارج هذه المنطقة، نقدم خدمات التصميم الافتراضية.',
        order: 2,
        language: 'en'
      }
    ]
  },
  {
    id: 'process',
    name: 'Design Process',
    name_ar: 'عملية التصميم',
    slug: 'design-process',
    order: 2,
    is_active: true,
    faqs: [
      {
        id: '2',
        question: 'How does the design process work?',
        question_ar: 'كيف تعمل عملية التصميم؟',
        answer: 'Our design process typically includes: <ol><li>Initial consultation</li><li>Concept development</li><li>Design presentation</li><li>Revisions</li><li>Final documentation</li><li>Implementation</li></ol>',
        answer_ar: 'تتضمن عملية التصميم لدينا: <ol><li>استشارة أولية</li><li>تطوير المفهوم</li><li>عرض التصميم</li><li>التعديلات</li><li>التوثيق النهائي</li><li>التنفيذ</li></ol>',
        order: 1,
        language: 'en'
      },
      {
        id: '4',
        question: 'How long does a typical interior design project take?',
        question_ar: 'كم من الوقت يستغرق المشروع النموذجي؟',
        answer: 'Project timelines vary depending on scope and complexity. Small room designs may take 4-6 weeks, while complete home renovations can take 6-12 months.',
        answer_ar: 'تختلف الجداول الزمنية للمشاريع حسب النطاق والتعقيد. قد تستغرق تصميمات الغرف الصغيرة 4-6 أسابيع، بينما يمكن أن تستغرق تجديدات المنازل الكاملة 6-12 شهرًا.',
        order: 2,
        language: 'en'
      }
    ]
  }
];

/**
 * Specific API route for the FAQ by-category endpoint
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters from the request
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || 'en';
    
    // Create the endpoint URL with language parameter
    // Use the API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';
    
    // The actual URL for the by_category action - notice the underscore instead of dash
    // and that it's an action on the FAQViewSet, not a separate endpoint
    const endpointUrl = `${apiUrl}/faqs/by_category/?language=${language}`;
    
    console.log('Fetching FAQs from backend:', endpointUrl);
    
    // Make the request to the backend API with a longer timeout (15 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    try {
      const response = await fetch(endpointUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        cache: 'no-store' // Disable caching to ensure fresh data
      });
      
      clearTimeout(timeoutId);
      
      // Log the response status for debugging
      console.log('Backend API response status:', response.status);
      
      // If the response is not OK, try the alternate URL format (with dash instead of underscore)
      if (!response.ok) {
        console.log('First attempt failed, trying alternate URL format');
        const alternateUrl = `${apiUrl}/faqs/by-category/?language=${language}`;
        console.log('Trying alternate URL:', alternateUrl);
        
        const alternateResponse = await fetch(alternateUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-store'
        });
        
        if (!alternateResponse.ok) {
          throw new Error(`Backend API error: ${response.status}, alternate also failed: ${alternateResponse.status}`);
        }
        
        const data = await alternateResponse.json();
        
        // Check if we received valid data (should be an array)
        if (!Array.isArray(data)) {
          console.error('Backend API returned invalid data format:', data);
          throw new Error('Invalid data format received from backend');
        }
        
        console.log(`Successfully fetched ${data.length} FAQ categories from backend (alternate URL)`);
        
        // Return the data as JSON
        return NextResponse.json(data);
      }
      
      // Get the data from the response
      const data = await response.json();
      
      // Check if we received valid data (should be an array)
      if (!Array.isArray(data)) {
        console.error('Backend API returned invalid data format:', data);
        throw new Error('Invalid data format received from backend');
      }
      
      console.log(`Successfully fetched ${data.length} FAQ categories from backend`);
      
      // Return the data as JSON
      return NextResponse.json(data);
    } catch (fetchError) {
      // Only throw if it's not an abort error (timeout)
      if (fetchError.name !== 'AbortError') {
        throw fetchError;
      }
      console.error('Request timed out after 15 seconds');
      throw new Error('Request timed out');
    }
  } catch (error) {
    console.error('FAQ by-category API route error:', error);
    
    // Return mock data as fallback
    console.warn('Returning mock FAQ data as fallback');
    
    // Filter mock data based on requested language
    const language = request.nextUrl.searchParams.get('language') || 'en';
    
    // Process mock data for the requested language
    const localizedMockData = mockCategories.map(category => {
      // For Arabic, use the Arabic name if available
      const name = language === 'ar' && category.name_ar ? category.name_ar : category.name;
      
      // Filter FAQs by language or provide appropriate translation
      const faqs = category.faqs.map(faq => ({
        id: faq.id,
        question: language === 'ar' && faq.question_ar ? faq.question_ar : faq.question,
        answer: language === 'ar' && faq.answer_ar ? faq.answer_ar : faq.answer,
        order: faq.order,
        language: language
      }));
      
      return {
        ...category,
        name,
        faqs
      };
    });
    
    // Mock data for debugging purposes - can be removed in production
    console.log(`Returning ${localizedMockData.length} mock FAQ categories`);
    
    return NextResponse.json(localizedMockData);
  }
} 