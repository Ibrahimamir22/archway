import axios from 'axios';

// Create a custom axios instance with URL transformation
const api = axios.create();

// Intercept requests to transform URLs
api.interceptors.request.use((config) => {
  // Only in browser context, transform backend:8000 to localhost:8000
  if (typeof window !== 'undefined' && config.url) {
    config.url = config.url.replace(/backend:8000/g, 'localhost:8000');
  }
  return config;
});

// Get base API URL with environment awareness
export const getApiBaseUrl = (): string => {
  const isDev = process.env.NODE_ENV === 'development';
  const isBrowser = typeof window !== 'undefined';
  
  // For browser context, use the specific browser URL if available
  if (isBrowser && process.env.NEXT_PUBLIC_API_BROWSER_URL) {
    return process.env.NEXT_PUBLIC_API_BROWSER_URL;
  }
  
  // For server context or fallback, use the container URL
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // Default fallbacks
  return isBrowser 
    ? 'http://localhost:8000/api/v1'
    : 'http://backend:8000/api/v1';
};

// Handles media URLs
export const getMediaUrl = (path: string): string => {
  if (!path) return '';
  
  // Clean up path
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  
  const isBrowser = typeof window !== 'undefined';
  
  // Get appropriate base URL depending on context
  const baseUrl = isBrowser
    ? (process.env.NEXT_PUBLIC_BACKEND_BROWSER_URL || 'http://localhost:8000')
    : (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://backend:8000');
  
  return `${baseUrl}${cleanPath}`;
};

// Helper for fixing image URLs
export const fixImageUrl = (url: string): string => {
  if (!url) return '/images/placeholder.jpg';
  
  // If we're in a browser, always replace backend:8000 with localhost:8000
  if (typeof window !== 'undefined') {
    // Debug image URLs in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Processing image URL:', url);
    }
    
    // Try to convert any problematic URL
    
    // Handle backend media paths through our proxy
    if (url.includes('/media/')) {
      // Extract the media path
      const mediaPathMatch = url.match(/\/media\/(.+)$/);
      if (mediaPathMatch && mediaPathMatch[1]) {
        // Use our proxy API route
        return `/api/image-proxy?path=/media/${encodeURIComponent(mediaPathMatch[1])}`;
      }
    }
    
    // If URL starts with media/
    if (url.startsWith('media/')) {
      return `/api/image-proxy?path=/media/${encodeURIComponent(url.substring(6))}`;
    }
    
    // If URL is fully qualified but using backend
    if (url.includes('http://backend:') || url.includes('https://backend:')) {
      // Extract the path part
      const pathMatch = url.match(/https?:\/\/backend:[0-9]+(.+)$/);
      if (pathMatch && pathMatch[1]) {
        return `/api/image-proxy?path=${encodeURIComponent(pathMatch[1])}`;
      }
      // Fallback to simple replacement
      return url.replace(/https?:\/\/backend:[0-9]+/g, 'http://localhost:8000');
    }
    
    // Handle any other backend:8000 URLs
    if (url.includes('backend:8000')) {
      return url.replace(/backend:8000/g, 'localhost:8000');
    }
    
    // Handle localhost:8000 directly in case it's already been transformed
    if (url.includes('localhost:8000') && url.includes('/media/')) {
      const mediaPathMatch = url.match(/\/media\/(.+)$/);
      if (mediaPathMatch && mediaPathMatch[1]) {
        return `/api/image-proxy?path=/media/${encodeURIComponent(mediaPathMatch[1])}`;
      }
    }
    
    // Absolute path handling
    if (url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/api/')) {
      return url; // Direct static path, keep as is
    }
  }
  
  return url;
};

export default api; 