'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Service } from '@/lib/hooks/services/types';
import OptimizedImage from '@/components/common/OptimizedImage';
import { getServiceImageSrc } from '@/lib/images';

interface ServiceCardImageProps {
  service: Service | null | undefined;
  priority?: boolean;
  isHovering?: boolean;
}

/**
 * Image component specialized for service cards
 * Handles image loading and errors by attempting to display the image
 * or rendering a placeholder div if loading fails.
 */
const ServiceCardImage: React.FC<ServiceCardImageProps> = ({ 
  service, 
  priority = false,
  isHovering = false
}) => {
  const [hasError, setHasError] = React.useState(false);
  const tServices = useTranslations('services');

  // Determine the appropriate image source
  const getImageSrc = () => {
    if (!service) return '/images/placeholder-service.jpg';

    // Get raw image URL from service object
    let originalUrl = "";
    
    if (service.image_url) {
      originalUrl = service.image_url;
    } else if (service.image) {
      originalUrl = service.image;
    } else if (service.cover_image_url) {
      originalUrl = service.cover_image_url;
    } else if (service.cover_image) {
      originalUrl = service.cover_image;
    } else {
      // No image found, use placeholder
      return '/images/placeholder-service.jpg';
    }

    // For Django media files, always use our image proxy
    if (
      originalUrl.includes('/media/') || 
      originalUrl.includes('backend:8000') || 
      originalUrl.includes('localhost:8000')
    ) {
      // Extract the media path
      let mediaPath = "";
      
      if (originalUrl.includes('/media/')) {
        // Extract everything after '/media/'
        const parts = originalUrl.split('/media/');
        if (parts.length > 1) {
          mediaPath = '/media/' + parts[1];
        } else {
          mediaPath = '/media/' + originalUrl;
        }
      } else {
        // If no /media/ in URL, use the full path
        mediaPath = originalUrl;
      }
      
      // Use the image proxy API
      return `/api/image-proxy?path=${encodeURIComponent(mediaPath)}`;
    } else if (originalUrl.startsWith('http')) {
      // Direct external URLs can be used as-is
      return originalUrl;
    } else {
      // Local asset path (starting with '/' or not)
      return originalUrl.startsWith('/') ? originalUrl : `/${originalUrl}`;
    }
  };

  // Handle image loading errors
  const handleError = () => {
    console.warn(`ServiceCardImage (${service?.title}): Image failed to load`);
    setHasError(true);
  };
  
  // Container styles
  const containerClasses = "aspect-w-3 aspect-h-2 overflow-hidden rounded-t-lg relative h-48";
  
  // Placeholder content
  const placeholderContent = (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <span className="text-gray-500 text-lg font-medium">
        {service?.title ? service.title.charAt(0).toUpperCase() : '?'}
      </span>
    </div>
  );

  return (
    <div className={containerClasses}>
      {hasError ? (
        placeholderContent
      ) : (
        <>
          <OptimizedImage
            src={getImageSrc()}
            alt={service?.title || 'Service image'}
            fill={true}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onError={handleError}
            priority={priority}
          />
          {/* Overlay on hover */}
          {isHovering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white transition-opacity duration-200">
              <span className="px-4 py-2 bg-brand-blue rounded">{tServices('viewDetails')}</span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ServiceCardImage; 