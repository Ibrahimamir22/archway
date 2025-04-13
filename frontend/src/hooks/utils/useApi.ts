import { useRouter } from 'next/router';
import axios from 'axios';
import { 
  getApiBaseUrl, 
  normalizeImageUrl, 
  fixImageUrl, 
  containsUUIDHash 
} from '../../utils/urls';

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

// Re-export URL utilities for backward compatibility
export { 
  getApiBaseUrl, 
  normalizeImageUrl, 
  fixImageUrl, 
  containsUUIDHash 
}; 