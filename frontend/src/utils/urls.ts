/**
 * URL and API related utilities
 */

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
  return normalizeUrl(url, { useDefaultImage: true });
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
    // In browser context, we must use localhost:8000 instead of backend:8000
    // because browsers can't access Docker container names
    if (isBrowser && configuredUrl.includes('backend:8000')) {
      return configuredUrl.replace('backend:8000', 'localhost:8000');
    }
    return configuredUrl;
  }
  
  // Default fallback - browsers always need to use localhost
  return isBrowser
    ? 'http://localhost:8000/api/v1' 
    : 'http://backend:8000/api/v1';
}; 