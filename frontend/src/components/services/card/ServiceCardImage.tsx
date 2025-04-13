import React, { useState } from 'react';
import ServiceImage from '../common/ServiceImage';
import { useTranslation } from 'next-i18next';
import ServiceLink from '../common/ServiceLink';
import { getServiceImageSrc } from '@/utils/services';
import { Service } from '@/@types/services';

interface ServiceCardImageProps {
  service: Service;
  priority?: boolean;
  onClick?: () => void;
}

/**
 * Image section of the service card with hover effect
 */
const ServiceCardImage: React.FC<ServiceCardImageProps> = ({
  service,
  priority = false,
  onClick
}) => {
  const { t } = useTranslation('common');
  const [isHovering, setIsHovering] = useState(false);
  
  const handleMouseEnter = () => {
    setIsHovering(true);
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
  return (
    <div 
      className="relative h-48 w-full overflow-hidden"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ServiceLink 
        slug={service.slug}
        onClick={onClick}
      >
        <ServiceImage 
          src={getServiceImageSrc(service)}
          alt={service.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          priority={priority}
        />
        
        {isHovering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
            <span className="px-4 py-2 bg-brand-blue rounded">{t('services.viewDetails')}</span>
          </div>
        )}
      </ServiceLink>
    </div>
  );
};

export default ServiceCardImage; 