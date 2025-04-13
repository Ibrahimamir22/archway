import { useQuery, useInfiniteQuery } from 'react-query';
import axios from 'axios';
import { useRouter } from 'next/router';

// Type declaration for Node.js process
declare const process: {
  env: {
    NEXT_PUBLIC_API_URL?: string;
    NEXT_PUBLIC_BACKEND_URL?: string;
    [key: string]: string | undefined;
  }
};

// Smart detection of environment to handle both browser and container contexts
const getApiBaseUrl = () => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  // Get the configured API URL (from environment variables)
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (configuredUrl) {
    // Use configured URL as is - don't transform it
    return configuredUrl;
  }
  
  // Default fallback - use backend for server-side, localhost for client-side
  return isBrowser 
    ? 'http://backend:8000/api/v1' 
    : 'http://backend:8000/api/v1';
};

const API_BASE_URL = getApiBaseUrl();

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: Category;
  client?: string;
  location?: string;
  area?: number;
  completed_date?: string;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  tags: Tag[];
  cover_image?: string;
  cover_image_url?: string;
  image?: string;
  images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  image: string;
  image_url?: string;
  alt_text: string;
  is_cover: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

interface UseProjectsOptions {
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
  is_published?: boolean;
  limit?: number;
}

interface ProjectsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Project[];
}

export const useProjects = (options: UseProjectsOptions = {}, prefetchedData?: Project[]) => {
  const router = useRouter();
  const { locale } = router;

  // Function to fetch projects from API
  const fetchProjects = async ({ pageParam = 1 }) => {
    // Build query parameters
    const params = new URLSearchParams();
    
    if (options.category) {
      params.append('category__slug', options.category);
    }
    
    if (options.tag) {
      params.append('tags__slug', options.tag);
    }
    
    if (options.search) {
      params.append('search', options.search);
    }
    
    if (options.featured) {
      params.append('is_featured', 'true');
    }
    
    // Add explicit support for is_published filter
    if (options.is_published !== undefined) {
      params.append('is_published', options.is_published ? 'true' : 'false');
    }
    
    if (options.limit) {
      params.append('limit', options.limit.toString());
    }
    
    // Add language parameter
    params.append('lang', locale || 'en');
    
    // Add page parameter for pagination
    params.append('page', pageParam.toString());
    
    // Fetch data from API
    const response = await axios.get<ProjectsResponse>(`${API_BASE_URL}/projects/?${params.toString()}`);
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
    ['projects', options, locale],
    fetchProjects,
    {
      getNextPageParam: (lastPage: ProjectsResponse) => {
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
      initialData: prefetchedData ? {
        pages: [{ results: prefetchedData, count: prefetchedData.length, next: null, previous: null }],
        pageParams: [1],
      } : undefined,
    }
  );

  // Flatten paginated results
  const projects = data?.pages ? data.pages.flatMap((page: ProjectsResponse) => page?.results || []) : [];
  const loading = status === 'loading';
  const isError = status === 'error';
  const errorMessage = isError 
    ? locale === 'ar' 
      ? "فشل تحميل المشاريع، يرجى المحاولة مرة أخرى" 
      : "Failed to load projects, please try again"
    : null;

  return { 
    projects, 
    loading, 
    error: errorMessage, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    refetch
  };
};

export const useProjectCategories = (prefetchedData?: Category[]) => {
  const router = useRouter();
  const { locale } = router;

  const fetchCategories = async () => {
    // Add language parameter
    const params = new URLSearchParams();
    params.append('lang', locale || 'en');
    
    // Fetch data from API - using updated URL based on new router configuration
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

export const useProjectTags = (prefetchedData?: Tag[]) => {
  const router = useRouter();
  const { locale } = router;

  const fetchTags = async () => {
    // Add language parameter
    const params = new URLSearchParams();
    params.append('lang', locale || 'en');
    
    // Fetch data from API - using updated URL based on new router configuration
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

// Improved utility function for fixing all image URLs
export const fixImageUrl = (url: string | undefined): string => {
  if (!url) return '';
  
  // Always use backend:8000 in Docker environment
  
  // Handle media paths that start with /media or media/
  if (url.startsWith('/media/')) {
    return `http://backend:8000${url}`;
  }
  
  if (url.startsWith('media/')) {
    return `http://backend:8000/${url}`;
  }
  
  return url;
};

export const useProjectDetail = (slug: string) => {
  const router = useRouter();
  const { locale } = router;

  const fetchProjectDetail = async () => {
    if (!slug) return null;
    
    // Add language parameter
    const params = new URLSearchParams();
    params.append('lang', locale || 'en');
    
    try {
      // Fetch data from API
      const response = await axios.get(`${API_BASE_URL}/projects/${slug}/?${params.toString()}`);
      
      // Transform API response to match our ProjectDetail interface
      const { data } = response;

      // For safety, ensure images array exists
      const images = data.images || [];

      // Process all image URLs right away
      const safeImages = images.map((img: any, index: number) => {
        const imgSrc = img.image_url || img.image || `/images/project-${(index % 5) + 1}.jpg`;
        return {
          id: img.id || `image-${index + 1}`,
          src: fixImageUrl(imgSrc),
          alt: img.alt_text || 'Project image',
          isCover: img.is_cover
        };
      });
      
      // Create a clean project object with fixed URLs
      return {
        ...data,
        completedDate: data.completed_date,
        images: safeImages,
        // Fix cover image if present
        cover_image: data.cover_image ? fixImageUrl(data.cover_image) : undefined,
        cover_image_url: data.cover_image_url ? fixImageUrl(data.cover_image_url) : undefined
      };
    } catch (error) {
      console.error('Error fetching project details:', error);
      return null;
    }
  };

  // Use standard react-query with better caching settings
  const { data, error, status, refetch } = useQuery(
    ['projectDetail', slug, locale],
    fetchProjectDetail,
    {
      enabled: !!slug,
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 600000, // 10 minutes - increased from 5
      cacheTime: 3600000, // 60 minutes - increased from 10 
      onSuccess: (data: any) => {
        // Preload images when data is successfully fetched 
        if (typeof window !== 'undefined' && data?.images?.length) {
          console.log(`Preloading ${data.images.length} images on successful fetch`);
          
          // Force browser to load images by creating elements
          data.images.forEach((image: any) => {
            if (image.src) {
              const img = new Image();
              img.src = image.src;
            }
          });
        }
      }
    }
  );

  const project = data || null;
  const loading = status === 'loading';
  const isError = status === 'error';
  const errorMessage = isError 
    ? locale === 'ar' 
      ? "فشل تحميل تفاصيل المشروع، يرجى المحاولة مرة أخرى" 
      : "Failed to load project details, please try again"
    : null;

  return { project, loading, error: errorMessage, refetch };
}; 