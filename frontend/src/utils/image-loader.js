import { normalizeUrl } from './urls';

/**
 * Custom image loader for Next.js to ensure consistent URLs in both server and client environments
 * Prevents hydration mismatch errors by normalizing URLs before they're rendered
 */
export default function imageLoader({ src, width, quality = 75 }) {
  // If no src provided, return empty string
  if (!src) return '';

  // Use our centralized URL normalization function
  const normalizedSrc = normalizeUrl(src, { useDefaultImage: false });
  
  // Add any additional Next.js image loader parameters if needed
  // For now, we're not modifying sizes since we handle that with the Next Image component
  
  return normalizedSrc;
} 