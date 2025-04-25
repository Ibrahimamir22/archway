'use client';

import React, { memo, useMemo, useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useAboutData } from '@/lib/hooks/marketing/about';
import { ErrorMessage, LoadingState } from '@/components/ui';
import { 
  AboutHero, 
  MissionVision, 
  TeamSection, 
  Testimonials,
  CoreValues, 
  FAQTeaser,
  CompanyHistory,
  StatsSection,
  ClientLogosSection,
  AboutNavLinks
} from '@/components/marketing/about';

// Notification banner for fallback data
const FallbackNotification = memo(function FallbackNotification({ 
  onRetry, 
  locale 
}: { 
  onRetry: () => void;
  locale: string;
}) {
  const message = locale === 'ar' 
    ? 'نحن نعرض بيانات احتياطية. انقر لإعادة المحاولة.'
    : 'We are displaying fallback data. Click to retry.';
  
  return (
    <div className="bg-amber-50 border-l-4 border-amber-400 p-4 fixed bottom-4 right-4 z-50 shadow-lg rounded-md max-w-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 rtl:mr-3 rtl:ml-0">
          <p className="text-sm text-amber-700">{message}</p>
          <button 
            onClick={onRetry}
            className="mt-2 text-sm font-medium text-amber-700 hover:text-amber-600 underline focus:outline-none"
          >
            {locale === 'ar' ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      </div>
    </div>
  );
});

// Main OptimizedAboutClient component
export default function OptimizedAboutClient({ locale }: { locale: string }) {
  const isRtl = locale === 'ar';
  const [activeSection, setActiveSection] = useState('');
  
  // Use Next.js Internationalization
  const t = useTranslations('about');
  
  // Use our centralized data hook with hybrid fetching
  const {
    // Combined API data
    combinedData,
    isUsingFallback,
    
    // Individual data objects
    teamMembers,
    testimonials,
    coreValues,
    companyHistory,
    companyStats,
    clientLogos,
    
    // Status
    isLoading,
    error,
    hasData,
    
    // Retry function
    retry
  } = useAboutData(locale);

  // Setup intersection observer to track active section
  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-100px 0px',
      threshold: 0.2
    };
    
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);
    
    // Find and observe all sections
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
      sectionObserver.observe(section);
    });
    
    return () => {
      sectionObserver.disconnect();
    };
  }, []);
  
  // Handle loading state
  if (isLoading) {
    return <LoadingState text={locale === 'ar' ? 'جاري التحميل...' : 'Loading...'} />;
  }
  
  // Handle error state
  if (error && !hasData) {
    return (
      <ErrorMessage 
        message={locale === 'ar' 
          ? 'حدث خطأ أثناء تحميل المحتوى. يرجى المحاولة مرة أخرى لاحقاً.' 
          : 'An error occurred while loading content. Please try again later.'
        }
        onRetry={retry}
        retryText={locale === 'ar' ? 'إعادة المحاولة' : 'Try Again'}
      />
    );
  }
  
  return (
    <div className="relative container mx-auto px-4 py-20">
      {/* Show fallback notification if using fallback data */}
      {isUsingFallback && (
        <FallbackNotification onRetry={retry} locale={locale} />
      )}
      
      <div className="max-w-6xl mx-auto">
        {/* Navigation Links */}
        <div className="sticky top-20 z-10 bg-white/90 dark:bg-gray-900/90 py-3 backdrop-blur-sm rounded-lg mb-8 shadow-sm">
          <AboutNavLinks 
            t={t} 
            locale={locale} 
            isRtl={isRtl} 
            activeSection={activeSection}
            pillStyle={true}
          />
        </div>
        
        {/* Hero Section */}
        <AboutHero t={t} isRtl={isRtl} />
        
        {/* Mission and Vision */}
        <section id="mission">
          <MissionVision t={t} isRtl={isRtl} />
        </section>
        
        {/* Core Values */}
        <section id="values">
          <CoreValues t={t} isRtl={isRtl} locale={locale} />
        </section>
        
        {/* Company Stats */}
        <section id="stats">
          <StatsSection t={t} isRtl={isRtl} locale={locale} />
        </section>
        
        {/* Client Logos - Featured Only */}
        <section id="clients">
          <ClientLogosSection t={t} isRtl={isRtl} locale={locale} featuredOnly={true} />
        </section>
        
        {/* Company History Timeline */}
        <section id="history">
          <CompanyHistory t={t} isRtl={isRtl} locale={locale} />
        </section>
        
        {/* Team Section */}
        <section id="team">
          <TeamSection t={t} isRtl={isRtl} locale={locale} />
        </section>
        
        {/* Testimonials Section */}
        <Testimonials 
          className="bg-gray-50" 
          featuredOnly={true} 
          maxCount={3}
          t={t}
          isRtl={isRtl}
          locale={locale}
        />
        
        {/* FAQ Section Teaser */}
        <FAQTeaser t={t} isRtl={isRtl} locale={locale} />
      </div>
    </div>
  );
} 