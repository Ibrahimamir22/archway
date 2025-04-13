import { useInfiniteQuery } from 'react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Project, UseProjectsOptions, ProjectsResponse } from './types';
import { getApiBaseUrl } from '../../utils/urls';

/**
 * Hook for fetching projects with pagination, filtering, and search
 */
export const useProjectList = (options: UseProjectsOptions = {}, prefetchedData?: Project[]) => {
  const router = useRouter();
  const { locale } = router;
  const API_BASE_URL = getApiBaseUrl();

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
    // When is_published is null, don't send any is_published parameter to the API
    // This allows fetching both published and unpublished projects
    if (options.is_published !== null) {
      // Only append the parameter if it's not null, meaning we want to filter by published status
      if (options.is_published !== undefined) {
        params.append('is_published', options.is_published ? 'true' : 'false');
      } else {
        // Default behavior: only published projects (when is_published is undefined but not null)
        params.append('is_published', 'true');
      }
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