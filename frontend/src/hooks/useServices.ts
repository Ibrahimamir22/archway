import { useInfiniteQuery, useQuery } from 'react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { ServiceCategory } from './useServiceCategories';

// Smart detection of environment to handle both browser and container contexts
const getApiBaseUrl = () => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  // Get the configured API URLs (from environment variables)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  
  if (apiUrl) {
    // When in browser, use the NEXT_PUBLIC_API_URL directly
    // This should point to localhost:8000 for browser access
    return apiUrl;
  }
  
  // Default fallback - use appropriate URL based on environment
  return isBrowser 
    ? 'http://localhost:8000/api/v1' 
    : 'http://backend:8000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

export interface ServiceFeature {
  id: string;
  name: string;
  description: string;
  is_included: boolean;
  order: number;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  category: ServiceCategory;
  icon: string;
  image?: string;
  image_url?: string;
  cover_image?: string;
  cover_image_url?: string;
  price?: number;
  price_unit?: string;
  duration?: string;
  is_featured: boolean;
  is_published: boolean;
  order: number;
  features?: ServiceFeature[];
}

interface UseServicesOptions {
  category?: string;
  featured?: boolean;
  limit?: number;
}

interface ServicesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Service[];
}

export const useServices = (options: UseServicesOptions = {}, prefetchedData?: Service[]) => {
  const router = useRouter();
  const { locale } = router;

  // Function to fetch services from API
  const fetchServices = async ({ pageParam = 1 }) => {
    // Build query parameters
    const params = new URLSearchParams();
    
    if (options.category) {
      params.append('category__slug', options.category);
    }
    
    if (options.featured) {
      params.append('is_featured', 'true');
    }
    
    if (options.limit) {
      params.append('limit', options.limit.toString());
    }
    
    // Add language parameter
    params.append('lang', locale || 'en');
    
    // Add page parameter for pagination
    params.append('page', pageParam.toString());
    
    // Fetch data from API
    const response = await axios.get<ServicesResponse>(`${API_BASE_URL}/services/?${params.toString()}`);
    return response.data;
  };

  // Use react-query for data fetching with pagination support
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch
  } = useInfiniteQuery(
    ['services', options, locale],
    fetchServices,
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.next) {
          // Extract page number from next URL
          const url = new URL(lastPage.next);
          return url.searchParams.get('page');
        }
        return undefined;
      },
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
      initialData: prefetchedData && Array.isArray(prefetchedData) ? {
        pages: [{ results: prefetchedData, count: prefetchedData.length, next: null, previous: null }],
        pageParams: [1],
      } : undefined,
    }
  );

  // Flatten paginated results with safety check
  const services = data?.pages 
    ? data.pages.flatMap(page => page?.results && Array.isArray(page.results) ? page.results : []) 
    : [];
    
  const loading = status === 'loading';
  const isError = status === 'error';
  const errorMessage = isError 
    ? locale === 'ar' 
      ? "فشل تحميل الخدمات، يرجى المحاولة مرة أخرى" 
      : "Failed to load services, please try again"
    : null;

  return { 
    services, 
    loading, 
    error: errorMessage, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    refetch
  };
};

export const useServiceDetail = (slug: string | undefined) => {
  const router = useRouter();
  const { locale } = router;

  const fetchService = async () => {
    if (!slug) return null;
    
    // Add language parameter
    const params = new URLSearchParams();
    params.append('lang', locale || 'en');
    
    // Fetch data from API
    const response = await axios.get(`${API_BASE_URL}/services/${slug}/?${params.toString()}`);
    return response.data;
  };

  const { data, error, status, refetch } = useQuery(
    ['serviceDetail', slug, locale],
    fetchService,
    {
      enabled: !!slug, // Only run query if slug is provided
      retry: 2,
      refetchOnWindowFocus: false
    }
  );

  const service = data || null;
  const loading = status === 'loading';
  const errorMessage = status === 'error' 
    ? locale === 'ar' 
      ? "فشل تحميل بيانات الخدمة، يرجى المحاولة مرة أخرى" 
      : "Failed to load service details, please try again"
    : null;

  return { service, loading, error: errorMessage, refetch };
};

// Helper function to fix image URLs for use across the app
export const fixImageUrl = (url: string | undefined): string => {
  if (!url) return '/images/placeholder.jpg';
  
  // If it's already a full URL, return it
  if (url.startsWith('http')) {
    return url;
  }
  
  const isBrowser = typeof window !== 'undefined';
  const apiBaseUrl = isBrowser 
    ? process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:8000' 
    : process.env.NEXT_PUBLIC_BACKEND_URL || 'http://backend:8000';
  
  // If it's a relative path from Django, add API base URL
  if (url.startsWith('/media')) {
    return `${apiBaseUrl}${url}`;
  }
  
  // Handle case where we just have the filename without path
  if (!url.startsWith('/')) {
    return `/media/${url}`;
  }
  
  return url;
}; 