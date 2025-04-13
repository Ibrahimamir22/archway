/**
 * Custom image loader for Next.js
 * Normalizes backend URLs to ensure they work in both browser and container contexts
 */
export default function customImageLoader({ src, width, quality }) {
  // Skip processing for external URLs or data URLs
  if (src.startsWith('https://') || src.startsWith('http://') || src.startsWith('data:')) {
    return src;
  }

  // If using a relative URL without domain, keep as is
  if (src.startsWith('/')) {
    return src;
  }

  // Replace backend:8000 with localhost:8000 for browser context
  if (src.includes('backend:8000') && typeof window !== 'undefined') {
    src = src.replace('backend:8000', 'localhost:8000');
  }

  // Handle optimized images with width and quality params
  if (width) {
    const params = [`w=${width}`];
    
    if (quality) {
      params.push(`q=${quality || 75}`);
    }
    
    // Only add parameters if the source is a URL that supports them
    if (src.includes('/_next/image') || src.includes('/api/')) {
      // Add parameters if we're using Next.js image optimization
      return `${src}${src.includes('?') ? '&' : '?'}${params.join('&')}`;
    }
  }

  return src;
} 