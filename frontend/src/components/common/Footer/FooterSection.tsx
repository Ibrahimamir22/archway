'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import type { FooterSection as FooterSectionType } from '@/lib/hooks/footer/useFooter';
import { PrefetchLink } from '../PrefetchLink';

interface FooterLink {
  id: string | number;
  text: string;
  url: string;
  open_in_new_tab?: boolean;
}

export interface FooterSectionProps {
  section: FooterSectionType & { id?: string | number; title?: string };
  isRtl: boolean;
}

const FooterSection = ({ section, isRtl }: FooterSectionProps): JSX.Element => {
  const t = useTranslations('footer');
  
  // Ensure section has valid data
  if (!section || !section.title === undefined) {
    console.warn('FooterSection received invalid section data:', section);
    return <></>;
  }
  
  // Find translation keys based on section ID or content
  let sectionId = '';
  if (section.id === 'company' || (section.links && section.links.some(link => 
      link.url?.includes('/about') || link.url?.includes('/services') || link.url?.includes('/portfolio')))) {
    sectionId = 'company';
  } else if (section.id === 'resources' || (section.links && section.links.some(link => 
      link.url?.includes('/blog') || link.url?.includes('/faq') || link.url?.includes('/contact')))) {
    sectionId = 'resources';
  }

  // Log information for debugging
  console.log('Rendering FooterSection:', {
    sectionId,
    originalTitle: section.title,
    translatedTitle: sectionId ? t(`sections.${sectionId}.title`) : null
  });
  
  // CRITICAL FIX: Always use direct translations for section titles
  // Determine the section title from translations based on section ID
  let sectionTitle;
  if (sectionId === 'company') {
    sectionTitle = t('sections.company.title');
  } else if (sectionId === 'resources') {
    sectionTitle = t('sections.resources.title');
  } else {
    // Fallback to the provided title
    sectionTitle = section.title;
  }
  
  // Make sure links are properly formatted
  const links = Array.isArray(section.links) 
    ? section.links.filter(link => link && typeof link.url === 'string')
    : [];
  
  // Map translation keys for common links
  const linkTranslations: Record<string, string> = {
    '/about': 'sections.company.links.about_us',
    '/services': 'sections.company.links.services',
    '/portfolio': 'sections.company.links.portfolio',
    '/blog': 'sections.resources.links.blog',
    '/faq': 'sections.resources.links.faq',
    '/contact': 'sections.resources.links.contact'
  };
  
  // Map API prefetch paths for data-driven pages
  const prefetchDataPaths: Record<string, string> = {
    '/portfolio': '/api/portfolio',
    '/services': '/api/services',
    '/faq': '/api/faqs'
  };
  
  // Map API query keys for data prefetching
  const queryKeys: Record<string, string[]> = {
    '/portfolio': ['portfolio', 'list'],
    '/services': ['services', 'list'],
    '/faq': ['faqs', 'list'] 
  };
  
  // If no valid links, don't render the section
  if (links.length === 0) {
    console.warn('Section has no valid links:', sectionTitle);
    return <></>;
  }
  
  return (
    <div className="footer-section" style={{ textAlign: isRtl ? 'right' : 'left' }}>
      <h3 className="text-lg font-semibold mb-4">{sectionTitle}</h3>
      <ul className="space-y-2">
        {links.map((link) => {
          // CRITICAL FIX: Always use direct translations for link texts when possible
          let linkText = link.text;
          
          // Determine if this is a standard link with a translation
          if (linkTranslations[link.url]) {
            linkText = t(linkTranslations[link.url]);
          }
          
          // Fallback to the original link text if no translation is found
          if (!linkText) {
            linkText = link.url;
          }
          
          // Determine if this link should prefetch data
          const shouldPrefetchData = Object.keys(prefetchDataPaths).some(path => link.url.includes(path));
          const prefetchPath = Object.keys(prefetchDataPaths).find(path => link.url.includes(path));
          const prefetchType = shouldPrefetchData && !link.open_in_new_tab ? 'data' : 'route';
          
          return (
            <li key={link.id}>
              <PrefetchLink 
                href={link.url} 
                className="text-gray-400 hover:text-white transition duration-300"
                target={link.open_in_new_tab ? '_blank' : '_self'}
                rel={link.open_in_new_tab ? 'noopener noreferrer' : ''}
                prefetchType={prefetchType}
                dataPrefetchPath={prefetchPath ? prefetchDataPaths[prefetchPath] : undefined}
                queryKey={prefetchPath ? queryKeys[prefetchPath] : undefined}
                prefetchDelay={100}
              >
                {linkText}
              </PrefetchLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default FooterSection; 