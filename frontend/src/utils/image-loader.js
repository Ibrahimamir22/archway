/**
 * Custom image loader for Next.js
 * Optimized for faster image loading with improved error handling
 */
export default function customImageLoader({ src, width, quality }) {
  // Handle missing source gracefully
  if (!src) {
    return '/images/placeholder.jpg';
  }
  
  // Simple cache to avoid repeated transformations - only use on client side
  if (typeof window !== 'undefined' && window._imageCache && window._imageCache[src]) {
    return window._imageCache[src];
  }

  // Skip processing for external URLs or data URLs
  if (src.startsWith('https://') || src.startsWith('http://') || src.startsWith('data:')) {
    return src;
  }

  // If using a relative URL without domain, keep as is
  if (src.startsWith('/')) {
    return src;
  }

  // Replace backend:8000 with localhost:8000 for browser context
  let normalizedSrc = src;
  if (normalizedSrc.includes('backend:8000') && typeof window !== 'undefined') {
    normalizedSrc = normalizedSrc.replace(/backend:8000/g, 'localhost:8000');
  }

  // Handle optimized images with width and quality params
  if (width) {
    // Only add image optimization params for supported formats
    const isOptimizable = /\.(jpe?g|png|webp|avif)$/i.test(normalizedSrc);
    
    if (isOptimizable) {
      const params = [`w=${width}`];
      
      if (quality) {
        params.push(`q=${quality || 75}`);
      }
      
      // Only add parameters if the source is a URL that supports them
      if (normalizedSrc.includes('/_next/image') || normalizedSrc.includes('/api/')) {
        normalizedSrc = `${normalizedSrc}${normalizedSrc.includes('?') ? '&' : '?'}${params.join('&')}`;
      }
    }
  }

  // Cache the result for future use - only on client side
  if (typeof window !== 'undefined') {
    if (!window._imageCache) window._imageCache = {};
    window._imageCache[src] = normalizedSrc;
  }

  return normalizedSrc;
}

// Add type definition for the image cache - only on client side
if (typeof window !== 'undefined') {
  window._imageCache = window._imageCache || {};
} 