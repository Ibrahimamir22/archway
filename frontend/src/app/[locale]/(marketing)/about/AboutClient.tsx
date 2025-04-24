'use client';

import React, { useState, useEffect } from 'react';
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

interface AboutClientProps {
  locale: string;
  messages: Record<string, string>;
}

export default function AboutClient({ locale, messages }: AboutClientProps) {
  const isRtl = locale === 'ar';
  const [activeSection, setActiveSection] = useState('');
  
  // Prefetch all section data on initial load
  useEffect(() => {
    const prefetchAllSections = createMultiSectionPrefetcher(locale, [
      'teamMembers',
      'testimonials',
      'companyHistory',
      'companyStats',
      'clientLogos'
    ]);
    
    // Start prefetch in background with low priority
    prefetchAllSections().catch(err => {
      console.warn('Background prefetch error:', err);
    });
  }, [locale]);
  
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
  
  return (
    <div className="relative container mx-auto px-4 py-20">
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
        />
        
        {/* FAQ Section Teaser */}
        <FAQTeaser t={t} isRtl={isRtl} locale={locale} />
      </div>
    </div>
  );
} 