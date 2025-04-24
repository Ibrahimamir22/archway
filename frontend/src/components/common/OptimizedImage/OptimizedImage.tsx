import Image, { ImageProps } from 'next/image';
import { useState, useEffect, memo } from 'react';
import { fixImageUrl } from '@/lib/images';

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
    if (hasError) return; // Prevent infinite error loops
    
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Image failed to load: ${imageSrc}`);
    }
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
  
  // Fixed width/height check to ensure both are present
  const { width, height, fill, sizes } = props;
  
  // Ensure we have proper dimensions to prevent warnings
  let enhancedProps: any = { ...props };
  
  // If fill is specified, we don't need width and height
  if (fill) {
    // No change needed, fill is already set
  } 
  // If both width and height are specified, use them
  else if (width !== undefined && height !== undefined) {
    // No change needed, both dimensions are set
  }
  // If neither are specified, use default dimensions
  else if (width === undefined && height === undefined) {
    enhancedProps.width = 300;
    enhancedProps.height = 200;
  }
  // If only one dimension is specified, calculate the other using a default ratio
  else if (width !== undefined && height === undefined) {
    // Calculate height from width using 3:2 aspect ratio
    const calculatedHeight = typeof width === 'number' ? 
      Math.round(Number(width) * (2/3)) : 200;
    enhancedProps.height = calculatedHeight;
  }
  else if (height !== undefined && width === undefined) {
    // Calculate width from height using 3:2 aspect ratio
    const calculatedWidth = typeof height === 'number' ? 
      Math.round(Number(height) * (3/2)) : 300;
    enhancedProps.width = calculatedWidth;
  }
  
  // If no sizes prop is provided but we have a responsive width, add a default sizes
  if (!sizes && 
      (typeof width === 'string' || typeof enhancedProps.width === 'string')) {
    enhancedProps.sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw";
  }
  
  return (
    <Image 
      src={imageSrc}
      alt={alt || 'Image'} 
      onError={handleError}
      onLoad={handleLoad}
      priority={priority}
      {...enhancedProps} 
    />
  );
};

// Use memo to prevent unnecessary rerenders
export default memo(OptimizedImage); 