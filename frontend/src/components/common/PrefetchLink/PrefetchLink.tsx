import Link from 'next/link';
import { ComponentProps, ReactNode } from 'react';
import { usePrefetch } from '@/lib/hooks/utils';

export interface PrefetchLinkProps extends Omit<ComponentProps<typeof Link>, 'prefetch'> {
  children: ReactNode;
  prefetchType?: 'route' | 'data' | 'image';
  queryKey?: string[];
  prefetchDelay?: number;
  dataPrefetchPath?: string;
  prefetchEnabled?: boolean;
  className?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

/**
 * Enhanced Link component that prefetches routes or data on hover
 * Improves perceived performance by preloading resources before the user clicks
 */
export function PrefetchLink({
  children,
  href,
  prefetchType = 'route',
  queryKey,
  prefetchDelay = 50,
  dataPrefetchPath,
  prefetchEnabled = true,
  className,
  onMouseEnter: userOnMouseEnter,
  onMouseLeave: userOnMouseLeave,
  ...props
}: PrefetchLinkProps) {
  // Determine the path to prefetch
  const prefetchPath = 
    prefetchType === 'data' && dataPrefetchPath 
      ? dataPrefetchPath 
      : String(href);
  
  // Use the prefetch hook
  const { 
    handleMouseEnter, 
    handleMouseLeave,
    isHovering
  } = usePrefetch(prefetchPath, {
    type: prefetchType,
    queryKey,
    delay: prefetchDelay,
    enabled: prefetchEnabled
  });

  // Combine our hover handlers with any provided by the user
  const onMouseEnter = () => {
    handleMouseEnter();
    if (userOnMouseEnter) userOnMouseEnter();
  };

  const onMouseLeave = () => {
    handleMouseLeave();
    if (userOnMouseLeave) userOnMouseLeave();
  };

  return (
    <Link
      href={href}
      className={`${className || ''} ${isHovering ? 'is-hovering' : ''}`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      // Enable Next.js's default prefetch for better performance
      prefetch={true}
      {...props}
    >
      {children}
    </Link>
  );
}

export default PrefetchLink; 