import React, { useState, useEffect } from 'react';
import { normalizeServiceImageUrl } from '@/utils/services/index';

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
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [hasError, setHasError] = useState(false);
  
  // Normalize the image URL for proper display
  useEffect(() => {
    setImageSrc(normalizeServiceImageUrl(src));
  }, [src]);
  
  // Handle loading errors
  const handleError = () => {
    setHasError(true);
    setImageSrc('/images/service-placeholder.jpg');
    onError?.();
  };
  
  // Handle successful loading
  const handleLoad = () => {
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