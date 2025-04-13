import React from 'react';
import Link from 'next/link';

interface ServiceLinkProps {
  slug: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
  onClick?: () => void;
}

/**
 * Simple link component for services
 */
const ServiceLink: React.FC<ServiceLinkProps> = ({
  slug,
  children,
  className = '',
  prefetch = false,
  onClick
}) => {
  // Simple click handler
  const handleClick = (e: React.MouseEvent) => {
    // Call the provided onClick handler if any
    onClick?.();
  };
  
  return (
    <Link 
      href={`/services/${slug}`}
      className={className}
      prefetch={prefetch}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};

export default ServiceLink; 