import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';

// Project data with translations
const projectData = {
  en: [
    {
      title: "Minimalist Apartment",
      description: "A clean, modern design that maximizes space and light.",
      slug: "minimalist-apartment",
      image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1974&auto=format&fit=crop"
    },
    {
      title: "Gourmet Kitchen Remodel",
      description: "A chef's dream kitchen with premium finishes and smart appliances.",
      slug: "gourmet-kitchen",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1932&auto=format&fit=crop"
    },
    {
      title: "Creative Agency Office",
      description: "A versatile workspace designed to foster creativity and collaboration.",
      slug: "creative-agency-office",
      image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1974&auto=format&fit=crop"
    }
  ],
  ar: [
    {
      title: "شقة بتصميم بسيط",
      description: "تصميم نظيف وعصري يعظم المساحة والضوء.",
      slug: "minimalist-apartment",
      image: "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1974&auto=format&fit=crop"
    },
    {
      title: "تجديد مطبخ فاخر",
      description: "مطبخ فاخر مع تشطيبات متميزة وأجهزة ذكية.",
      slug: "gourmet-kitchen",
      image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1932&auto=format&fit=crop"
    },
    {
      title: "مكتب لوكالة إبداعية",
      description: "مساحة عمل متعددة الاستخدامات مصممة لتعزيز الإبداع والتعاون.",
      slug: "creative-agency-office",
      image: "https://images.unsplash.com/photo-1600210492493-0946911123ea?q=80&w=1974&auto=format&fit=crop"
    }
  ]
};

export default function Home() {
  const router = useRouter();
  const { locale } = router;
  const { t } = useTranslation('common');
  const isRtl = locale === 'ar';

  // Get projects based on current locale
  const projects = locale === 'ar' ? projectData.ar : projectData.en;

  return (
    <>
      <Head>
        <title>Archway Interior Design | Professional Interior Design in Egypt</title>
        <meta name="description" content="Archway offers premium interior design services for residential and commercial spaces in Egypt. 3D visualization, personalized consultations, and more." />
      </Head>
    
      <div>
        {/* Hero Section */}
        <section className="bg-brand-light py-16 md:py-24">
          <div className="container-custom">
            <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
              <div className="animate-fade-in">
                <h1 className={`text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-brand-dark mb-6 ${isRtl ? 'text-right' : ''}`}>
                  {t('home.heroTitle')} <span className="text-brand-blue-light">{t('home.heroSubtitle')}</span>
                </h1>
                <p className={`text-lg text-gray-600 mb-8 ${isRtl ? 'text-right' : ''}`}>
                  Archway Design brings your interior vision to life with exceptional design, 3D visualization, and personalized consultations.
                </p>
                <div className={`flex flex-wrap gap-4 ${isRtl ? 'justify-end' : ''}`}>
                  <Link href="/portfolio" className="btn btn-primary">
                    {t('home.ctaButton')}
                  </Link>
                  <Link href="/contact" className="btn btn-secondary">
                    {t('contact.title')}
                  </Link>
                </div>
              </div>
              <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden shadow-xl animate-fade-in">
                <Image 
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2400&auto=format&fit=crop"
                  alt="Modern interior design" 
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 md:py-24" id="services">
          <div className="container-custom">
            <div className={`text-center mb-16 ${isRtl ? 'rtl' : ''}`}>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{t('home.servicesTitle')}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t('home.servicesSubtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Service Cards */}
              <div className={`bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow ${isRtl ? 'text-right' : ''}`}>
                <div className={`w-16 h-16 bg-brand-blue-light/10 rounded-full flex items-center justify-center mb-6 ${isRtl ? 'ms-auto' : ''}`}>
                  <svg className="w-8 h-8 text-brand-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">{t('home.residentialTitle')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('home.residentialDesc')}
                </p>
                <Link href="/services#residential" className={`text-brand-blue-light font-medium hover:underline ${isRtl ? 'block text-right' : ''}`}>
                  {t('home.learnMore')} {isRtl ? '←' : '→'}
                </Link>
              </div>
              
              <div className={`bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow ${isRtl ? 'text-right' : ''}`}>
                <div className={`w-16 h-16 bg-brand-blue-light/10 rounded-full flex items-center justify-center mb-6 ${isRtl ? 'ms-auto' : ''}`}>
                  <svg className="w-8 h-8 text-brand-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">{t('home.commercialTitle')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('home.commercialDesc')}
                </p>
                <Link href="/services#commercial" className={`text-brand-blue-light font-medium hover:underline ${isRtl ? 'block text-right' : ''}`}>
                  {t('home.learnMore')} {isRtl ? '←' : '→'}
                </Link>
              </div>
              
              <div className={`bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow ${isRtl ? 'text-right' : ''}`}>
                <div className={`w-16 h-16 bg-brand-blue-light/10 rounded-full flex items-center justify-center mb-6 ${isRtl ? 'ms-auto' : ''}`}>
                  <svg className="w-8 h-8 text-brand-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">{t('home.visualizationTitle')}</h3>
                <p className="text-gray-600 mb-4">
                  {t('home.visualizationDesc')}
                </p>
                <Link href="/services#visualization" className={`text-brand-blue-light font-medium hover:underline ${isRtl ? 'block text-right' : ''}`}>
                  {t('home.learnMore')} {isRtl ? '←' : '→'}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Projects */}
        <section className="bg-brand-light py-16 md:py-24">
          <div className="container-custom">
            <div className={`text-center mb-16 ${isRtl ? 'rtl' : ''}`}>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{t('home.projectsTitle')}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t('home.projectsSubtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Project cards */}
              {projects.map((project, index) => (
                <div key={index} className="group overflow-hidden rounded-lg shadow-md bg-white">
                  <div className="relative h-64 overflow-hidden">
                    <Image 
                      src={project.image}
                      alt={project.title} 
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className={`p-6 ${isRtl ? 'text-right' : ''}`}>
                    <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                    <p className="text-gray-600 mb-4">{project.description}</p>
                    <Link href={`/portfolio/${project.slug}`} className={`text-brand-blue-light font-medium hover:underline ${isRtl ? 'block text-right' : ''}`}>
                      {t('home.viewProject')} {isRtl ? '←' : '→'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/portfolio" className="btn btn-primary">
                {t('home.viewAllProjects')}
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-brand-blue-light py-16 md:py-20">
          <div className="container-custom text-center">
            <h2 className={`text-3xl md:text-4xl font-heading font-bold text-white mb-6 ${isRtl ? 'rtl' : ''}`}>{t('home.ctaSectionTitle')}</h2>
            <p className={`text-blue-100 mb-8 max-w-2xl mx-auto ${isRtl ? 'rtl' : ''}`}>
              {t('home.ctaSectionSubtitle')}
            </p>
            <Link href="/contact" className="btn bg-white text-brand-blue hover:bg-blue-50">
              {t('home.getStarted')}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 