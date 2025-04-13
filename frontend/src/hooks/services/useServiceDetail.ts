import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import { Service } from '@/@types/services';
import { fetchServiceBySlug } from '@/lib/api/services';

/**
 * Hook for fetching details of a specific service
 * @param slug Service slug identifier
 * @param options Additional options
 * @returns Service data with loading state
 */
export const useServiceDetail = (
  slug: string | undefined, 
  options: { 
    enabled?: boolean;
    initialData?: Service;
  } = {}
) => {
  const router = useRouter();
  const { locale } = router;

  const { data, error, status, refetch } = useQuery(
    ['serviceDetail', slug, locale],
    () => fetchServiceBySlug(slug || '', locale || 'en'),
    {
      enabled: options.enabled !== undefined ? options.enabled && !!slug : !!slug,
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 60000, // 1 minute
      initialData: options.initialData || undefined
    }
  );

  const service = data || null;
  const loading = status === 'loading';
  
  // Localized error messages
  const errorMessage = status === 'error' 
    ? locale === 'ar' 
      ? "فشل تحميل بيانات الخدمة، يرجى المحاولة مرة أخرى" 
      : "Failed to load service details, please try again"
    : null;

  return { 
    service, 
    loading, 
    error: errorMessage, 
    refetch
  };
}; 