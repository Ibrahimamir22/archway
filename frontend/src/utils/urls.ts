/**
 * URL and API related utilities
 */

/**
 * Normalizes image URLs for proper display in browser
 */
export const normalizeImageUrl = (url: string): string => {
  if (!url) {
    return '/images/placeholder.jpg';
  }
  
  // Clean URL for browser consumption
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
 * Smart detection of environment to handle both browser and container contexts
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