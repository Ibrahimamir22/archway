'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import { createMultiSectionPrefetcher } from '@/lib/utils/prefetch';
import { useAboutData } from '@/lib/hooks/marketing/about';
import { LoadingState } from '@/components/ui/LoadingState';
import { ErrorMessage } from '@/components/ui/ErrorMessage';

interface AboutClientProps {
  locale: string;
  messages: Record<string, string>;
}

export default function AboutClient({ locale, messages }: AboutClientProps) {
  const isRtl = locale === 'ar';
  const [activeSection, setActiveSection] = useState('');
  
  // Fetch about page data from the API
  const { data, isLoading, error, isFallback, tryAgain } = useAboutData(locale, {
    // Use django backend in production, fallback to mock API if needed
    useMockData: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true'
  });
  
  // Process data to ensure image URLs are correct
  const processedData = useMemo(() => {
    if (!data) return null;
    
    // Make a deep copy of the data
    const processed = JSON.parse(JSON.stringify(data));
    
    // Fix team member image URLs
    if (processed.team_members) {
      processed.team_members = processed.team_members.map(member => {
        // If the image_url is a relative path, make it absolute using the API browser URL
        if (member.image_url && !member.image_url.startsWith('http')) {
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_BROWSER_URL || 'http://localhost:8000/api/v1';
          const baseUrl = apiBaseUrl.replace(/\/api\/v1\/?$/, '');
          member.image_url = `${baseUrl}${member.image_url}`;
        }
        return member;
      });
    }
    
    // Fix client logo image URLs
    if (processed.client_logos) {
      processed.client_logos = processed.client_logos.map(logo => {
        // If the logo_url is a relative path, make it absolute using the API browser URL
        if (logo.logo_url && !logo.logo_url.startsWith('http')) {
          const apiBaseUrl = process.env.NEXT_PUBLIC_API_BROWSER_URL || 'http://localhost:8000/api/v1';
          const baseUrl = apiBaseUrl.replace(/\/api\/v1\/?$/, '');
          logo.logo_url = `${baseUrl}${logo.logo_url}`;
        }
        return logo;
      });
    }
    
    return processed;
  }, [data]);
  
  // Debug output for API data
  useEffect(() => {
    if (data) {
      console.log('About page data received:', data);
      console.log('Team members:', data.team_members);
      console.log('Client logos:', data.client_logos);
      
      if (data.team_members && data.team_members.length > 0) {
        console.log('Sample team member:', data.team_members[0]);
      }
      
      // Check for image URLs in team members
      if (data.team_members) {
        const teamWithImages = data.team_members.filter(tm => tm.image || tm.image_url);
        console.log(`Team members with images: ${teamWithImages.length}/${data.team_members.length}`);
      }
    }
    
    if (processedData) {
      console.log('Processed data with fixed URLs:', processedData);
    }
  }, [data, processedData]);
  
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
  
  // Helper function to get translation
  const t = (key: string): string => {
    return messages[key] || key;
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingState message={t('loading')} />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ErrorMessage 
          message={t('errorLoading')} 
          details={error.message}
          retry={tryAgain}
        />
      </div>
    );
  }

  // Show fallback banner if using mock data
  const FallbackBanner = () => (
    isFallback ? (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              {t('usingFallbackData')}
              <button 
                onClick={tryAgain}
                className="ml-2 font-medium text-yellow-700 underline"
              >
                {t('tryAgain')}
              </button>
            </p>
          </div>
        </div>
      </div>
    ) : null
  );
  
  // If we have data, render the page
  return (
    <div className="relative container mx-auto px-4 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Fallback notification if needed */}
        <FallbackBanner />
        
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
          <CoreValues 
            t={t} 
            isRtl={isRtl} 
            locale={locale}
            values={processedData?.core_values || data?.core_values} 
          />
        </section>
        
        {/* Company Stats */}
        <section id="stats">
          <StatsSection 
            t={t} 
            isRtl={isRtl} 
            locale={locale}
            stats={processedData?.statistics || data?.statistics}
          />
        </section>
        
        {/* Client Logos - Featured Only */}
        <section id="clients">
          <ClientLogosSection 
            t={t} 
            isRtl={isRtl} 
            locale={locale} 
            featuredOnly={true}
            logos={processedData?.client_logos || data?.client_logos}
          />
        </section>
        
        {/* Company History Timeline */}
        <section id="history">
          <CompanyHistory 
            t={t} 
            isRtl={isRtl} 
            locale={locale}
            history={processedData?.company_history}
          />
        </section>
        
        {/* Team Section */}
        <section id="team">
          <TeamSection 
            t={t} 
            isRtl={isRtl} 
            locale={locale}
            teamMembers={processedData?.team_members || data?.team_members}
            sectionTitle={processedData?.main_content?.team_section_title || data?.main_content?.team_section_title}
          />
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials">
          <Testimonials 
            t={t}
            isRtl={isRtl}
            locale={locale}
            testimonials={processedData?.testimonials}
            sectionTitle={processedData?.main_content?.testimonials_section_title || data?.main_content?.testimonials_section_title}
            className="bg-gray-50" 
            featuredOnly={true} 
            maxCount={3}
          />
        </section>
        
        {/* FAQ Section Teaser */}
        <FAQTeaser t={t} isRtl={isRtl} locale={locale} />
      </div>
    </div>
  );
} 