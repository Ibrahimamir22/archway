import { Service } from '@/@types/services';

/**
 * Determines the correct image source for a service
 * @param service The service object
 * @returns Appropriate image URL or placeholder
 */
export const getServiceImageSrc = (service: Service): string => {
  if (service.cover_image_url) {
    return service.cover_image_url;
  }
  
  if (service.image_url) {
    return service.image_url;
  }
  
  if (service.cover_image) {
    return service.cover_image;
  }
  
  if (service.image) {
    return service.image;
  }
  
  return '/images/service-placeholder.jpg';
};

/**
 * Normalizes a service image URL for browser display
 * @param url The original URL
 * @returns Normalized URL safe for browser display
 */
export const normalizeServiceImageUrl = (url: string): string => {
  if (!url) return '/images/service-placeholder.jpg';
  
  // If the URL contains backend:8000, replace with localhost:8000 for browser
  if (typeof window !== 'undefined' && url.includes('backend:8000')) {
    return url.replace('backend:8000', 'localhost:8000');
  }
  
  return url;
}; 