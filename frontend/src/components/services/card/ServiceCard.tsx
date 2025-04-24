'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { Service } from '@/lib/hooks/services/types';
import ServiceCardImage from './ServiceCardImage';
import ServiceCardContent from './ServiceCardContent';
import { PrefetchLink } from '@/components/common/PrefetchLink';
import { preloadImage } from '@/lib/imageLoader';

// Global tracking for preloaded services
const preloadedServices = typeof window !== 'undefined' ? new Set<string>() : new Set();

interface ServiceCardProps {
  service: Service;
  priority?: boolean;
  className?: string;
  otherServices?: Service[]; // Optional related services for intelligent prefetching
  category?: string; // Service category for related services prefetching
}

/**
 * A complete service card component that displays a service
 * Composed of image and content sections with prefetching capabilities
 */
const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  priority = false,
  className = '',
  otherServices = [],
  category
}) => {
  const params = useParams();
  const locale = params?.locale ? String(params.locale) : 'en';
  const [isClient, setIsClient] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [imagePreloaded, setImagePreloaded] = useState(false);

  // Set client-side state to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Extract image URL for preloading
  const getServiceImageUrl = useCallback(() => {
    if (!service) return null;
    return service.cover_image_url || service.image_url || service.cover_image || service.image || null;
  }, [service]);

  // Preload service image when component mounts if priority is true
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    if (priority && !imagePreloaded) {
      const imageUrl = getServiceImageUrl();
      if (imageUrl) {
        preloadImage(imageUrl).then(() => {
          setImagePreloaded(true);
        }).catch(error => {
          console.error("Error preloading service image:", error);
        });
      }
    }
  }, [priority, imagePreloaded, getServiceImageUrl]);

  // Preload related service images when hovering
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;

    if (isHovering && otherServices.length > 0) {
      try {
        // Find services in same category - most likely to be viewed next
        const relatedServices = category 
          ? otherServices.filter(s => s.category === category && s.id !== service.id).slice(0, 2) 
          : otherServices.slice(0, 2);
        
        // Preload the first 2 related services' images
        if (relatedServices.length > 0) {
          relatedServices.forEach(relatedService => {
            const imageUrl = relatedService.cover_image_url || 
                            relatedService.image_url || 
                            relatedService.cover_image || 
                            relatedService.image;
            
            if (imageUrl && !preloadedServices.has(relatedService.id)) {
              preloadImage(imageUrl).then(() => {
                preloadedServices.add(relatedService.id);
              }).catch(err => {
                console.warn("Failed to preload related service image:", err);
              });
            }
          });
        }
      } catch (error) {
        console.error("Error preloading related service images:", error);
      }
    }
  }, [isHovering, otherServices, category, service.id]);

  // Debug service info - only client side
  useEffect(() => {
    // Skip on server side
    if (!isClient) return;

    console.log(`Rendering ServiceCard for ${service?.title}:`, {
      is_featured: service?.is_featured,
      is_published: service?.is_published,
      slug: service?.slug
    });
  }, [service, isClient]);
  
  // Prepare API path for prefetching service details
  const serviceDetailPath = `/api/services/${service.slug}`;
  
  // Prepare API paths for related content
  const categoryServicePath = category ? `/api/services?category=${category}` : null;
  
  if (!service?.slug) {
    return null;
  }
  
  // Handle mouse events with debounce for better performance
  const handleMouseEnter = () => {
    setIsHovering(true);
    
    // Preload the main image if not already done
    if (isClient && !imagePreloaded) {
      const imageUrl = getServiceImageUrl();
      if (imageUrl) {
        preloadImage(imageUrl).then(() => {
          setImagePreloaded(true);
        }).catch(error => {
          console.error("Error preloading service image on hover:", error);
        });
      }
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // To prevent hydration mismatch, render a simplified version on server
  if (!isClient) {
    return (
      <div className={`block bg-white rounded-lg shadow-md overflow-hidden relative max-w-sm mx-auto h-full ${className}`}>
        <div className="aspect-w-3 aspect-h-2 overflow-hidden rounded-t-lg relative h-48"></div>
        <div className="p-4"></div>
      </div>
    );
  }
  
  return (
    <PrefetchLink 
      href={`/${locale}/services/${service.slug}`}
      prefetchType="data"
      dataPrefetchPath={serviceDetailPath}
      queryKey={['service', service.slug, locale]}
      prefetchDelay={50} 
      className={`block bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg cursor-pointer relative max-w-sm mx-auto h-full ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Featured badge - REMOVED */}
      {/* 
      {service.is_featured && (
        <div className="absolute top-2 right-2 z-10 bg-brand-accent text-white px-2 py-1 text-xs rounded-full shadow-md">
          Featured
        </div>
      )}
      */}
      
      <ServiceCardImage 
        service={service} 
        priority={priority}
        isHovering={isHovering}
      />
      <ServiceCardContent service={service} locale={locale} />
    </PrefetchLink>
  );
};

export default ServiceCard; 