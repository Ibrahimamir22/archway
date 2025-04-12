import { useRouter } from 'next/router';
import { useQuery } from 'react-query';
import axios from 'axios';

// Smart detection of environment to handle both browser and container contexts
const getApiBaseUrl = () => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  // Get the configured API URL (from environment variables)
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (configuredUrl) {
    // If we're in a browser and the URL contains 'backend', replace with 'localhost'
    if (isBrowser && configuredUrl.includes('backend')) {
      return configuredUrl.replace('backend', 'localhost');
    }
    return configuredUrl;
  }
  
  // Default fallback - use backend for server-side, localhost for client-side
  return isBrowser 
    ? 'http://localhost:8000/api/v1' 
    : 'http://backend:8000/api/v1';
};

// Types for footer data
export interface FooterLink {
  id: string;
  title: string;
  url: string;
  open_in_new_tab: boolean;
  order: number;
}

export interface FooterSection {
  id: string;
  title: string;
  slug: string;
  links: FooterLink[];
  order: number;
}

export interface SocialMedia {
  id: string;
  platform: string;
  url: string;
  get_icon: string;
  order: number;
}

export interface FooterSettings {
  company_name: string;
  description: string;
  address: string;
  email: string;
  phone: string;
  copyright_text: string;
  show_newsletter: boolean;
  newsletter_text: string;
}

export interface FooterData {
  settings: FooterSettings;
  sections: FooterSection[];
  social_media: SocialMedia[];
}

interface UseFooterOptions {
  enabled?: boolean;
}

export const useFooter = (options: UseFooterOptions = {}, prefetchedData?: FooterData) => {
  const router = useRouter();
  const { locale } = router;
  const API_BASE_URL = getApiBaseUrl();
  
  // Function to fetch footer data
  const fetchFooter = async () => {
    const params = new URLSearchParams();
    
    // Add language parameter
    params.append('lang', locale || 'en');
    
    // Fetch data from API
    const response = await axios.get<FooterData>(`${API_BASE_URL}/footer/?${params.toString()}`);
    return response.data;
  };
  
  // Use React Query for data fetching with caching
  const { 
    data, 
    error, 
    isLoading, 
    refetch 
  } = useQuery(
    ['footer', locale],
    fetchFooter,
    {
      // Use prefetched data if available
      initialData: prefetchedData,
      // Enable/disable the query based on options
      enabled: options.enabled !== false,
      // Stale time (1 hour) - data will be considered fresh for 1 hour
      staleTime: 60 * 60 * 1000,
      // Cache time (2 hours) - data will be cached for 2 hours
      cacheTime: 2 * 60 * 60 * 1000,
      // Don't refetch on window focus
      refetchOnWindowFocus: false,
      // Retry 3 times if request fails
      retry: 3,
      // Return last successful data if an error occurs
      keepPreviousData: true,
    }
  );
  
  return {
    footerData: data,
    settings: data?.settings,
    sections: data?.sections || [],
    socialMedia: data?.social_media || [],
    isLoading,
    error,
    refetch
  };
};

// Helper hook for newsletter subscription
export const useNewsletterSubscription = () => {
  const API_BASE_URL = getApiBaseUrl();
  
  const subscribeToNewsletter = async (email: string) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/newsletter/`, { email });
      return { success: true, data: response.data };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return { 
          success: false, 
          error: error.response.data.detail || 'Failed to subscribe. Please try again.' 
        };
      }
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again.' 
      };
    }
  };
  
  return { subscribeToNewsletter };
}; 