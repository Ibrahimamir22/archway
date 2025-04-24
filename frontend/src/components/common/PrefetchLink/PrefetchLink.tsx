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
    
    return Promise.resolve();
  };
  
  // Use the prefetch hook with our prefetch function
  const { prefetchProps } = usePrefetch(handlePrefetch, {
    enabled: prefetch,
    delay: prefetchDelay,
    priority: prefetchPriority
  });
  
  return (
    <Link 
      href={href} 
      {...linkProps}
      {...prefetchProps}
    >
      {children}
    </Link>
  );
}; 