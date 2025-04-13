import { useQuery } from 'react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { getApiBaseUrl } from '../../utils/urls';

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  image_url?: string;
}

/**
 * Hook for fetching service categories
 */
export const useServiceCategories = (prefetchedData?: ServiceCategory[]) => {
  const router = useRouter();
  const { locale } = router;
  const API_BASE_URL = getApiBaseUrl();

  const fetchCategories = async () => {
    // Add language parameter
    const params = new URLSearchParams();
    params.append('lang', locale || 'en');
    
    // Fetch data from API
    const response = await axios.get(`${API_BASE_URL}/service-categories/?${params.toString()}`);
      
    // Handle pagination response structure
    return response.data.results || response.data;
  };

  const { data, error, status, refetch } = useQuery(
    ['serviceCategories', locale],
    fetchCategories,
    {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 300000, // 5 minutes
      initialData: prefetchedData // Use prefetched data if available
    }
  );

  const categories = data || [];
  const loading = status === 'loading';
  const errorMessage = status === 'error' 
    ? locale === 'ar' 
      ? "فشل تحميل الفئات، يرجى المحاولة مرة أخرى" 
      : "Failed to load categories, please try again"
    : null;

  return { categories, loading, error: errorMessage, refetch };
}; 