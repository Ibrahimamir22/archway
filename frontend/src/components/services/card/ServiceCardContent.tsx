import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import ServiceLink from '../common/ServiceLink';
import ServiceIcon from '../icons/ServiceIcon';
import { Service } from '@/@types/services';

interface ServiceCardContentProps {
  service: Service;
  onClick?: () => void;
}

/**
 * Content section of the service card with title, description, and details
 */
const ServiceCardContent: React.FC<ServiceCardContentProps> = ({
  service,
  onClick
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isRtl = router.locale === 'ar';
  
  return (
    <div className="p-4">
      <div className="flex justify-between items-start mb-3">
        {/* Icon */}
        <div className={`w-12 h-12 bg-brand-blue-light/10 rounded-full flex items-center justify-center ${isRtl ? 'order-2' : 'order-1'}`}>
          <ServiceIcon 
            iconName={service.icon}
            categorySlug={service.category?.slug}
            className="w-6 h-6 text-brand-blue-light"
          />
        </div>
        
        {/* Title and Category */}
        <div className={`${isRtl ? 'text-right order-1 flex-1 mr-3' : 'order-2 flex-1 ml-3'}`}>
          <ServiceLink 
            slug={service.slug}
            className="text-xl font-semibold text-gray-900 hover:text-brand-blue"
            onClick={onClick}
          >
            {service.title}
          </ServiceLink>
          
          {service.category && (
            <p className="text-sm text-gray-500 mt-1">{service.category.name}</p>
          )}
        </div>
      </div>
      
      {/* Description */}
      <p className={`text-gray-600 mt-2 line-clamp-3 ${isRtl ? 'text-right' : ''}`}>
        {service.short_description || service.description}
      </p>
      
      {/* Metadata: Price and Duration */}
      {(service.price || service.duration) && (
        <div className={`flex flex-wrap gap-2 mt-4 ${isRtl ? 'justify-end' : ''}`}>
          {service.price && (
            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {service.price} {service.price_unit || ''}
            </span>
          )}
          {service.duration && (
            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
              {service.duration}
            </span>
          )}
        </div>
      )}
      
      {/* Learn More Link */}
      <div className={`mt-4 ${isRtl ? 'text-right' : ''}`}>
        <ServiceLink 
          slug={service.slug}
          className="text-brand-blue-light font-medium hover:underline inline-flex items-center"
          onClick={onClick}
        >
          {isRtl ? (
            <>
              {t('services.learnMore')} <span className="ms-1">←</span>
            </>
          ) : (
            <>
              {t('services.learnMore')} <span className="ms-1">→</span>
            </>
          )}
        </ServiceLink>
      </div>
    </div>
  );
};

export default ServiceCardContent; 