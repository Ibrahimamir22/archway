import { useQuery } from 'react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Category, Tag } from './types';
import { getApiBaseUrl } from '../../utils/urls';

/**
 * Hook for fetching project categories
 */
export const useProjectCategories = (prefetchedData?: Category[]) => {
  const router = useRouter();
  const { locale } = router;
  const API_BASE_URL = getApiBaseUrl();

  const fetchCategories = async () => {
    // Add language parameter
    const params = new URLSearchParams();
    params.append('lang', locale || 'en');
    
    // Fetch data from API
    const response = await axios.get(`${API_BASE_URL}/categories/?${params.toString()}`);
      
    // Handle pagination response structure
    return response.data.results || response.data;
  };

  const { data, error, status, refetch } = useQuery(
    ['projectCategories', locale],
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

/**
 * Hook for fetching project tags
 */
export const useProjectTags = (prefetchedData?: Tag[]) => {
  const router = useRouter();
  const { locale } = router;
  const API_BASE_URL = getApiBaseUrl();

  const fetchTags = async () => {
    // Add language parameter
    const params = new URLSearchParams();
    params.append('lang', locale || 'en');
    
    // Fetch data from API
    const response = await axios.get(`${API_BASE_URL}/tags/?${params.toString()}`);
    
    // Handle pagination response structure
    return response.data.results || response.data;
  };

  const { data, error, status, refetch } = useQuery(
    ['projectTags', locale],
    fetchTags,
    {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 300000, // 5 minutes
      initialData: prefetchedData // Use prefetched data if available
    }
  );

  const tags = data || [];
  const loading = status === 'loading';
  const errorMessage = status === 'error' 
    ? locale === 'ar' 
      ? "فشل تحميل الوسوم، يرجى المحاولة مرة أخرى" 
      : "Failed to load tags, please try again"
    : null;

  return { tags, loading, error: errorMessage, refetch };
}; 