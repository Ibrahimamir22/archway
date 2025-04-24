'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Service } from '@/lib/hooks/services/types';
import DirectServiceImage from '../common/DirectServiceImage';
import ServiceIcon from '../icons/ServiceIcon';

interface ServiceDetailClientProps {
  service: Service;
  className?: string;
  locale?: string;
}

/**
 * Client component for service detail with interactive elements
 */
const ServiceDetailClient: React.FC<ServiceDetailClientProps> = ({
  service,
  className = '',
  locale: propLocale
}) => {
  const params = useParams();
  const locale = propLocale || (params?.locale ? String(params.locale) : 'en');
  const isRtl = locale === 'ar';
  
  const t = useTranslations();
  const tServices = useTranslations('services');
  
  // Get translated title or fall back to original
  const getServiceTitle = () => {
    try {
      return t(`serviceTypes.${service.slug}`, { default: service.title });
    } catch (e) {
      return service.title;
    }
  };
  
  // Get translated description or fall back to original
  const getServiceDescription = () => {
    try {
      return t(`serviceTypes.descriptions.${service.slug}`, { 
        default: service.description || tServices('noDescription') 
      });
    } catch (e) {
      return service.description || tServices('noDescription');
    }
  };
  
  // Get image src with fallbacks
  const getImageSrc = () => {
    if (service.image_url) {
      return service.image_url;
    }
    
    if (service.image) {
      return service.image;
    }
    
    return '/images/placeholder-service.jpg';
  };

  return (
    <article className={`bg-white rounded-lg shadow-lg overflow-hidden ${className}`}>
      {/* Hero image */}
      <div className="relative h-[300px] md:h-[400px]">
        <DirectServiceImage
          src={getImageSrc()}
          alt={getServiceTitle()}
          className="object-cover w-full h-full"
          priority={true}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 flex items-end">
          <div className="p-6 w-full">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-white/20 backdrop-blur-sm p-2 rounded-full">
                <ServiceIcon 
                  iconName={service.icon} 
                  categorySlug={service.category?.slug}
                  className="w-8 h-8 text-white"
                />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-white">{getServiceTitle()}</h1>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content */}
      <div className={`p-6 ${isRtl ? 'rtl' : ''}`}>
        <div className="prose max-w-none dark:prose-invert">
          <p className="text-lg text-gray-700 leading-relaxed mb-8">{getServiceDescription()}</p>
          
          {service.features && service.features.length > 0 && (
            <>
              <h2 className="text-xl font-semibold mb-4">{tServices('featuresTitle')}</h2>
              <ul className="space-y-2">
                {service.features.map((feature: any, index: number) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-brand-blue flex-shrink-0 mr-2 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{typeof feature === 'object' ? feature.name : feature}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
          
          {/* CTA Section */}
          <div className="mt-10 bg-brand-blue-light/10 p-6 rounded-lg border border-brand-blue-light/20">
            <h3 className="text-xl font-semibold mb-2">{tServices('interestedTitle')}</h3>
            <p className="mb-4">{tServices('interestedDescription')}</p>
            <a
              href={`/${locale}/contact`}
              className="inline-block px-6 py-3 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark transition-colors"
            >
              {tServices('contactUs')}
            </a>
          </div>
        </div>
      </div>
    </article>
  );
};

export default ServiceDetailClient; 