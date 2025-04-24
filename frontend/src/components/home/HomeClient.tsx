'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useProjects } from '@/lib/hooks/portfolio';
import { useServices } from '@/lib/hooks';
import { Project } from '@/lib/hooks/portfolio/types';
import { Service } from '@/lib/hooks/services/types';

import PlaceholderProjects from '@/components/portfolio/list/PlaceholderProjects';
import ServiceCard from '@/components/services/card/ServiceCard';
import DirectProjectImage from '@/components/portfolio/common/DirectProjectImage';

interface HomeClientProps {
  initialProjects: Project[];
  initialServices: Service[];
  locale: string;
}

export default function HomeClient({ 
  initialProjects, 
  initialServices, 
  locale 
}: HomeClientProps) {
  const tHome = useTranslations('home');
  const tRoot = useTranslations();
  const params = useParams();
  const clientLocale = params?.locale ? String(params.locale) : locale;
  const isRtl = clientLocale === 'ar';
  
  // Use the initially loaded data for services
  const servicesToDisplay = initialServices || [];
  
  // Get project title directly from the API
  const getProjectTitle = (project: Project) => {
    return project.title;
  };
  
  // Get project description directly from the API
  const getProjectDescription = (project: Project) => {
    return project.description;
  };
  
  // Fetch projects data
  const { 
    projects = [], 
    loading: projectsLoading, 
    error: projectsError 
  } = useProjects({ 
    featured: true, 
    limit: 3, 
    is_published: true,
    lang: clientLocale
  });
  
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

  // Render projects with consistent structure for both loading and loaded states
  const renderProjects = () => {
    if (projectsLoading) {
      return (
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
      );
    }

    if (projectsError) {
      return (
        <div className="text-center py-8">
          <p className="text-red-500">{projectsError}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-brand-blue-light text-white rounded"
          >
            {tRoot('common.tryAgain')}
          </button>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, index) => (
          <div key={project.id || `project-${index}`} className="group overflow-hidden rounded-lg shadow-md bg-white h-full flex flex-col">
            <Link href={`/${locale}/portfolio/${project.slug}`}>
              <div className="relative h-64 overflow-hidden">
                <DirectProjectImage 
                  src={getImageSrc(project)}
                  alt={getProjectTitle(project)} 
                  className="object-cover transition-transform duration-500 group-hover:scale-110 w-full h-full"
                />
              </div>
            </Link>
            <div className={`p-6 flex-1 flex flex-col ${isRtl ? 'text-right' : ''}`}>
              <h3 className="text-xl font-bold mb-2">{getProjectTitle(project)}</h3>
              <p className="text-gray-600 mb-4 flex-1 overflow-hidden line-clamp-3">{getProjectDescription(project)}</p>
              <Link 
                href={`/${locale}/portfolio/${project.slug}`} 
                className={`text-brand-blue-light font-medium hover:underline mt-auto ${isRtl ? 'block text-right' : ''}`}
              >
                {tHome('viewProject')} {isRtl ? '←' : '→'}
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-section bg-brand-blue text-white py-20 md:py-32 relative">
        <div className="container mx-auto px-4 relative z-10">
          <div className={`text-center max-w-3xl mx-auto ${isRtl ? 'rtl' : ''}`}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6">{tHome('heroTitle')}</h1>
            <p className="text-xl text-blue-100 mb-8">{tHome('heroSubtitle')}</p>
            <div className="space-x-4 rtl:space-x-reverse">
              <Link href={`/${locale}/portfolio`} className="px-6 py-3 bg-brand-accent text-white rounded-md hover:bg-opacity-90 transition-colors">{tHome('explorePortfolio')}</Link>
              <Link href={`/${locale}/contact`} className="px-6 py-3 bg-transparent border border-white text-white rounded-md hover:bg-white hover:bg-opacity-10 transition-colors">{tHome('contactUs')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 ${isRtl ? 'rtl' : ''}`}>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{tHome('aboutTitle')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{tHome('aboutSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature Cards */}
            <div className={`bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow ${isRtl ? 'text-right' : ''}`}>
              <div className={`w-16 h-16 bg-brand-blue-light/10 rounded-full flex items-center justify-center mb-6 ${isRtl ? 'ms-auto' : ''}`}>
                <svg className="w-8 h-8 text-brand-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{tHome('customizationTitle')}</h3>
              <p className="text-gray-600">{tHome('customizationDesc')}</p>
            </div>
            <div className={`bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow ${isRtl ? 'text-right' : ''}`}>
              <div className={`w-16 h-16 bg-brand-blue-light/10 rounded-full flex items-center justify-center mb-6 ${isRtl ? 'ms-auto' : ''}`}>
                <svg className="w-8 h-8 text-brand-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{tHome('qualityTitle')}</h3>
              <p className="text-gray-600">{tHome('qualityDesc')}</p>
            </div>
            <div className={`bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow ${isRtl ? 'text-right' : ''}`}>
              <div className={`w-16 h-16 bg-brand-blue-light/10 rounded-full flex items-center justify-center mb-6 ${isRtl ? 'ms-auto' : ''}`}>
                <svg className="w-8 h-8 text-brand-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{tHome('efficiencyTitle')}</h3>
              <p className="text-gray-600">{tHome('efficiencyDesc')}</p>
            </div>
            <div className={`bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow ${isRtl ? 'text-right' : ''}`}>
              <div className={`w-16 h-16 bg-brand-blue-light/10 rounded-full flex items-center justify-center mb-6 ${isRtl ? 'ms-auto' : ''}`}>
                <svg className="w-8 h-8 text-brand-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              </div>
              <h3 className="text-xl font-bold mb-3">{tHome('timelyTitle')}</h3>
              <p className="text-gray-600">{tHome('timelyDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 ${isRtl ? 'rtl' : ''}`}>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{tHome('servicesTitle')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{tHome('servicesSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesToDisplay.length > 0 ? (
              servicesToDisplay.map((service) => (
                <div key={service.id}>
                  <ServiceCard 
                    key={service.id}
                    service={service}
                    locale={locale} 
                    priority={true}
                  />
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500">
                <p>{tHome('noFeaturedServices')}</p>
              </div>
            )}
          </div>
          <div className="text-center mt-12">
            <Link href={`/${locale}/services`} className="px-6 py-3 bg-brand-blue text-white rounded-md hover:bg-opacity-90 transition-colors">{tHome('viewAllServices')}</Link>
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="bg-brand-light py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className={`text-center mb-16 ${isRtl ? 'rtl' : ''}`}>
            <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">{tHome('projectsTitle')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{tHome('projectsSubtitle')}</p>
          </div>
          {renderProjects()}
          <div className="text-center mt-12">
            <Link
              href={`/${locale}/portfolio`}
              className="px-6 py-3 bg-brand-blue text-white rounded-md hover:bg-opacity-90 transition-colors"
            >{tHome('viewAllProjects')}</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-brand-blue-light py-16 md:py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className={`text-3xl md:text-4xl font-heading font-bold text-white mb-6 ${isRtl ? 'rtl' : ''}`}>{tHome('ctaSectionTitle')}</h2>
          <p className={`text-blue-100 mb-8 max-w-2xl mx-auto ${isRtl ? 'rtl' : ''}`}>{tHome('ctaSectionSubtitle')}</p>
          <Link 
            href={`/${locale}/contact`}
            className="px-6 py-3 bg-white text-brand-blue hover:bg-blue-50 rounded-md transition-colors"
          >{tHome('getStarted')}</Link>
        </div>
      </section>
    </div>
  );
} 