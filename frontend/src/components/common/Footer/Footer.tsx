'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useFooter } from '@/lib/hooks/footer/useFooter';
import type { FooterSection as FooterSectionType } from '@/lib/hooks/footer/useFooter';

// Import components from the same directory
import FooterSection from './FooterSection';
import CompanyInfo from './CompanyInfo';
import ContactInfo from './ContactInfo';
import NewsletterForm from './NewsletterForm';

// Skeleton component for loading state
const FooterSkeleton = ({ isRtl = false }) => (
  <div className="container mx-auto px-4 animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Skeleton for Company Info / Social Links */}
      <div className="footer-column mb-8">
        <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-700 rounded w-5/6 mb-5"></div>
        <div className="flex space-x-3 mt-4">
          <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
          <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
          <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
        </div>
      </div>
      
      {/* Skeleton for a dynamic section */}
      <div className="footer-column mb-8">
        <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
        <ul className="space-y-2">
          <li className="h-4 bg-gray-700 rounded w-3/4"></li>
          <li className="h-4 bg-gray-700 rounded w-5/6"></li>
          <li className="h-4 bg-gray-700 rounded w-1/2"></li>
        </ul>
      </div>
      
      {/* Skeleton for Contact Info */}
      <div className="footer-column mb-8">
        <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
        <ul className="space-y-3">
          <li className="flex items-center">
            <div className={`w-5 h-5 bg-gray-700 rounded-full ${isRtl ? 'ml-3' : 'mr-3'}`}></div>
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
          </li>
          <li className="flex items-center">
            <div className={`w-5 h-5 bg-gray-700 rounded-full ${isRtl ? 'ml-3' : 'mr-3'}`}></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </li>
          <li className="flex items-start">
            <div className={`w-5 h-5 bg-gray-700 rounded-full ${isRtl ? 'ml-3' : 'mr-3'} mt-1`}></div>
            <div className="h-4 bg-gray-700 rounded w-full"></div>
          </li>
        </ul>
      </div>
      
      {/* Skeleton for Newsletter */}
      <div className="footer-column mb-8">
        <div className="h-6 bg-gray-700 rounded w-1/2 mb-4"></div>
        <div className="h-12 bg-gray-800 rounded-lg"></div>
      </div>
    </div>
    <div className="border-t border-gray-700 mt-8 pt-6 text-center">
      <div className="h-4 bg-gray-700 rounded w-1/3 mx-auto"></div>
    </div>
  </div>
);

export interface FooterProps {
  // Add props if needed in the future
}

