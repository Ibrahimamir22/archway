import { useRouter } from 'next/router';
import axios from 'axios';

/**
 * Returns properly configured API URL based on environment
 */
export const getApiBaseUrl = (): string => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  // Get the configured API URL (from environment variables)
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (configuredUrl) {
    // If we're in a browser and the URL contains 'backend', replace with 'localhost'
    if (isBrowser && configuredUrl.includes('backend')) {
      return configuredUrl.replace('backend', 'localhost');
    }
    return configuredUrl;
  }
  
  // Default fallback - use backend for server-side, localhost for client-side
  return isBrowser 
    ? 'http://localhost:8000/api/v1' 
    : 'http://backend:8000/api/v1';
};

/**
 * Checks if a URL contains a potentially problematic UUID hash
 */
export const containsUUIDHash = (url: string): boolean => {
  if (!url) return false;
  const hashPattern = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/;
  return hashPattern.test(url);
};

/**
 * Fixes image URLs to ensure they work in the browser environment
 */
export const fixImageUrl = (url: string): string => {
  if (!url) {
    return '/images/placeholder.jpg';
  }
  
  // Handle backend URLs
  if (url.includes('backend:8000')) {
    return url.replace(/backend:8000/g, 'localhost:8000');
  }
  
  // Handle absolute media paths
  if (url.startsWith('/media/')) {
    return `http://localhost:8000${url}`;
  }
  
  // Handle relative media paths
  if (url.startsWith('media/')) {
    return `http://localhost:8000/${url}`;
  }
  
  return url;
};

/**
 * Normalizes image URLs with strict validation for API responses
 */
export const normalizeImageUrl = (url: string): string => {
  if (!url) {
    return '/images/placeholder.jpg';
  }
  
  // Handle backend URLs
  if (url.includes('backend:8000')) {
    return url.replace(/backend:8000/g, 'localhost:8000');
  }
  
  // Handle absolute media paths
  if (url.startsWith('/media/')) {
    return `http://localhost:8000${url}`;
  }
  
  // Handle relative media paths
  if (url.startsWith('media/')) {
    return `http://localhost:8000/${url}`;
  }
  
  // Handle missing URLs
  if (!url.includes('http') && !url.includes('media')) {
    return '/images/placeholder.jpg';
  }
  
  return url;
};

/**
 * Hook for accessing API URL with locale context
 */
export const useApi = () => {
  const router = useRouter();
  const locale = router.locale || 'en';
  const baseUrl = getApiBaseUrl();
  
  // Create query params object with locale
  const getQueryParams = () => ({
    lang: locale
  });
  
  // Helper to get full URL with locale
  const getUrlWithLocale = (path: string) => {
    const url = new URL(path, baseUrl);
    url.searchParams.append('lang', locale);
    return url.toString();
  };
  
  return {
    baseUrl,
    locale,
    getQueryParams,
    getUrlWithLocale,
    fixImageUrl,
    normalizeImageUrl
  };
}; 