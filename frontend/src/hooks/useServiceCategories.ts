import { useQuery } from 'react-query';
import axios from 'axios';
import { useRouter } from 'next/router';

// Smart detection of environment to handle both browser and container contexts
const getApiBaseUrl = () => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  // Get the configured API URLs (from environment variables)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (apiUrl) {
    // When in browser, use the NEXT_PUBLIC_API_URL directly
    return apiUrl;
  }
  
  // Default fallback - use appropriate URL based on environment
  return isBrowser 
    ? 'http://localhost:8000/api/v1' 
    : 'http://backend:8000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

export interface ServiceCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  order: number;
}

export const useServiceCategories = (prefetchedData?: ServiceCategory[]) => {
  const router = useRouter();
  const { locale } = router;

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
      initialData: prefetchedData && Array.isArray(prefetchedData) ? prefetchedData : [] // Ensure initial data is an array
    }
  );

  // Ensure categories is always an array, regardless of what comes from data
  const categories = Array.isArray(data) ? data : 
                    (data && data.results && Array.isArray(data.results)) ? data.results : [];
                    
  const loading = status === 'loading';
  const errorMessage = status === 'error' 
    ? locale === 'ar' 
      ? "فشل تحميل فئات الخدمات، يرجى المحاولة مرة أخرى" 
      : "Failed to load service categories, please try again"
    : null;

  return { categories, loading, error: errorMessage, refetch };
}; 