import { NextResponse } from 'next/server';

// Mock data for testimonials
const testimonialsData = {
  en: [
    {
      id: 'test1',
      author: 'Emily Thompson',
      position: 'CEO',
      company: 'Modern Office Solutions',
      content: 'Working with Archway Innovations was a transformative experience. They completely reimagined our office space, creating an environment that inspires creativity and collaboration. Their attention to detail and commitment to understanding our needs made the process seamless.',
      imageUrl: '/images/testimonials/emily.jpg',
      rating: 5,
      category: 'Corporate',
      featured: true,
      order: 1
    },
    {
      id: 'test2',
      author: 'James Wilson',
      position: 'Homeowner',
      company: 'Residential Client',
      content: 'I cannot recommend Archway Innovations enough. They took our vision for our home and elevated it beyond what we thought possible. The team was professional, responsive, and truly passionate about creating a space that reflected our lifestyle and preferences.',
      imageUrl: '/images/testimonials/james.jpg',
      rating: 5,
      category: 'Residential',
      featured: true,
      order: 2
    },
    {
      id: 'test3',
      author: 'Sofia Martinez',
      position: 'Creative Director',
      company: 'Spark Design Studios',
      content: 'As someone working in the creative field, I have high expectations for design. Archway not only met those expectations but exceeded them. They created a studio space that perfectly balances aesthetics and functionality, enabling our team to do their best work.',
      imageUrl: '/images/testimonials/sofia.jpg',
      rating: 5,
      category: 'Creative',
      featured: true,
      order: 3
    },
    {
      id: 'test4',
      author: 'Ahmed Hassan',
      position: 'Managing Director',
      company: 'Golden Hospitality Group',
      content: 'Our hotel renovation project was complex, with tight deadlines and specific requirements. The team at Archway Innovations navigated these challenges with expertise and professionalism, delivering a stunning result that has received countless compliments from our guests.',
      imageUrl: '/images/testimonials/ahmed.jpg',
      rating: 5,
      category: 'Hospitality',
      featured: false,
      order: 4
    },
    {
      id: 'test5',
      author: 'Rachel Kim',
      position: 'Boutique Owner',
      company: 'Elegance Fashion Boutique',
      content: 'Archway Innovations understood exactly what my boutique needed. They created a space that showcases our products beautifully while providing a welcoming environment for customers. Sales have increased significantly since the redesign!',
      imageUrl: '/images/testimonials/rachel.jpg',
      rating: 4,
      category: 'Retail',
      featured: false,
      order: 5
    },
    {
      id: 'test6',
      author: 'Michael Johnson',
      position: 'Restaurant Owner',
      company: 'Fusion Flavors',
      content: 'The team at Archway understood that restaurant design needs to balance aesthetics with functionality. They created an environment that enhances the dining experience while ensuring efficient workflow for staff. It\'s been a game-changer for our business.',
      imageUrl: '/images/testimonials/michael.jpg',
      rating: 5,
      category: 'Hospitality',
      featured: false,
      order: 6
    }
  ],
  ar: [
    {
      id: 'test1',
      author: 'إيميلي طومسون',
      position: 'الرئيس التنفيذي',
      company: 'حلول المكتب الحديث',
      content: 'كان العمل مع آركواي تجربة تحويلية. لقد أعادوا تصور مساحة مكتبنا بالكامل، مما خلق بيئة تلهم الإبداع والتعاون. اهتمامهم بالتفاصيل والتزامهم بفهم احتياجاتنا جعل العملية سلسة.',
      imageUrl: '/images/testimonials/emily.jpg',
      rating: 5,
      category: 'شركات',
      featured: true,
      order: 1
    },
    {
      id: 'test2',
      author: 'جيمس ويلسون',
      position: 'مالك منزل',
      company: 'عميل سكني',
      content: 'لا يمكنني التوصية بآركواي بما فيه الكفاية. لقد أخذوا رؤيتنا لمنزلنا ورفعوها إلى ما هو أبعد مما اعتقدنا أنه ممكن. كان الفريق محترفًا ومتجاوبًا ومتحمسًا حقًا لإنشاء مساحة تعكس أسلوب حياتنا وتفضيلاتنا.',
      imageUrl: '/images/testimonials/james.jpg',
      rating: 5,
      category: 'سكني',
      featured: true,
      order: 2
    },
    {
      id: 'test3',
      author: 'صوفيا مارتينيز',
      position: 'المدير الإبداعي',
      company: 'استوديوهات سبارك للتصميم',
      content: 'كشخص يعمل في المجال الإبداعي، لدي توقعات عالية للتصميم. لم تلبي آركواي هذه التوقعات فحسب، بل تجاوزتها. لقد أنشأوا مساحة استوديو توازن بشكل مثالي بين الجماليات والوظائف، مما يمكّن فريقنا من القيام بأفضل عمل.',
      imageUrl: '/images/testimonials/sofia.jpg',
      rating: 5,
      category: 'إبداعي',
      featured: true,
      order: 3
    },
    {
      id: 'test4',
      author: 'أحمد حسن',
      position: 'المدير الإداري',
      company: 'مجموعة الضيافة الذهبية',
      content: 'كان مشروع تجديد الفندق معقدًا، مع مواعيد نهائية ضيقة ومتطلبات محددة. تعامل فريق آركواي مع هذه التحديات بخبرة واحترافية، مما أدى إلى نتيجة مذهلة تلقت عددًا لا يحصى من المجاملات من ضيوفنا.',
      imageUrl: '/images/testimonials/ahmed.jpg',
      rating: 5,
      category: 'ضيافة',
      featured: false,
      order: 4
    },
    {
      id: 'test5',
      author: 'راشيل كيم',
      position: 'مالكة بوتيك',
      company: 'بوتيك الأناقة للأزياء',
      content: 'فهمت آركواي بالضبط ما كان يحتاجه متجري. لقد أنشأوا مساحة تعرض منتجاتنا بشكل جميل مع توفير بيئة ترحيبية للعملاء. ازدادت المبيعات بشكل كبير منذ إعادة التصميم!',
      imageUrl: '/images/testimonials/rachel.jpg',
      rating: 4,
      category: 'تجزئة',
      featured: false,
      order: 5
    },
    {
      id: 'test6',
      author: 'مايكل جونسون',
      position: 'مالك مطعم',
      company: 'فيوجن فليفورز',
      content: 'فهم فريق آركواي أن تصميم المطعم يحتاج إلى موازنة الجماليات مع الوظائف. لقد أنشأوا بيئة تعزز تجربة تناول الطعام مع ضمان سير العمل بكفاءة للموظفين. لقد كان تغييرًا في قواعد اللعبة لأعمالنا.',
      imageUrl: '/images/testimonials/michael.jpg',
      rating: 5,
      category: 'ضيافة',
      featured: false,
      order: 6
    }
  ]
};

