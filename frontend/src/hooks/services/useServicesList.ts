import { useInfiniteQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Service, UseServicesOptions, ServicesResponse } from '@/@types/services';
import { fetchServices } from '@/lib/api/services';

/**
 * Hook for fetching services with pagination, filtering, and search
 * @param options Filtering options
 * @param prefetchedData Optional prefetched data
 * @returns Services data with loading state and pagination controls
 */
export const useServicesList = (
  options: UseServicesOptions = {}, 
  prefetchedData?: Service[]
) => {
  const router = useRouter();
  const { locale } = router;

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
    ({ pageParam = 1 }) => fetchServices(
      { ...options, page: pageParam }, 
      locale || 'en'
    ),
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
  
  // Localized error messages
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