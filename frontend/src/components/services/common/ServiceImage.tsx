import React, { useState, useEffect } from 'react';
import { normalizeServiceImageUrl } from '@/lib/images';

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
  
  // Normalize the image URL for proper display
  useEffect(() => {
    if (!src) {
      setImageSrc('/images/service-placeholder.jpg');
      return;
    }
    
    try {
      const normalized = normalizeServiceImageUrl(src);
      console.log('Normalized image URL:', { original: src, normalized });
      setImageSrc(normalized);
    } catch (error) {
      console.error('Error normalizing image URL:', error);
      setImageSrc('/images/service-placeholder.jpg');
      setHasError(true);
    }
  }, [src]);
  
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