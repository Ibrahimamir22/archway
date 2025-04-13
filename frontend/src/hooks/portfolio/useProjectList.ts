import { useInfiniteQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Project, UseProjectsOptions, ProjectsResponse } from './types';
import api, { getApiBaseUrl, fixImageUrl } from '../../utils/api';

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
    
    try {
      // Use our api instance with automatic URL transformation
      const response = await api.get<ProjectsResponse>(
        `${API_BASE_URL}/projects/?${params.toString()}`
      );
      
      // Fix image URLs to ensure they work in the browser
      const results = response.data.results.map(project => ({
        ...project,
        cover_image: project.cover_image ? fixImageUrl(project.cover_image) : undefined,
        cover_image_url: project.cover_image_url ? fixImageUrl(project.cover_image_url) : undefined,
        images: project.images ? project.images.map(img => ({
          ...img,
          image: img.image ? fixImageUrl(img.image) : undefined,
          image_url: img.image_url ? fixImageUrl(img.image_url) : undefined,
        })) : []
      }));
      
      return {
        ...response.data,
        results
      };
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
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