import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';
import { fixImageUrl } from '../../../utils/api';

// Global registry of preloaded images to avoid duplicate work
const preloadedImages = typeof window !== 'undefined' ? new Set<string>() : new Set();

export interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  onLoad?: () => void;
}

/**
 * Optimized Image component that ensures consistent image loading across all pages
 * and handles URL normalization for both server and client environments
 */
const OptimizedImage = ({ src, alt, priority, onLoad, ...props }: OptimizedImageProps) => {
  // Initial normalized URL
  const [imageSrc, setImageSrc] = useState<string>(fixImageUrl(src));
  
  // Handle errors
  const [hasError, setHasError] = useState(false);
  
  // Update normalized URL when source changes
  useEffect(() => {
    if (src) {
      const normalized = fixImageUrl(src);
      setImageSrc(normalized);
      setHasError(false); // Reset error state when src changes
    }
  }, [src]);
  
  // Handle image load errors
  const handleError = () => {
    console.warn(`Image failed to load: ${imageSrc}`);
    setHasError(true);
    
    // Try to extract a unique number from the URL to use for fallback image selection
    let fallbackIndex = 1;
    try {
      const urlParts = imageSrc.split(/[/-]/);
      const numbers = urlParts.filter(part => /^\d+$/.test(part));
      if (numbers.length > 0) {
        fallbackIndex = (parseInt(numbers[0]) % 5) + 1;
      }
    } catch (e) {
      // Use default fallback if parsing fails
    }
    
    setImageSrc(`/images/project-${fallbackIndex}.jpg`);
  };
  
  // Handle successful load
  const handleLoad = () => {
    if (onLoad) onLoad();
  };
  
  // Preload image for better performance
  useEffect(() => {
    if (typeof window !== 'undefined' && imageSrc && !hasError && !imageSrc.startsWith('/images/placeholder')) {
      const img = new window.Image();
      img.src = imageSrc;
    }
  }, [imageSrc, hasError]);
  
  return (
    <Image 
      src={imageSrc}
      alt={alt || 'Image'} 
      onError={handleError}
      onLoad={handleLoad}
      priority={priority}
      {...props} 
    />
  );
};

export default OptimizedImage; 