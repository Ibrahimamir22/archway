/**
 * Custom image loader for Next.js to ensure consistent URLs in both server and client environments
 * Prevents hydration mismatch errors by normalizing URLs before they're rendered
 */
export default function imageLoader({ src, width, quality = 75 }) {
  // If no src provided, return empty string
  if (!src) return '';

  // Aggressive URL normalization to ensure consistent rendering
  let normalizedSrc = src;

  // Always replace backend:8000 with localhost:8000 
  if (normalizedSrc.includes('backend:8000')) {
    normalizedSrc = normalizedSrc.replace(/backend:8000/g, 'localhost:8000');
  }
  
  // Handle absolute media paths
  if (normalizedSrc.startsWith('/media/')) {
    normalizedSrc = `http://localhost:8000${normalizedSrc}`;
  }
  
  // Handle relative media paths
  if (normalizedSrc.startsWith('media/')) {
    normalizedSrc = `http://localhost:8000/${normalizedSrc}`;
  }

  // Return the normalized URL
  return normalizedSrc;
} 