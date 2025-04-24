'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { Service } from '@/lib/hooks/services/types';

interface ServiceCardContentProps {
  service: Service;
  locale: string;
}

/**
 * Service card content section with title, description, and link
 */
const ServiceCardContent: React.FC<ServiceCardContentProps> = ({ 
  service,
  locale
}) => {
  const isRtl = locale === 'ar';
  const t = useTranslations('services');
  
  // Get service details with fallbacks
  const title = service.title || t('untitledService', {default: 'Untitled Service'});
  const description = service.description || t('noDescription', {default: 'No description available'});
  
  // Truncate description to avoid very long card descriptions
  const truncateDescription = (text: string, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };
  
  // Debug output for service slug
  React.useEffect(() => {
    console.log(`ServiceCardContent - Slug info:`, {
      title: service.title,
      slug: service.slug,
      url: `/${locale}/services/${service.slug}`
    });
  }, [service, locale]);
  
  return (
    <div className={`p-6 flex flex-col h-48 ${isRtl ? 'rtl text-right' : ''}`}>
      <h3 className={`text-xl font-semibold mb-2 ${isRtl ? 'font-cairo' : 'font-playfair'}`}>
        {title}
      </h3>
      
      <p className="text-gray-600 mb-4 line-clamp-3 flex-grow">
        {truncateDescription(description)}
      </p>
      
      <div className="flex items-center mt-auto">
        {service.category && (
          <span className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
            {service.category.name}
          </span>
        )}
        
        <div className="flex-grow"></div>
        
        <Link 
          href={`/${locale}/services/${service.slug}`}
          className="text-brand-blue hover:text-brand-blue-dark font-medium inline-flex items-center"
        >
          {isRtl ? (
            <>
              {t('viewDetails')} <span className="ms-1">←</span>
            </>
          ) : (
            <>
              {t('viewDetails')} <span className="ms-1">→</span>
            </>
          )}
        </Link>
      </div>
    </div>
  );
};

export default ServiceCardContent;
