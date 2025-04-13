import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

export interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
}

/**
 * Optimized Image component that ensures consistent image loading across all pages
 * and handles URL normalization for both server and client environments
 */
const OptimizedImage = ({ src, alt, priority, ...props }: OptimizedImageProps) => {
  // Normalize URL consistently for both server and client
  const normalizeUrl = (url: string): string => {
    if (!url) return '/images/placeholder.jpg';
    
    try {
      // Convert backend:8000 to localhost:8000 for browser
      if (url.includes('backend:8000')) {
        return url.replace(/backend:8000/g, 'localhost:8000');
      }
      
      // Handle absolute media paths from Django
      if (url.startsWith('/media/')) {
        return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'}${url}`;
      }
      
      // Handle relative media paths
      if (url.startsWith('media/')) {
        return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000'}/${url}`;
      }
      
      // If URL doesn't have protocol but isn't a relative path, add http
      if (!url.includes('://') && !url.startsWith('/')) {
        return `http://${url}`;
      }
      
      return url;
    } catch (error) {
      console.error('Error normalizing image URL:', error);
      return '/images/placeholder.jpg';
    }
  };

  // Initial normalized URL
  const [imageSrc, setImageSrc] = useState<string>(normalizeUrl(src));
  
  // Handle errors
  const [hasError, setHasError] = useState(false);
  
  // Update normalized URL when source changes
  useEffect(() => {
    if (src) {
      const normalized = normalizeUrl(src);
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
      priority={priority}
      {...props} 
    />
  );
};

export default OptimizedImage; 