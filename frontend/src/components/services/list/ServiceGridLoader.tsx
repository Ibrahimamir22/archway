'use client';

import { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { getApiBaseUrl } from '@/lib/api';
import { Service } from '@/lib/hooks/services/types';
import ServiceGridClient from './ServiceGridClient';

interface ServiceGridLoaderProps {
  initialServices: Service[];
  hasNextPage: boolean;
  category?: string;
  featured?: boolean;
  limit?: number;
  lang?: string;
}

interface ServicesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Service[];
}

/**
 * Client component that handles pagination and loading more services
 * Works with the server-rendered initial page of services
 */
export default function ServiceGridLoader({
  initialServices,
  hasNextPage: initialHasNextPage,
  category,
  featured = false,
  limit = 12,
  lang = 'en'
}: ServiceGridLoaderProps) {
  const [allServices, setAllServices] = useState<Service[]>(initialServices);
  const API_BASE_URL = getApiBaseUrl();

  // Function to fetch more services from API for pagination
  const fetchServices = async ({ pageParam = 2 }) => {
    // Build query parameters
    const params = new URLSearchParams();
    
    if (category) {
      params.append('category__slug', category);
    }
    
    if (featured) {
      params.append('is_featured', 'true');
    }
    
    params.append('limit', limit.toString());
    params.append('lang', lang);
    params.append('page', pageParam.toString());
    
    try {
      const response = await axios.get<ServicesResponse>(
        `${API_BASE_URL}/services/?${params.toString()}`
      );
      
      return response.data;
    } catch (error) {
      console.error('Error fetching services:', error);
      throw error;
    }
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch
  } = useInfiniteQuery({
    queryKey: ['services', { category, featured, limit, lang }],
    queryFn: fetchServices,
    initialPageParam: 2, // Start from page 2 since page 1 is server-rendered
    getNextPageParam: (lastPage: ServicesResponse) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        return url.searchParams.get('page');
      }
      return undefined;
    },
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 60000,
    enabled: initialHasNextPage, // Only run the query if there are more pages
  });

  // Update allServices when new data is fetched
  useEffect(() => {
    if (data?.pages) {
      const newServices = data.pages.flatMap((page: ServicesResponse) => page?.results || []);
      setAllServices([...initialServices, ...newServices]);
    }
  }, [data, initialServices]);

  return (
    <ServiceGridClient
      services={allServices}
      loading={status === 'loading' && allServices.length === 0}
      error={status === 'error' ? error : null}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      onRetry={refetch}
      locale={lang}
    />
  );
} 