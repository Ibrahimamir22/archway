import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import axios from 'axios';
import { Service } from '@/@types/services';
import { getApiBaseUrl } from '@/utils/urls';
import ServiceCardImage from './ServiceCardImage';
import ServiceCardContent from './ServiceCardContent';

// Global tracking for preloaded services
const preloadedServices = typeof window !== 'undefined' ? new Set<string>() : new Set();

interface ServiceCardProps {
  service: Service;
  priority?: boolean;
  className?: string;
}

/**
 * A complete service card component that displays a service
 * Composed of image and content sections, with smart preloading
 */
const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  priority = false,
  className = ''
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // Preload service data for better UX
  useEffect(() => {
    if (preloadedServices.has(service.slug)) {
      return;
    }

    // Mark as preloaded to avoid duplicate work
    preloadedServices.add(service.slug);

    // Prefetch API data
    const prefetchData = async () => {
      try {
        const API_BASE_URL = getApiBaseUrl();
        const response = await axios.get(`${API_BASE_URL}/services/${service.slug}/?lang=${router.locale || 'en'}`);
        queryClient.setQueryData(['serviceDetail', service.slug, router.locale], response.data);
      } catch (error) {
        console.error("Error prefetching service:", error);
      }
    };
    
    prefetchData();
    
    // Prefetch the service detail page
    router.prefetch(`/services/${service.slug}`);
  }, [service.slug, router, queryClient, router.locale]);
  
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg ${className}`}>
      <ServiceCardImage 
        service={service} 
        priority={priority}
      />
      <ServiceCardContent service={service} />
    </div>
  );
};

export default ServiceCard; 