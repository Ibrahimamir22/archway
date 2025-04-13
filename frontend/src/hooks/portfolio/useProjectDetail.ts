import { useQuery } from 'react-query';
import axios from 'axios';
import { useRouter } from 'next/router';
import { Project } from './types';
import { getApiBaseUrl, fixImageUrl } from '../utils/useApi';

/**
 * Hook for fetching details of a specific project
 */
export const useProjectDetail = (slug: string) => {
  const router = useRouter();
  const { locale } = router;
  const API_BASE_URL = getApiBaseUrl();

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
      onSuccess: (data: Project | null) => {
        // Preload images when data is successfully fetched 
        if (typeof window !== 'undefined' && data?.images?.length) {
          // Force browser to load images by creating elements
          data.images.forEach(image => {
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