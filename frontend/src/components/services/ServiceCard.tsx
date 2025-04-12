import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Service, fixImageUrl } from '@/hooks/useServices';
import { useQueryClient } from 'react-query';
import axios from 'axios';
import OptimizedImage from '../common/OptimizedImage';

// Track loaded images and preloaded services globally across all components
const loadedImages = typeof window !== 'undefined' ? new Set<string>() : new Set();
const preloadedServices = typeof window !== 'undefined' ? new Set<string>() : new Set();

// Helper function to get API base URL
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

interface ServiceCardProps {
  service: Service;
  priority?: boolean;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  service,
  priority = false
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isRtl = router.locale === 'ar';
  const [imageError, setImageError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isPreloaded, setIsPreloaded] = useState(false);
  const queryClient = useQueryClient();
  const preloadDivRef = useRef<HTMLDivElement | null>(null);

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  // Preload service details when the component mounts
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    // Check if this service has already been preloaded
    if (preloadedServices.has(service.slug)) {
      setIsPreloaded(true);
      return;
    }

    // Create a hidden div for preloading images that persists between renders
    if (!preloadDivRef.current) {
      const div = document.createElement('div');
      div.style.position = 'absolute';
      div.style.width = '0';
      div.style.height = '0';
      div.style.overflow = 'hidden';
      div.style.opacity = '0';
      div.setAttribute('aria-hidden', 'true');
      div.dataset.serviceSlug = service.slug;
      document.body.appendChild(div);
      preloadDivRef.current = div;
    }

    // Immediately preload image
    if (service.cover_image_url || service.image_url || service.image) {
      // Create and add an image element to the hidden div
      const imgElement = document.createElement('img');
      imgElement.src = fixImageUrl(service.cover_image_url || service.image_url || service.image || '');
      imgElement.alt = "Preload image";
      preloadDivRef.current?.appendChild(imgElement);
    }

    // Prefetch the service data
    const prefetchServiceData = async () => {
      try {
        const cachedData = queryClient.getQueryData(['serviceDetail', service.slug, router.locale]);
        
        if (!cachedData) {
          // Prefetch the Next.js page
          router.prefetch(`/services/${service.slug}`);
          
          // Fetch service data directly
          const API_BASE_URL = getApiBaseUrl();
          const locale = router.locale || 'en';
          const response = await axios.get(`${API_BASE_URL}/services/${service.slug}/?lang=${locale}`);
          const data = response.data;
          
          // Store processed data in React Query cache to make it available on the detail page
          queryClient.setQueryData(['serviceDetail', service.slug, locale], data);
          
          // Mark as preloaded
          preloadedServices.add(service.slug);
          setIsPreloaded(true);
        } else {
          // Already cached, mark as preloaded
          preloadedServices.add(service.slug);
          setIsPreloaded(true);
        }
      } catch (error) {
        console.error("Error prefetching service data:", error);
      }
    };
    
    // Start preloading
    prefetchServiceData();
    
    // Cleanup function
    return () => {
      // Keep the preload div for future use
    };
  }, [service.slug, service.image, service.image_url, service.cover_image_url, queryClient, router]);
  
  // Get image source for the service card
  const getImageSrc = () => {
    if (service.cover_image_url) {
      return service.cover_image_url;
    }
    
    if (service.image_url) {
      return service.image_url;
    }
    
    if (service.image) {
      return service.image;
    }
    
    // Fallback based on service category
    if (service.category && service.category.slug) {
      return `/images/${service.category.slug}.jpg`;
    }
    
    // Last resort fallback
    return '/images/service-placeholder.jpg';
  };
  
  // Determine icon to use
  const getIcon = () => {
    if (service.icon) {
      return service.icon;
    }
    
    // Some default icons based on common service categories
    const defaultIcons: { [key: string]: string } = {
      residential: 'home',
      commercial: 'building',
      office: 'briefcase',
      visualization: 'image',
      consultation: 'message-circle',
      design: 'pen-tool',
      renovation: 'tool',
      sustainable: 'leaf',
      default: 'grid'
    };
    
    if (service.category && service.category.slug && defaultIcons[service.category.slug]) {
      return defaultIcons[service.category.slug];
    }
    
    return defaultIcons.default;
  };
  
  return (
    <div 
      className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link href={`/services/${service.slug}`} prefetch={false}>
        <div className="relative h-48 w-full">
          <OptimizedImage
            src={fixImageUrl(getImageSrc())}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            onError={() => setImageError(true)}
            priority={priority}
          />
          
          {isHovering && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
              <span className="px-4 py-2 bg-brand-blue rounded">{t('services.viewDetails')}</span>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <div className={`w-12 h-12 bg-brand-blue-light/10 rounded-full flex items-center justify-center ${isRtl ? 'order-2' : 'order-1'}`}>
            <svg className="w-6 h-6 text-brand-blue-light" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              {getServiceIcon(getIcon())}
            </svg>
          </div>
          
          <div className={`${isRtl ? 'text-right order-1 flex-1 mr-3' : 'order-2 flex-1 ml-3'}`}>
            <Link 
              href={`/services/${service.slug}`}
              className="text-xl font-semibold text-gray-900 hover:text-brand-blue"
              prefetch={false}
            >
              {service.title}
            </Link>
            {service.category && (
              <p className="text-sm text-gray-500 mt-1">{service.category.name}</p>
            )}
          </div>
        </div>
        
        <p className={`text-gray-600 mt-2 line-clamp-3 ${isRtl ? 'text-right' : ''}`}>
          {service.short_description || service.description}
        </p>
        
        {(service.price || service.duration) && (
          <div className={`flex flex-wrap gap-2 mt-4 ${isRtl ? 'justify-end' : ''}`}>
            {service.price && (
              <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                {service.price} {service.price_unit || ''}
              </span>
            )}
            {service.duration && (
              <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                {service.duration}
              </span>
            )}
          </div>
        )}
        
        <div className={`mt-4 ${isRtl ? 'text-right' : ''}`}>
          <Link 
            href={`/services/${service.slug}`}
            className="text-brand-blue-light font-medium hover:underline inline-flex items-center"
            prefetch={false}
          >
            {isRtl ? (
              <>
                {t('services.learnMore')} <span className="ms-1">←</span>
              </>
            ) : (
              <>
                {t('services.learnMore')} <span className="ms-1">→</span>
              </>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

// Helper function to render SVG paths based on icon name
const getServiceIcon = (iconName: string): JSX.Element => {
  const icons: { [key: string]: JSX.Element } = {
    home: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
    ),
    building: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
    ),
    briefcase: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
    ),
    image: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
    ),
    'message-circle': (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
    ),
    'pen-tool': (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
    ),
    tool: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
    ),
    leaf: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path>
    ),
    grid: (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
    ),
  };
  
  return icons[iconName] || icons.grid;
};

export default ServiceCard; 