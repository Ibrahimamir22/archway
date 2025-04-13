import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { validateServiceSlug, validateProjectSlug } from '@/utils/urls';

interface ServiceLinkProps {
  slug: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
}

/**
 * A robust Link component for Service pages that handles slug collisions
 * If the slug exists as a project but not as a service, it redirects to the project
 */
const ServiceLink: React.FC<ServiceLinkProps> = ({
  slug,
  children,
  className = '',
  prefetch = false
}) => {
  const router = useRouter();
  const [isValidated, setIsValidated] = useState(false);
  const [isValidService, setIsValidService] = useState(true);
  
  // Validate service slug to make sure we don't have a collision
  useEffect(() => {
    // Only validate once
    if (isValidated || !slug) return;

    const validateLink = async () => {
      try {
        // First check if it's a valid service
        const isService = await validateServiceSlug(slug, router.locale);
        
        // If not a service, check if it's a project (potential collision)
        if (!isService) {
          const isProject = await validateProjectSlug(slug, router.locale);
          
          // Mark as invalid service if it's actually a project
          if (isProject) {
            console.warn(`Service slug "${slug}" collides with a project slug`);
            setIsValidService(false);
          }
        }
        
        setIsValidated(true);
      } catch (error) {
        console.error("Error validating service:", error);
      }
    };
    
    validateLink();
  }, [slug, router.locale, isValidated]);
  
  // Custom link handler to make sure we're going to the right place
  const handleServiceClick = async (e: React.MouseEvent) => {
    // If we've already checked and it's not a valid service, prevent default routing
    if (isValidated && !isValidService) {
      e.preventDefault();
      
      // Try to find the correct route using the API
      try {
        // Check if it's a project with the same slug
        const isProject = await validateProjectSlug(slug, router.locale);
        if (isProject) {
          router.push(`/portfolio/${slug}`);
          return;
        }
      } catch (error) {
        console.error("Error validating route:", error);
      }
      
      // If all else fails, just go to services page
      router.push('/services');
    }
  };
  
  return (
    <Link 
      href={`/services/${slug}`}
      className={className}
      prefetch={prefetch}
      onClick={handleServiceClick}
    >
      {children}
    </Link>
  );
};

export default ServiceLink; 