/**
 * URL and API related utilities
 */

import axios from 'axios';

/**
 * Core URL normalization function that handles common URL transformations
 * @param url The URL to normalize
 * @param options Options for normalization
 */
export const normalizeUrl = (url: string, options: {
  useDefaultImage?: boolean;
  checkHttpProtocol?: boolean;
} = {}): string => {
  if (!url) {
    return options.useDefaultImage ? '/images/placeholder.jpg' : '';
  }
  
  // In browser context, replace backend:8000 with localhost:8000
  // because browsers can't access Docker container names
  if (typeof window !== 'undefined' && url.indexOf('backend:8000') !== -1) {
    url = url.replace(/backend:8000/g, 'localhost:8000');
  }
  
  // Handle absolute media paths
  if (url.charAt(0) === '/' && url.indexOf('media/') === 0) {
    const baseUrl = typeof window !== 'undefined'
      ? 'http://localhost:8000'
      : (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://backend:8000');
    url = `${baseUrl}${url}`;
  }
  
  // Handle relative media paths
  if (url.indexOf('media/') === 0) {
    const baseUrl = typeof window !== 'undefined'
      ? 'http://localhost:8000'
      : (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://backend:8000');
    url = `${baseUrl}/${url}`;
  }
  
  // Handle missing HTTP protocol if option enabled
  if (options.checkHttpProtocol && url.indexOf('http') === -1 && url.indexOf('media') === -1) {
    return options.useDefaultImage ? '/images/placeholder.jpg' : url;
  }
  
  return url;
};

/**
 * Normalizes image URLs for proper display in browser
 */
export const normalizeImageUrl = (url: string): string => {
  return normalizeUrl(url, { useDefaultImage: true, checkHttpProtocol: true });
};

/**
 * Fixes image URLs to ensure they work in the browser environment
 * Less strict than normalizeImageUrl - doesn't check for HTTP protocol
 */
export const fixImageUrl = (url: string): string => {
  if (!url) return '';
  if (url.includes('backend:8000')) {
    return url.replace('backend:8000', 'localhost:8000');
  }
  return url;
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
 * Smart detection of environment to handle both browser and container contexts
 */
export const getApiBaseUrl = (): string => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  // Get the configured API URL (from environment variables)
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL || '';
  
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
 * Validates if a slug belongs to a service
 * Returns true if it's a service, false if not
 */
export const validateServiceSlug = async (slug: string, locale = 'en'): Promise<boolean> => {
  if (!slug) return false;
  
  try {
    const API_BASE_URL = getApiBaseUrl();
    const params = new URLSearchParams();
    params.append('lang', locale);
    
    const response = await axios.get(`${API_BASE_URL}/services/${slug}/?${params.toString()}`);
    return !!(response.data && response.data.id);
  } catch (error) {
    return false;
  }
};

/**
 * Validates if a slug belongs to a project
 * Returns true if it's a project, false if not
 */
export const validateProjectSlug = async (slug: string, locale = 'en'): Promise<boolean> => {
  if (!slug) return false;
  
  try {
    const API_BASE_URL = getApiBaseUrl();
    const params = new URLSearchParams();
    params.append('lang', locale);
    
    const response = await axios.get(`${API_BASE_URL}/projects/${slug}/?${params.toString()}`);
    return !!(response.data && response.data.id);
  } catch (error) {
    return false;
  }
};

/**
 * Get the correct route for a slug based on content type
 */
export const getCorrectRoute = async (slug: string, locale = 'en'): Promise<string> => {
  if (!slug) return '/';
  
  // Try service first since that was the original intended routing
  if (await validateServiceSlug(slug, locale)) {
    return `/services/${slug}`;
  }
  
  // Then try project
  if (await validateProjectSlug(slug, locale)) {
    return `/portfolio/${slug}`;
  }
  
  // Default to home if neither
  return '/';
}; 