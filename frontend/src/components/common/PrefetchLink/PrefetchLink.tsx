import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePrefetch } from '@/lib/hooks/ui';

export interface PrefetchLinkProps extends React.ComponentPropsWithoutRef<typeof Link> {
  /**
   * Additional data prefetch function (beyond Next.js' built-in route prefetching)
   */
  prefetchData?: () => Promise<any>;
  
  /**
   * Whether to prefetch the route and data
   */
  prefetch?: boolean;
  
  /**
   * Delay in milliseconds before prefetching starts (default: 150ms)
   */
  prefetchDelay?: number;
  
  /**
   * Priority for prefetching (affects timing)
   */
  prefetchPriority?: 'low' | 'medium' | 'high';
  
  /**
   * Type of prefetch (data, route, or both)
   * This is used internally and not passed to the DOM
   */
  prefetchType?: 'data' | 'route' | 'both';
  
  /**
   * Path to API endpoint for data prefetching
   * This is used internally and not passed to the DOM
   */
  dataPrefetchPath?: string;
  
  /**
   * Query key for caching prefetched data
   * This is used internally and not passed to the DOM
   */
  queryKey?: string[];
  
  /**
   * Children elements
   */
  children: React.ReactNode;
}

/**
 * Enhanced Link component that prefetches both routes and data
 * 
 * Uses Next.js built-in prefetching plus custom data prefetching
 */
export const PrefetchLink: React.FC<PrefetchLinkProps> = ({
  href,
  prefetchData,
  prefetch = true,
  prefetchDelay,
  prefetchPriority = 'medium',
  prefetchType,
  dataPrefetchPath,
  queryKey,
  children,
  ...linkProps
}) => {
  const router = useRouter();
  
  // Function that both prefetches the route and any data
  const handlePrefetch = async () => {
    // Prefetch the route using Next.js router
    if (typeof href === 'string') {
      router.prefetch(href);
    }
    
    // If a data prefetch function is provided, call it
    if (prefetchData) {
      return prefetchData();
    }
    
    // Custom prefetching logic using provided paths
    if (dataPrefetchPath && (prefetchType === 'data' || prefetchType === 'both')) {
      // This is just a placeholder - in a real implementation,
      // this would use something like React Query's prefetchQuery
      // or a custom fetch implementation
      try {
        const response = await fetch(dataPrefetchPath);
        if (!response.ok) throw new Error('Failed to prefetch data');
        await response.json();
      } catch (err) {
        // Silently handle prefetch errors - they shouldn't break the UI
        console.warn('Data prefetch failed:', err);
      }
    }
    
    return Promise.resolve();
  };
  
  // Use the prefetch hook with our prefetch function
  const { prefetchProps } = usePrefetch(handlePrefetch, {
    enabled: prefetch,
    delay: prefetchDelay,
    priority: prefetchPriority
  });
  
  // Filter out custom props before passing to Link
  const sanitizedPrefetchProps = { ...prefetchProps };
  
  // Remove any non-standard DOM properties before passing to Link
  if ('prefetchType' in sanitizedPrefetchProps) delete sanitizedPrefetchProps.prefetchType;
  if ('dataPrefetchPath' in sanitizedPrefetchProps) delete sanitizedPrefetchProps.dataPrefetchPath;
  if ('queryKey' in sanitizedPrefetchProps) delete sanitizedPrefetchProps.queryKey;
  
  return (
    <Link 
      href={href} 
      {...linkProps}
      {...sanitizedPrefetchProps}
    >
      {children}
    </Link>
  );
}; 