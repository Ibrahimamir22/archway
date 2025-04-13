import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useProjects, Project } from '../hooks';
import { useServices, Service } from '../hooks';
import PlaceholderProjects from '../components/portfolio/PlaceholderProjects';
import axios from 'axios';
import OptimizedImage from '../components/common/OptimizedImage/index';
import { GetStaticProps } from 'next';
import { dehydrate, QueryClient } from 'react-query';

// Define fallback project interface
interface FallbackProject {
  title: string;
  description: string;
  slug: string;
  image: string;
  id?: string;
}

// Smart detection of environment to handle both browser and container contexts
const getApiBaseUrl = () => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  // Get the configured API URLs (from environment variables)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  if (apiUrl) {
    // When in browser, use the NEXT_PUBLIC_API_URL directly
    // This should point to localhost:8000 for browser access
    return apiUrl;
  }
  
  // Default fallback - use appropriate URL based on environment
  return isBrowser 
    ? 'http://localhost:8000/api/v1' 
    : 'http://backend:8000/api/v1';
};

interface HomeProps {
  initialProjects: Project[];
  initialServices: Service[];
}

export default function Home({ initialProjects = [], initialServices = [] }: HomeProps) {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isRtl = router.locale === 'ar';
  
  // Get translated project title
  const getProjectTitle = (project: Project) => {
    return t(`projects.${project.slug}`, { defaultValue: project.title });
  };
  
  // Get translated project description
  const getProjectDescription = (project: Project) => {
    return t(`descriptions.${project.slug}`, { defaultValue: project.description });
  };
  
  // Get translated service title
  const getServiceTitle = (service: Service) => {
    return t(`serviceTypes.${service.slug}`, { defaultValue: service.title });
  };
  
  // Get translated service description
  const getServiceDescription = (service: Service) => {
    return t(`serviceTypes.descriptions.${service.slug}`, { defaultValue: service.short_description || service.description });
  };
  
  // Fetch projects data
  const { projects, loading, error } = useProjects(
    { featured: true, limit: 3 },
    initialProjects
  );
  
  // Fetch services data
  const { services } = useServices(
    { featured: true, limit: 3 },
    initialServices
  );
  
  // Function to get image URL for projects considering different field names
  const getImageSrc = (project: Project): string => {
    if ('cover_image_url' in project && project.cover_image_url) {
      return project.cover_image_url;
    }
    
    if ('cover_image' in project && project.cover_image) {
      return project.cover_image;
    }
    
    if ('image_url' in project && project.image_url && typeof project.image_url === 'string') {
      return project.image_url;
    }
    
    return '/images/placeholder.jpg';
  };
  
  // Function to get appropriate icon for services
  const getServiceIcon = (service: Service): JSX.Element => {
    const iconMap: { [key: string]: JSX.Element } = {
      home: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
      ),
      building: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
      ),
      image: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
      ),
      consultation: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
      ),
      default: (
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
      )
    };
    
    if (service.icon && iconMap[service.icon]) {
      return iconMap[service.icon];
    }
    
    return iconMap.default;
  };

  return (
    <>
      <Head>
        <title>{t('home.metaTitle')}</title>
        <meta name="description" content={t('home.metaDescription')} />
      </Head>

      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="hero-section bg-brand-blue text-white py-20 md:py-32 relative">
          <div className="container-custom relative z-10">
            <div className={`text-center max-w-3xl mx-auto ${isRtl ? 'rtl' : ''}`}>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">
                {t('home.heroTitle')}
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                {t('home.heroSubtitle')}
              </p>
              <div className="space-x-4 rtl:space-x-reverse">
                <Link href="/portfolio" className="btn btn-primary">
                  {t('home.explorePortfolio')}
                </Link>
                <Link href="/contact" className="btn btn-outline-white">
                  {t('home.contactUs')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 md:py-24">
          <div className="container-custom">
            <div className={`text-center mb-16 ${isRtl ? 'rtl' : ''}`}>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{t('home.aboutTitle')}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t('home.aboutSubtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature Cards */}
              <div className={`bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow ${isRtl ? 'text-right' : ''}`}>
                <div className={`w-16 h-16 bg-brand-blue-light/10 rounded-full flex items-center justify-center mb-6 ${isRtl ? 'ms-auto' : ''}`}>
                  <svg className="w-8 h-8 text-brand-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">{t('home.customizationTitle')}</h3>
                <p className="text-gray-600">
                  {t('home.customizationDesc')}
                </p>
              </div>
              
              <div className={`bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow ${isRtl ? 'text-right' : ''}`}>
                <div className={`w-16 h-16 bg-brand-blue-light/10 rounded-full flex items-center justify-center mb-6 ${isRtl ? 'ms-auto' : ''}`}>
                  <svg className="w-8 h-8 text-brand-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">{t('home.qualityTitle')}</h3>
                <p className="text-gray-600">
                  {t('home.qualityDesc')}
                </p>
              </div>
              
              <div className={`bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow ${isRtl ? 'text-right' : ''}`}>
                <div className={`w-16 h-16 bg-brand-blue-light/10 rounded-full flex items-center justify-center mb-6 ${isRtl ? 'ms-auto' : ''}`}>
                  <svg className="w-8 h-8 text-brand-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">{t('home.efficiencyTitle')}</h3>
                <p className="text-gray-600">
                  {t('home.efficiencyDesc')}
                </p>
              </div>
              
              <div className={`bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow ${isRtl ? 'text-right' : ''}`}>
                <div className={`w-16 h-16 bg-brand-blue-light/10 rounded-full flex items-center justify-center mb-6 ${isRtl ? 'ms-auto' : ''}`}>
                  <svg className="w-8 h-8 text-brand-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3">{t('home.timelyTitle')}</h3>
                <p className="text-gray-600">
                  {t('home.timelyDesc')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="bg-gray-50 py-16 md:py-24">
          <div className="container-custom">
            <div className={`text-center mb-16 ${isRtl ? 'rtl' : ''}`}>
              <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{t('home.servicesTitle')}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                {t('home.servicesSubtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Service Cards */}
              {services.map((service, index) => (
                <div key={service.id || `service-${index}`} className={`bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden ${isRtl ? 'text-right' : ''}`}>
                  {/* Service Image */}
                  <Link href={`/services/${service.slug}`}>
                    <div className="relative h-48 w-full">
                      <OptimizedImage
                        src={service.cover_image_url || service.image_url || `/images/service-placeholder.jpg`}
                        alt={getServiceTitle(service)}
                        fill
                        priority={index < 3}
                        className="object-cover transition-transform duration-500 hover:scale-105"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </Link>
                  
                  <div className="p-6">
                    <div className={`w-12 h-12 bg-brand-blue-light/10 rounded-full flex items-center justify-center mb-4 ${isRtl ? 'ms-auto' : ''}`}>
                      <svg className="w-6 h-6 text-brand-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        {getServiceIcon(service)}
                      </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-3">{getServiceTitle(service)}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {getServiceDescription(service)}
                    </p>
                    <Link href={`/services/${service.slug}`} className={`text-brand-blue-light font-medium hover:underline ${isRtl ? 'block text-right' : ''}`}>
                      {t('home.learnMore')} {isRtl ? '←' : '→'}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/services" className="btn btn-primary">
                {t('home.viewAllServices')}
              </Link>
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
            
            {loading ? (
              // Show skeleton loaders while loading
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array(3).fill(0).map((_, index) => (
                  <div key={`skeleton-${index}`} className="rounded-lg shadow-md bg-white animate-pulse">
                    <div className="relative h-64 bg-gray-200"></div>
                    <div className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              // Show error state
              <div className="text-center py-8">
                <p className="text-red-500">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-4 px-4 py-2 bg-brand-blue-light text-white rounded"
                >
                  {t('common.tryAgain')}
                </button>
              </div>
            ) : projects.length === 0 ? (
              // Show placeholder projects when no real projects exist
              <PlaceholderProjects count={3} />
            ) : (
              // Show real projects
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, index) => (
                  <div key={project.id || `project-${index}`} className="group overflow-hidden rounded-lg shadow-md bg-white">
                    <div className="relative h-64 overflow-hidden">
                      <OptimizedImage 
                        src={getImageSrc(project)}
                        alt={getProjectTitle(project)} 
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        priority={index < 3}
                      />
                    </div>
                    <div className={`p-6 ${isRtl ? 'text-right' : ''}`}>
                      <h3 className="text-xl font-bold mb-2">{getProjectTitle(project)}</h3>
                      <p className="text-gray-600 mb-4">{getProjectDescription(project)}</p>
                      <Link href={`/portfolio/${project.slug}`} className={`text-brand-blue-light font-medium hover:underline ${isRtl ? 'block text-right' : ''}`}>
                        {t('home.viewProject')} {isRtl ? '←' : '→'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
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

export const getStaticProps: GetStaticProps = async ({ locale = 'en' }) => {
  try {
    // Create a new QueryClient instance for server-side
    const queryClient = new QueryClient();
    
    // Determine API URL based on environment
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000/api/v1';
    
    // Setup params for localization
    const params = new URLSearchParams();
    params.append('lang', locale);
    
    // Prefetch projects, services, and footer data in parallel
    await Promise.all([
      // Prefetch featured projects
      queryClient.prefetchQuery(['projects', { featured: true }, locale], async () => {
        const projectsResponse = await axios.get(
          `${apiBaseUrl}/projects/?${params.toString()}&is_featured=true&limit=6`
        );
        return projectsResponse.data;
      }),
      
      // Prefetch featured services
      queryClient.prefetchQuery(['services', { featured: true }, locale], async () => {
        const servicesResponse = await axios.get(
          `${apiBaseUrl}/services/?${params.toString()}&is_featured=true&limit=6`
        );
        return servicesResponse.data;
      }),
      
      // Prefetch footer data
      queryClient.prefetchQuery(['footer', locale], async () => {
        const footerResponse = await axios.get(
          `${apiBaseUrl}/footer/?${params.toString()}`
        );
        return footerResponse.data;
      })
    ]);
    
    // Extract the prefetched data for direct use in the component
    const projectsData = queryClient.getQueryData(['projects', { featured: true }, locale]) as any;
    const servicesData = queryClient.getQueryData(['services', { featured: true }, locale]) as any;
    
    const initialProjects = projectsData?.results || [];
    const initialServices = servicesData?.results || [];
    
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        initialProjects,
        initialServices,
        dehydratedState: dehydrate(queryClient),
      },
      revalidate: 60, // Re-generate page every 60 seconds if requested
    };
  } catch (error) {
    console.error('Error fetching initial data:', error);
    return {
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
        initialProjects: [],
        initialServices: [],
      },
      revalidate: 60,
    };
  }
};