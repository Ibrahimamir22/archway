'use client';

import React, { useState, useEffect } from 'react';

interface ServiceImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * Optimized image component for service images
 * Handles URL normalization and fallbacks consistently
 */
const ServiceImage: React.FC<ServiceImageProps> = ({ 
  src, 
  alt, 
  className = 'w-full h-full object-cover',
  priority = false,
  onLoad,
  onError
}) => {
  const [imageSrc, setImageSrc] = useState<string>('/images/service-placeholder.jpg');
  const [hasError, setHasError] = useState(false);
  
  // Process the image URL for proper display
  useEffect(() => {
    if (!src) {
      setImageSrc('/images/service-placeholder.jpg');
      return;
    }
    
    try {
      const originalUrl = src;
      console.log(`Service image original URL: ${originalUrl}`);
      
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
        const proxyUrl = `/api/image-proxy?path=${encodeURIComponent(mediaPath)}`;
        console.log(`Using image proxy: ${proxyUrl}`);
        setImageSrc(proxyUrl);
      } else if (originalUrl.startsWith('http')) {
        // Direct external URLs can be used as-is
        setImageSrc(originalUrl);
      } else {
        // Local asset path (starting with '/' or not)
        const localPath = originalUrl.startsWith('/') ? originalUrl : `/${originalUrl}`;
        setImageSrc(localPath);
      }
      
      setHasError(false);
    } catch (error) {
      console.error('Error processing image URL:', error);
      setImageSrc('/images/service-placeholder.jpg');
      setHasError(true);
      onError?.();
    }
  }, [src, onError]);
  
  // Handle loading errors
  const handleError = () => {
    console.warn('Image failed to load:', imageSrc);
    setHasError(true);
    setImageSrc('/images/service-placeholder.jpg');
    onError?.();
  };
  
  // Handle successful loading
  const handleLoad = () => {
    console.log('Image loaded successfully:', imageSrc);
    onLoad?.();
  };
  
  return (
    <img
      src={hasError ? '/images/service-placeholder.jpg' : imageSrc}
      alt={alt}
      className={className}
      onError={handleError}
      onLoad={handleLoad}
      loading={priority ? "eager" : "lazy"}
    />
  );
};

export default ServiceImage; 