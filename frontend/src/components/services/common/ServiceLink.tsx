import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { validateServiceSlug, validateProjectSlug, getCorrectRoute } from '@/lib/api';

interface ServiceLinkProps {
  slug: string;
  children: React.ReactNode;
  className?: string;
  prefetch?: boolean;
}

/**
 * A specialized Link component for Service pages that handles project/service slug collisions
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
  const [isProject, setIsProject] = useState(false);
  const [correctPath, setCorrectPath] = useState<string | null>(null);
  
  // Validate service slug to make sure we don't have a collision
  useEffect(() => {
    // Only validate once
    if (isValidated || !slug) return;

    const validateLink = async () => {
      try {
        // First check if it's a valid project (to catch collisions early)
        const projectExists = await validateProjectSlug(slug, router.locale);
        
        if (projectExists) {
          console.warn(`Service slug "${slug}" collides with a project slug`);
          setIsProject(true);
          setCorrectPath(`/portfolio/${slug}`);
        }
        
        // Then check if it's a valid service
        const isService = await validateServiceSlug(slug, router.locale);
        setIsValidService(isService);
        
        // If we don't have a correct path yet, try to get one
        if (!correctPath) {
          const correctRoute = await getCorrectRoute(slug, router.locale);
          setCorrectPath(correctRoute);
        }
        
        setIsValidated(true);
      } catch (error) {
        console.error("Error validating service:", error);
        setIsValidated(true); // Mark as validated even on error to prevent infinite retries
      }
    };
    
    validateLink();
  }, [slug, router.locale, isValidated, correctPath]);
  
  // Custom link handler to make sure we're going to the right place
  const handleServiceClick = async (e: React.MouseEvent) => {
    // If we've already checked and it's not a valid service or is a project, prevent default routing
    if (isValidated && (!isValidService || isProject)) {
      e.preventDefault();
      
      // If we know the correct path, use it
      if (correctPath) {
        router.push(correctPath);
        return;
      }
      
      // If we know it's a project, redirect directly
      if (isProject) {
        router.push(`/portfolio/${slug}`);
        return;
      }
      
      // If not a valid service and we're not sure if it's a project, check again
      if (!isValidService) {
        try {
          // Try projectExists one more time as a fallback
          const projectExists = await validateProjectSlug(slug, router.locale);
          if (projectExists) {
            router.push(`/portfolio/${slug}`);
            return;
          }
          
          // Get the correct route one more time
          const correctRoute = await getCorrectRoute(slug, router.locale);
          if (correctRoute !== '/') {
            router.push(correctRoute);
            return;
          }
        } catch (error) {
          console.error("Error validating route:", error);
        }
        
        // If all else fails, just go to services page
        router.push('/services');
      }
    }
  };
  
  // Determine the correct href to use
  const getHref = () => {
    // If we know it's a project, link directly to portfolio
    if (isProject) {
      return `/portfolio/${slug}`;
    }
    
    // If we know the correct path, use it
    if (correctPath) {
      return correctPath;
    }
    
    // Default to services path
    return `/services/${slug}`;
  };
  
  return (
    <Link 
      href={getHref()}
      className={className}
      prefetch={prefetch}
      onClick={handleServiceClick}
    >
      {children}
    </Link>
  );
};

export default ServiceLink; 