// Add this helper function for Google Maps URL
const getGoogleMapsUrl = (address: string) => {
  const encodedAddress = encodeURIComponent(address);
  return `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
};

// Structured data for the organization (Schema.org)
const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  'name': 'Archway Innovations',
  'url': 'https://archwayeg.com',
  'logo': 'https://archwayeg.com/images/logo.png',
  'contactPoint': {
    '@type': 'ContactPoint',
    'telephone': '+201150000183',
    'contactType': 'customer service',
    'email': 'info@archwayeg.com',
    'areaServed': 'EG',
    'availableLanguage': ['English', 'Arabic']
  },
  'address': {
    '@type': 'PostalAddress',
    'streetAddress': 'VILLA 65, Ground floor, Near El Banafseg 5',
    'addressLocality': 'New Cairo',
    'addressRegion': 'Cairo',
    'addressCountry': 'Egypt'
  },
  'sameAs': [
    'https://facebook.com/archway.egypt/',
    'https://instagram.com/archway.egypt',
    'https://linkedin.com/company/archway-innovations'
  ]
};

const Footer = (props: FooterProps): JSX.Element => {
  const t = useTranslations('footer');
  const commonT = useTranslations('common');
  
  const params = useParams();
  const locale = params?.locale ? String(params.locale) : 'en';
  const isRtl = locale === 'ar';
  
  // Fetch footer data using the hook
  const { 
    footerData, 
    loading: footerLoading, 
    error,
    refetch
  } = useFooter();
  
  // For debugging raw Django response
  console.log("Django raw footer data:", footerData);
  console.log("Current locale:", locale);

  // Get the name from the Django Admin or from translations
  const archwayName = t('companyInfo.name');
  const archwayDescription = t('companyInfo.description');
  
  // Get the correct company info with better fallbacks
  let actualCompanyName = footerData?.company_name || "";
  let actualDescription = footerData?.description || "";
  
  // If company name is empty but locale is known, supply from translations
  if (!actualCompanyName) {
    console.log("Supplying company name from translations");
    actualCompanyName = archwayName;
  }
  
  // If description is empty, supply from translations
  if (!actualDescription) {
    console.log("Supplying description from translations");
    actualDescription = archwayDescription;
  }
  
  // Show Skeleton loader while loading
  if (footerLoading) {
    return (
      <footer className="bg-gray-900 text-white pt-12 pb-6" role="contentinfo" aria-label="Site footer">
        {/* Skip to content link (invisible but accessible to screen readers) */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-blue-700 focus:text-white focus:z-50">
          Skip to main content
        </a>
        
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(structuredData)
          }}
        />
        
        <FooterSkeleton isRtl={isRtl} />
      </footer>
    );
  }
  
  if (error) {
    console.error('Error loading footer:', error);
    
    // We still have footerData with fallbacks, so we can continue to render the component
    // The notice about the error will be displayed to the user
  }
  
  // If we have no data at all (which should be rare with our new fallback logic), show a minimal footer
  if (!footerData) {
    // Use fallback data from translations
    const year = new Date().getFullYear();
    const fallbackCopyright = t('copyright').replace(/\d{4}/g, year.toString());
    
    return (
      <footer className="bg-gray-900 text-white pt-12 pb-6" role="contentinfo" aria-label="Site footer">
        {/* Skip to content link (invisible but accessible to screen readers) */}
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-blue-700 focus:text-white focus:z-50">
          Skip to main content
        </a>
        
        <script 
          type="application/ld+json"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(structuredData)
          }}
        />
        
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="footer-column mb-8">
              <h3 className="text-lg font-semibold mb-4">{t('companyInfo.name')}</h3>
              <p className="text-gray-400 mb-4">{t('companyInfo.description')}</p>
            </div>
            
            <div className="footer-column mb-8">
              <h3 className="text-lg font-semibold mb-4">{t('sections.company.title')}</h3>
              <ul className="space-y-2">
                <li><a href="/about" className="text-gray-400 hover:text-white transition-colors">{t('sections.company.links.about_us')}</a></li>
                <li><a href="/services" className="text-gray-400 hover:text-white transition-colors">{t('sections.company.links.services')}</a></li>
                <li><a href="/portfolio" className="text-gray-400 hover:text-white transition-colors">{t('sections.company.links.portfolio')}</a></li>
              </ul>
            </div>
            
            <div className="footer-column mb-8">
              <h3 className="text-lg font-semibold mb-4">{t('sections.resources.title')}</h3>
              <ul className="space-y-2">
                <li><a href="/blog" className="text-gray-400 hover:text-white transition-colors">{t('sections.resources.links.blog')}</a></li>
                <li><a href="/faq" className="text-gray-400 hover:text-white transition-colors">{t('sections.resources.links.faq')}</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white transition-colors">{t('sections.resources.links.contact')}</a></li>
              </ul>
            </div>
            
            <div className="footer-column mb-8">
              <h3 className="text-lg font-semibold mb-4">{t('contactUs')}</h3>
              <ul className="space-y-2">
                <li className="flex items-center text-gray-400">
                  <span className="mr-2">📧</span>
                  <a href="mailto:info@archwayeg.com" className="hover:text-white transition-colors">{t('email')}</a>
                </li>
                <li className="flex items-center text-gray-400">
                  <span className="mr-2">📞</span>
                  <a href="tel:+201150000183" className="hover:text-white transition-colors">{t('phone')}</a>
                </li>
                <li className="flex items-start text-gray-400">
                  <span className="mr-2 mt-1">📍</span>
                  <span>{t('address')}</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-400">
            <p>{fallbackCopyright}</p>
          </div>
        </div>
      </footer>
    );
  }
  
  // Extract data from footerData with safety checks
  const socialLinks = Array.isArray(footerData?.social_links) ? footerData.social_links : [];
  const sections = Array.isArray(footerData?.sections) ? footerData.sections : [];
  const copyrightText = footerData?.copyright_text || '';
  const showNewsletter = footerData?.show_newsletter !== false;
  
  // CRITICAL FIX: Always use translations directly from the locale files, not from API
  // This ensures proper localization regardless of API data
  const newsletterText = t('newsletter.description');
  const contactTitle = t('contactUs');
  const newsletterLabel = t('newsletter.title');
  
  // Add debugging logs for newsletter values
  console.log('Newsletter values (fixed):', {
    locale,
    isRtl,
    newsletterText, 
    newsletterLabel,
    directTranslations: {
      description: t('newsletter.description'),
      title: t('newsletter.title')
    }
  });
  
  // Check if we have contact info to show
  const hasContactInfo = footerData?.contact_info && footerData.contact_info.length > 0;
  
  // Create default contact info if none provided
  const contactInfo = hasContactInfo ? footerData.contact_info : [
    { id: 'email', type: 'email', value: t('email'), icon: 'email' },
    { id: 'phone', type: 'phone', value: t('phone'), icon: 'phone' },
    { id: 'address', type: 'address', value: t('address'), icon: 'location' }
  ];
  
  // Always show contact section
  const shouldShowContact = true;
  
  // Get current year for dynamic copyright
  const currentYear = new Date().getFullYear();
  // Replace any year in the copyright text with current year
  const formattedCopyright = copyrightText 
    ? copyrightText.replace(/\d{4}/g, currentYear.toString()) 
    : t('copyright').replace(/\d{4}/g, currentYear.toString());
  
  // Filter out invalid sections
  const validSections = sections.filter(
    section => section && 
    typeof section.title === 'string' &&
    section.title.trim() !== '' &&
    Array.isArray(section.links) && 
    section.links.length > 0
  );
  
  // If we don't have any valid sections from the API, create default sections from translations
  const finalSections = validSections.length > 0 ? validSections : [
    {
      id: 'company',
      title: t('sections.company.title'),
      links: [
        { id: 'about', text: t('sections.company.links.about_us'), url: '/about', open_in_new_tab: false },
        { id: 'services', text: t('sections.company.links.services'), url: '/services', open_in_new_tab: false },
        { id: 'portfolio', text: t('sections.company.links.portfolio'), url: '/portfolio', open_in_new_tab: false }
      ]
    },
    {
      id: 'resources',
      title: t('sections.resources.title'),
      links: [
        { id: 'blog', text: t('sections.resources.links.blog'), url: '/blog', open_in_new_tab: false },
        { id: 'faq', text: t('sections.resources.links.faq'), url: '/faq', open_in_new_tab: false },
        { id: 'contact', text: t('sections.resources.links.contact'), url: '/contact', open_in_new_tab: false }
      ]
    }
  ];

  // CRITICAL FIX: Always use direct translations for hardcoded section titles
  // Replace API-loaded section titles with direct translations
  finalSections.forEach(section => {
    if (section.id === 'company') {
      section.title = t('sections.company.title');
      
      // Also update link texts for this section
      section.links.forEach(link => {
        if (link.id === 'about') link.text = t('sections.company.links.about_us');
        if (link.id === 'services') link.text = t('sections.company.links.services');
        if (link.id === 'portfolio') link.text = t('sections.company.links.portfolio');
      });
    }
    else if (section.id === 'resources') {
      section.title = t('sections.resources.title');
      
      // Also update link texts for this section
      section.links.forEach(link => {
        if (link.id === 'blog') link.text = t('sections.resources.links.blog');
        if (link.id === 'faq') link.text = t('sections.resources.links.faq');
        if (link.id === 'contact') link.text = t('sections.resources.links.contact');
      });
    }
  });
                        
  // Calculate the grid columns based on available sections + newsletter + contact info
  const hasCompanyInfo = Boolean(footerData?.company_info || footerData?.company_name || actualCompanyName);
  const totalItems = (hasCompanyInfo ? 1 : 0) + 
                     finalSections.length + 
                     (shouldShowContact ? 1 : 0) +
                     (showNewsletter ? 1 : 0);
                        
  // Set column layout based on number of sections
  let gridClass = '';
  if (totalItems <= 1) {
    gridClass = 'grid-cols-1';
  } else if (totalItems === 2) {
    gridClass = 'grid-cols-1 md:grid-cols-2 gap-8';
  } else if (totalItems === 3) {
    gridClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8';
  } else {
    gridClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8';
  }

  // Force a 4-column grid if we have all the sections we need
  if (hasCompanyInfo && finalSections.length === 2 && shouldShowContact && showNewsletter) {
    gridClass = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8';
  }
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6" role="contentinfo" aria-label="Site footer">
      {/* Skip to content link (invisible but accessible to screen readers) */}
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:p-4 focus:bg-blue-700 focus:text-white focus:z-50">
        Skip to main content
      </a>
      
      <script 
        type="application/ld+json"
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(structuredData)
        }}
      />
      
      <div className={`container mx-auto px-4 md:px-6`}>
        {error && (
          <div className="text-center mb-6">
            <span className="text-xs text-red-400 opacity-75 inline-flex items-center bg-red-900 bg-opacity-10 rounded-full px-3 py-1">
              {typeof error === 'string' ? error : 'Error loading footer data'} 
              <button 
                onClick={refetch}
                className="ml-2 text-blue-400 hover:text-blue-300 focus:outline-none"
                aria-label="Try again"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </span>
          </div>
        )}
        
        {totalItems > 0 && (
          <div className={`grid ${gridClass} gap-x-8 gap-y-10`}>
            {/* Company Info - Now checking for company_info presence as well */}
            {hasCompanyInfo && (
              <div className={`footer-column mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
                <CompanyInfo 
                  settings={footerData} 
                  socialMedia={socialLinks} 
                  isRtl={isRtl} 
                  fallbackName={actualCompanyName}
                  fallbackDescription={actualDescription}
                />
              </div>
            )}
            
            {/* Dynamic sections from database or fallbacks */}
            {finalSections.map((section: FooterSectionType) => (
              <div key={section.id} className={`footer-column mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
                <FooterSection 
                  section={section} 
                  isRtl={isRtl} 
                />
              </div>
            ))}
            
            {/* Contact Info - always show with fallbacks if needed */}
            {shouldShowContact && (
              <div className={`footer-column mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
                <ContactInfo 
                  settings={{
                    ...footerData,
                    contact_info: contactInfo
                  }} 
                  isRtl={isRtl} 
                  title={contactTitle}
                />
              </div>
            )}
            
            {/* Newsletter Form */}
            {showNewsletter && (
              <div className={`footer-column mb-8 ${isRtl ? 'text-right' : 'text-left'}`}>
                <NewsletterForm 
                  isRtl={isRtl}
                  newsletterText={newsletterText} 
                  newsletterLabel={newsletterLabel}
                />
              </div>
            )}
          </div>
        )}

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-10 pt-8 text-center text-gray-400">
          <p dangerouslySetInnerHTML={{ 
            __html: t('copyright').replace(/\d{4}/g, currentYear.toString())
          }} />
          
          {/* Bottom links - use direct translations instead of API data */}
          <div className="mt-4 text-sm" style={{ 
            display: 'flex', 
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem',
            direction: isRtl ? 'rtl' : 'ltr'
          }}>
            <a href="/terms" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:underline">
              {t('termsOfService')}
            </a>
            <a href="/privacy" className="text-gray-400 hover:text-white transition-colors focus:outline-none focus:underline">
              {t('privacyPolicy')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 