import React, { useEffect } from 'react';
import { GetStaticPaths, GetStaticProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useServiceDetail, Service, fixImageUrl } from '@/hooks/useServices';
import Link from 'next/link';
import OptimizedImage from '@/components/common/OptimizedImage';
import axios from 'axios';

// Smart detection of environment to handle both browser and container contexts
const getApiBaseUrl = () => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  // Get the configured API URL (from environment variables)
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (configuredUrl) {
    // If we're in a browser and the URL contains 'backend', replace with 'localhost'
    if (isBrowser && configuredUrl.includes('backend')) {
      return configuredUrl.replace('backend', 'localhost');
    }
    return configuredUrl;
  }
  
  // Default fallback - use backend for server-side, localhost for client-side
  return isBrowser 
    ? 'http://localhost:8000/api/v1' 
    : 'http://backend:8000/api/v1';
};

interface ServiceDetailPageProps {
  initialService?: Service;
}

const ServiceDetailPage: NextPage<ServiceDetailPageProps> = ({ initialService }) => {
  const router = useRouter();
  const { t } = useTranslation('common');
  const isRtl = router.locale === 'ar';
  const { slug } = router.query;
  
  // Use the hook to fetch service details with caching
  const { service, loading, error } = useServiceDetail(
    typeof slug === 'string' ? slug : undefined
  );
  
  // Fallback for handling direct access to the page
  useEffect(() => {
    // If we have an error and we're mounting the component, this might be a direct access case
    if (error && typeof window !== 'undefined') {
      console.error('Error fetching service details:', error);
    }
  }, [error]);
  
  // Show loading state while page is being generated or data is being fetched
  if ((router.isFallback || loading) && !service && !initialService) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
        <span className="ml-3">{t('services.loading')}</span>
      </div>
    );
  }
  
  // Show error state
  if (error && !service && !initialService) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button 
          onClick={() => router.reload()} 
          className="px-4 py-2 bg-brand-blue text-white rounded"
        >
          {t('common.tryAgain')}
        </button>
      </div>
    );
  }
  
  // Use either the fetched service or the initial service from SSG
  const serviceData = service || initialService;
  
  // If somehow we still don't have data, show a not found message
  if (!serviceData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">{t('services.serviceNotFound')}</h1>
        <Link 
          href="/services" 
          className="px-4 py-2 bg-brand-blue text-white rounded"
        >
          {t('services.backToServices')}
        </Link>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{serviceData.title} | Archway</title>
        <meta name="description" content={serviceData.short_description || serviceData.description.substring(0, 160)} />
      </Head>
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-brand-blue text-white py-16 md:py-24">
          <div className="container-custom">
            <div className={`${isRtl ? 'rtl text-right' : ''}`}>
              <Link href="/services" className="inline-flex items-center text-blue-100 hover:text-white mb-6">
                {isRtl ? (
                  <>
                    {t('services.backToServices')} <span className="mr-2">→</span>
                  </>
                ) : (
                  <>
                    <span className="mr-2">←</span> {t('services.backToServices')}
                  </>
                )}
              </Link>
              
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                {serviceData.title}
              </h1>
              
              {serviceData.category && (
                <div className="flex items-center mb-6">
                  <span className="bg-blue-800 px-3 py-1 rounded-full text-sm">
                    {serviceData.category.name}
                  </span>
                  
                  {serviceData.price && (
                    <span className="bg-blue-900 px-3 py-1 rounded-full text-sm ml-3">
                      {serviceData.price} {serviceData.price_unit || ''}
                    </span>
                  )}
                  
                  {serviceData.duration && (
                    <span className="bg-blue-900 px-3 py-1 rounded-full text-sm ml-3">
                      {serviceData.duration}
                    </span>
                  )}
                </div>
              )}
              
              <p className="text-xl text-blue-100 max-w-3xl">
                {serviceData.short_description || ''}
              </p>
            </div>
          </div>
        </section>
        
        {/* Main Content */}
        <section className="py-16">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Left Column - Service Description */}
              <div className={`lg:col-span-2 ${isRtl ? 'rtl text-right' : ''}`}>
                {serviceData.image_url && (
                  <div className="relative h-96 w-full mb-8 rounded-lg overflow-hidden">
                    <OptimizedImage
                      src={fixImageUrl(serviceData.image_url || serviceData.image || '')}
                      alt={serviceData.title}
                      fill
                      priority={true}
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 66vw"
                    />
                  </div>
                )}
                
                <div className="prose max-w-none">
                  <div 
                    dangerouslySetInnerHTML={{ __html: serviceData.description.replace(/\n/g, '<br />') }} 
                  />
                </div>
                
                {/* Service Features Section */}
                {serviceData.features && serviceData.features.length > 0 && (
                  <div className="mt-12">
                    <h2 className="text-2xl font-bold mb-6">{t('services.featuresTitle')}</h2>
                    <ul className="space-y-4">
                      {serviceData.features.map((feature: any) => (
                        <li key={feature.id} className="flex items-start">
                          <span className={`text-brand-blue-light mt-1 ${isRtl ? 'ml-3' : 'mr-3'}`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              {feature.is_included ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                              )}
                            </svg>
                          </span>
                          <div>
                            <h3 className="font-semibold">{feature.name}</h3>
                            {feature.description && (
                              <p className="text-gray-600">{feature.description}</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Right Column - Call to Action */}
              <div className={`lg:col-span-1 ${isRtl ? 'rtl text-right' : ''}`}>
                <div className="bg-gray-50 p-6 rounded-lg sticky top-6">
                  <h2 className="text-xl font-bold mb-4">{t('services.interestedTitle')}</h2>
                  <p className="text-gray-600 mb-6">{t('services.interestedDescription')}</p>
                  
                  <Link 
                    href={`/contact?service=${serviceData.slug}`}
                    className="w-full block text-center py-3 px-4 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark transition-colors"
                  >
                    {t('services.contactUs')}
                  </Link>
                  
                  <div className="mt-8 border-t pt-6">
                    <h3 className="font-semibold mb-3">{t('services.moreServices')}</h3>
                    <ul className="space-y-3">
                      <li>
                        <Link href="/services" className="text-brand-blue-light hover:underline">
                          {t('services.viewAllServices')}
                        </Link>
                      </li>
                      {serviceData.category && (
                        <li>
                          <Link 
                            href={`/services?category=${serviceData.category.slug}`} 
                            className="text-brand-blue-light hover:underline"
                          >
                            {t('services.viewCategoryServices', { category: serviceData.category.name })}
                          </Link>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-brand-light py-16">
          <div className="container-custom text-center">
            <h2 className={`text-3xl md:text-4xl font-heading font-bold mb-6 ${isRtl ? 'rtl' : ''}`}>
              {t('services.readyToStart')}
            </h2>
            <p className={`text-gray-600 mb-8 max-w-2xl mx-auto ${isRtl ? 'rtl' : ''}`}>
              {t('services.readyToStartDesc')}
            </p>
            <Link 
              href="/contact" 
              className="btn btn-primary"
            >
              {t('services.getStarted')}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async ({ locales = ['en'] }) => {
  try {
    // Determine API URL based on environment
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000/api/v1';
    
    // Get featured services for initial paths
    const response = await axios.get(`${apiBaseUrl}/services/?is_featured=true`);
    const services = response.data.results || [];
    
    // Generate paths for each locale
    const paths = services.flatMap((service: Service) => 
      locales.map(locale => ({
        params: { slug: service.slug },
        locale
      }))
    );
    
    return {
      paths,
      fallback: true, // Generate non-featured service pages on demand
    };
  } catch (error) {
    console.error('Error generating service paths:', error);
    return {
      paths: [],
      fallback: true,
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params, locale = 'en' }) => {
  try {
    if (!params?.slug) {
      return {
        notFound: true
      };
    }
    
    // Determine API URL based on environment
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000/api/v1';
    
    // Fetch service data
    const paramSlug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    const urlParams = new URLSearchParams();
    urlParams.append('lang', locale);
    
    const response = await axios.get(`${apiBaseUrl}/services/${paramSlug}/?${urlParams.toString()}`);
    const service = response.data;
    
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        initialService: service,
      },
      revalidate: 60, // Re-generate page every 60 seconds if requested
    };
  } catch (error) {
    console.error('Error fetching service data:', error);
    return {
      notFound: true,
    };
  }
};

export default ServiceDetailPage; 