'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Service } from '@/lib/hooks/services/types';
import { getServiceImageSrc } from '@/lib/images';

interface ServiceCardImageProps {
  service: Service | null | undefined; // Allow null/undefined service prop
  priority?: boolean;
  isHovering?: boolean; // Add isHovering prop
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
  const [imgSrc, setImgSrc] = React.useState<string | null>(null);
  const [hasError, setHasError] = React.useState(false);
  const tServices = useTranslations('services');

  // Determine the appropriate image source
  React.useEffect(() => {
    try {
      // Get the image source from the service
      const src = getServiceImageSrc(service);
      
      // Process the image URL for frontend display
      let processedUrl = src;
      
      // If URL contains backend:8000, transform for browser context
      if (processedUrl.includes('backend:8000')) {
        // 1. Replace with localhost:8000 for direct access
        processedUrl = processedUrl.replace('backend:8000', 'localhost:8000');
        
        // 2. For media files, use the image proxy
        if (processedUrl.includes('/media/')) {
          // Extract the path portion
          const path = new URL(processedUrl).pathname;
          processedUrl = `/api/image-proxy?path=${encodeURIComponent(path)}`;
        }
      } 
      // If it's a media path from backend
      else if (processedUrl.startsWith('/media/') || processedUrl.startsWith('media/')) {
        // Ensure path starts with a slash
        const path = processedUrl.startsWith('/') ? processedUrl : `/${processedUrl}`;
        processedUrl = `/api/image-proxy?path=${encodeURIComponent(path)}`;
      }
      
      console.log(`ServiceCardImage (${service?.title || 'undefined'}): Original: ${src}, Processed: ${processedUrl}`);
      setImgSrc(processedUrl);
      setHasError(false);
    } catch (error) {
      console.error(`ServiceCardImage: Error processing image:`, error);
      setHasError(true);
    }
  }, [service]);

  // Handle image loading errors from the <img> tag itself
  const handleError = () => {
    console.warn(`ServiceCardImage (${service?.title}): Image failed to load: ${imgSrc}`);
    setHasError(true);
  };
  
  // Common wrapper div with a 3:2 aspect ratio - better for service cards
  const containerClasses = "aspect-w-3 aspect-h-2 overflow-hidden rounded-t-lg relative h-48";
  
  // Placeholder content shown when no image or error
  const placeholderContent = (
    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
      <span className="text-gray-500 text-lg font-medium">
        {service?.title ? service.title.charAt(0).toUpperCase() : '?'}
      </span>
    </div>
  );

  return (
    <div className={containerClasses}>
      {(!hasError && imgSrc && !imgSrc.includes('placeholder.jpg')) ? (
        <>
          <img
            key={imgSrc} // Helps React detect changes
            src={imgSrc} 
            alt={service?.title || 'Service image'}
            className="w-full h-full object-cover" 
            onError={handleError}
            loading={priority ? "eager" : "lazy"}
          />
          {/* Overlay on hover */}
          {isHovering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white transition-opacity duration-200">
              <span className="px-4 py-2 bg-brand-blue rounded">{tServices('viewDetails')}</span>
            </div>
          )}
        </>
      ) : placeholderContent}
    </div>
  );
};

export default ServiceCardImage; 