'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import type { FooterSection as FooterSectionType } from '@/lib/hooks/footer/useFooter';
import PrefetchLink from '../PrefetchLink';

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
  
  // Log the incoming section data
  console.log('Rendering FooterSection with:', typeof section.title, section);
  
  // Find translation keys based on section properties
  let translationPrefix = '';
  if (section.links && section.links.length > 0) {
    const firstLink = section.links[0];
    if (firstLink && firstLink.url) {
      if (firstLink.url.includes('/about') || firstLink.url.includes('/services') || firstLink.url.includes('/portfolio')) {
        translationPrefix = 'sections.company';
      } else if (firstLink.url.includes('/blog') || firstLink.url.includes('/faq') || firstLink.url.includes('/contact')) {
        translationPrefix = 'sections.resources';
      }
    }
  }
  
  // Make sure section title is a string, with fallback to translation
  const sectionTitle = section.title 
    ? section.title 
    : translationPrefix ? t(`${translationPrefix}.title`) : 'Section';
  
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
          // Get link text from either the link text or from translations
          const linkText = link.text || (linkTranslations[link.url] ? t(linkTranslations[link.url]) : link.url);
          
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