// Add a delay to simulate real-world API latency
const simulateNetworkDelay = () => new Promise(resolve => setTimeout(resolve, 250));

export async function GET(request: Request) {
  // Get the URL and extract parameters
  const { searchParams } = new URL(request.url);
  const locale = searchParams.get('locale') || 'en';
  const category = searchParams.get('category');
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
  let data = locale === 'ar' ? testimonialsData.ar : testimonialsData.en;
  
  // Filter by category if provided
  if (category) {
    data = data.filter(testimonial => testimonial.category === category);
  }
  
  // Filter by featured if requested
  if (featured) {
    data = data.filter(testimonial => testimonial.featured);
  }
  
  // Apply limit if provided
  if (limit && limit > 0 && limit < data.length) {
    data = data.slice(0, limit);
  }
  
  // Collect unique categories for metadata
  const categories = Array.from(new Set(
    (locale === 'ar' ? testimonialsData.ar : testimonialsData.en)
      .map(testimonial => testimonial.category)
  ));
  
  // Return the mock data
  return NextResponse.json({
    success: true,
    data: data,
    meta: {
      total: (locale === 'ar' ? testimonialsData.ar : testimonialsData.en).length,
      categories: categories
    }
  }, { 
    status: 200,
    headers: {
      // Add cache control headers
      'Cache-Control': 'public, max-age=60, s-maxage=300, stale-while-revalidate=600',
    }
  });
} 