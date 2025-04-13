import React, { useState, useCallback, useEffect } from 'react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useServices, Service, useServiceCategories, ServiceCategory } from '@/hooks';
import ServiceCard from '@/components/services/card/ServiceCard';
import Link from 'next/link';
import axios from 'axios';
import { useQueryClient } from 'react-query';
import { dehydrate, QueryClient } from 'react-query';

// Global preload cache to keep track of which services have been preloaded
const preloadedServices = typeof window !== 'undefined' ? new Set<string>() : new Set();

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

interface ServicesPageProps {
  initialServices?: Service[];
  initialCategories?: ServiceCategory[];
}

const ServicesPage: NextPage<ServicesPageProps> = ({ 
  initialServices = [],
  initialCategories = []
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isRtl = router.locale === 'ar';
  const queryClient = useQueryClient();
  
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    router.query.category as string | undefined
  );
  
  // Use the hooks to fetch data with caching
  const { services, loading, error, fetchNextPage, hasNextPage } = useServices(
    { category: selectedCategory },
    initialServices
  );
  
  const { categories } = useServiceCategories(initialCategories);
  
  // Update filter when URL changes
  useEffect(() => {
    if (router.query.category) {
      setSelectedCategory(router.query.category as string);
    } else {
      setSelectedCategory(undefined);
    }
  }, [router.query.category]);
  
  // Handle category selection
  const handleCategoryChange = (slug: string | undefined) => {
    const newQuery = { ...router.query };
    
    if (slug) {
      newQuery.category = slug;
    } else {
      delete newQuery.category;
    }
    
    router.push({
      pathname: router.pathname,
      query: newQuery
    }, undefined, { scroll: false });
  };
  
  // Handle load more services
  const handleLoadMore = useCallback(() => {
    if (!loading && hasNextPage) {
      fetchNextPage();
    }
  }, [loading, hasNextPage, fetchNextPage]);
  
  return (
    <>
      <Head>
        <title>{t('services.pageTitle')} | Archway</title>
        <meta name="description" content={t('services.pageDescription')} />
      </Head>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-brand-blue text-white py-16 md:py-24">
          <div className="container-custom">
            <div className={`text-center ${isRtl ? 'rtl' : ''}`}>
              <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
                {t('services.heroTitle')}
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                {t('services.heroSubtitle')}
              </p>
            </div>
          </div>
        </section>
        
        {/* Categories Filter */}
        <section className="py-8 bg-gray-50">
          <div className="container-custom">
            <div className={`flex flex-wrap gap-4 justify-center ${isRtl ? 'rtl' : ''}`}>
              <button
                onClick={() => handleCategoryChange(undefined)}
                className={`px-4 py-2 rounded-full ${
                  !selectedCategory
                    ? 'bg-brand-blue text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                } transition-colors shadow-sm`}
              >
                {t('services.allServices')}
              </button>
              
              {Array.isArray(categories) && categories.length > 0 ? (
                categories.map((category: ServiceCategory) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryChange(category.slug)}
                    className={`px-4 py-2 rounded-full ${
                      selectedCategory === category.slug
                        ? 'bg-brand-blue text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100'
                    } transition-colors shadow-sm`}
                  >
                    {category.name}
                  </button>
                ))
              ) : null}
            </div>
          </div>
        </section>
        
        {/* Services Listing */}
        <section className="py-16">
          <div className="container-custom">
            {loading && services.length === 0 ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
                <span className="ml-3">{t('services.loading')}</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-500 mb-4">{error}</p>
                <button 
                  onClick={() => router.reload()} 
                  className="btn btn-primary"
                >
                  {t('common.tryAgain')}
                </button>
              </div>
            ) : services.length === 0 ? (
              <div className="text-center py-12">
                <h3 className="text-xl font-semibold mb-4">{t('services.noServices')}</h3>
                <p className="text-gray-600">{t('services.tryDifferentCategory')}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {Array.isArray(services) && services.map((service, index) => (
                    <div key={service.id}>
                      <ServiceCard
                        service={service} 
                        priority={index < 6}
                      />
                    </div>
                  ))}
                </div>
                
                {hasNextPage && (
                  <div className="text-center mt-12">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="btn btn-primary"
                    >
                      {loading ? t('common.loading') : t('services.loadMore')}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="bg-brand-light py-16">
          <div className="container-custom text-center">
            <h2 className={`text-3xl md:text-4xl font-heading font-bold mb-6 ${isRtl ? 'rtl' : ''}`}>
              {t('services.ctaTitle')}
            </h2>
            <p className={`text-gray-600 mb-8 max-w-2xl mx-auto ${isRtl ? 'rtl' : ''}`}>
              {t('services.ctaSubtitle')}
            </p>
            <Link href="/contact" className="btn btn-primary">
              {t('services.contactUs')}
            </Link>
          </div>
        </section>
      </div>
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  try {
    // Create a new QueryClient instance for server-side
    const queryClient = new QueryClient();
    
    // Determine API URL based on environment
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000/api/v1';
    
    // Setup params for localization
    const params = new URLSearchParams();
    params.append('lang', locale || 'en');
    
    // Prefetch services, categories, and footer data in parallel
    await Promise.all([
      // Prefetch featured services
      queryClient.prefetchQuery(['services', { featured: true }, locale], async () => {
        const servicesResponse = await axios.get(`${apiBaseUrl}/services/?${params.toString()}&is_featured=true`);
        return servicesResponse.data;
      }),
      
      // Prefetch service categories
      queryClient.prefetchQuery(['serviceCategories', locale], async () => {
        const categoriesResponse = await axios.get(`${apiBaseUrl}/service-categories/?${params.toString()}`);
        return categoriesResponse.data;
      }),
      
      // Prefetch footer data
      queryClient.prefetchQuery(['footer', locale], async () => {
        const footerResponse = await axios.get(`${apiBaseUrl}/footer/?${params.toString()}`);
        return footerResponse.data;
      })
    ]);
    
    // Extract the prefetched data for direct use in the component
    const servicesData = queryClient.getQueryData(['services', { featured: true }, locale]) as any;
    const categoriesData = queryClient.getQueryData(['serviceCategories', locale]) as any;
    
    // Ensure we extract results from data and provide fallbacks if data structure is unexpected
    const initialServices = Array.isArray(servicesData?.results) 
      ? servicesData.results 
      : Array.isArray(servicesData) 
        ? servicesData 
        : [];
        
    const initialCategories = Array.isArray(categoriesData?.results) 
      ? categoriesData.results 
      : Array.isArray(categoriesData) 
        ? categoriesData 
        : [];
    
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        initialServices,
        initialCategories,
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: 60, // Re-generate page every 60 seconds if requested
    };
  } catch (error) {
    console.error('Error fetching initial services data:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        initialServices: [],
        initialCategories: [],
        dehydratedState: dehydrate(new QueryClient()),
      },
      revalidate: 60,
    };
  }
}

export default ServicesPage; 