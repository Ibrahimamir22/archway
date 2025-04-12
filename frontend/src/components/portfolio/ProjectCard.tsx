import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Project } from '@/hooks/useProjects';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { useQueryClient } from 'react-query';
import axios from 'axios';
import OptimizedImage from '../common/OptimizedImage';

// Track loaded images globally across all components
const loadedImages = typeof window !== 'undefined' ? new Set<string>() : new Set();

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

interface ProjectCardProps {
  project: Project;
  onSaveToFavorites?: (projectId: string) => void;
  isAuthenticated?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSaveToFavorites,
  isAuthenticated = false
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isRtl = router.locale === 'ar';
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const queryClient = useQueryClient();
  
  const handleSaveClick = () => {
    if (isAuthenticated && onSaveToFavorites) {
      onSaveToFavorites(project.id);
    } else {
      setShowAuthModal(true);
    }
  };
  
  const closeModal = () => {
    setShowAuthModal(false);
  };
  
  const navigateToSignup = () => {
    router.push('/signup');
  };
  
  // Add aggressive preloading on hover
  const handleMouseEnter = async () => {
    setIsHovering(true);
    
    // Prefetch the project detail page
    router.prefetch(`/portfolio/${project.slug}`);
    
    // Aggressive image preloading
    try {
      // Check if we already have the data
      const cachedData = queryClient.getQueryData(['projectDetail', project.slug, router.locale]);
      
      if (!cachedData) {
        console.log(`Preloading images for project: ${project.slug}`);
        
        // Create a hidden div for image preloading
        const preloadDiv = document.createElement('div');
        preloadDiv.style.position = 'absolute';
        preloadDiv.style.width = '0';
        preloadDiv.style.height = '0';
        preloadDiv.style.overflow = 'hidden';
        preloadDiv.style.opacity = '0';
        document.body.appendChild(preloadDiv);
        
        // Fetch project data directly without waiting for navigation
        const API_BASE_URL = getApiBaseUrl();
        const locale = router.locale || 'en';
        const response = await axios.get(`${API_BASE_URL}/projects/${project.slug}/?lang=${locale}`);
        const data = response.data;
        
        if (data.images && Array.isArray(data.images)) {
          // Preload all project images aggressively
          data.images.forEach((img: any) => {
            const imgSrc = img.image_url || img.image;
            if (!imgSrc) return;
            
            // Create a normalized URL
            let normalizedSrc = imgSrc;
            if (normalizedSrc.includes('backend:8000')) {
              normalizedSrc = normalizedSrc.replace(/backend:8000/g, 'localhost:8000');
            } else if (normalizedSrc.startsWith('/media/')) {
              normalizedSrc = `http://localhost:8000${normalizedSrc}`;
            } else if (normalizedSrc.startsWith('media/')) {
              normalizedSrc = `http://localhost:8000/${normalizedSrc}`;
            }
            
            // Create a real image element to ensure browser caches it
            const imgElement = document.createElement('img');
            imgElement.src = normalizedSrc;
            preloadDiv.appendChild(imgElement);
            
            // Also create an actual Image object for more reliable loading
            const imageObj = new Image();
            imageObj.src = normalizedSrc;
            
            console.log(`Preloading image ${normalizedSrc} for slug ${project.slug}`);
          });
          
          // Cache the project data using React Query
          queryClient.setQueryData(['projectDetail', project.slug, locale], data);
        }
        
        // Keep preload div in the DOM to ensure images stay cached
        setTimeout(() => {
          if (document.body.contains(preloadDiv)) {
            document.body.removeChild(preloadDiv);
          }
        }, 5000);
      }
    } catch (error) {
      console.error('Error preloading project images:', error);
    }
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
  // Get image source for the project card with improved error handling
  const getImageSrc = () => {
    // Check for specific problematic hash patterns in image URLs
    const containsUUIDHash = (url: string): boolean => {
      if (!url) return false;
      const hashPattern = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/;
      return hashPattern.test(url);
    };

    // Prioritize cover_image_url if available and not containing problematic UUID
    if (project.cover_image_url && !containsUUIDHash(project.cover_image_url)) {
      return project.cover_image_url;
    }
    
    // Next try cover_image if available and not containing problematic UUID
    if (project.cover_image && !containsUUIDHash(project.cover_image)) {
      return project.cover_image;
    }
    
    // If we have an image property without problematic UUID, use that
    if (project.image && !containsUUIDHash(project.image)) {
      return project.image;
    }
    
    // If we have images array, find a non-UUID one or use the first one
    if (project.images && Array.isArray(project.images) && project.images.length > 0) {
      // Try to find a non-UUID image first
      const safeImage = project.images.find((img: any) => 
        img.image_url && !containsUUIDHash(img.image_url)
      );
      
      if (safeImage) {
        return safeImage.image_url || safeImage.image;
      }
      
      // If all have UUIDs, use the first one anyway
      if (project.images[0].image_url || project.images[0].image) {
        return project.images[0].image_url || project.images[0].image;
      }
    }
    
    // Last resort fallback
    return '/images/placeholder.jpg';
  };
  
  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link href={`/portfolio/${project.slug}`}>
          <div className="relative h-48 w-full">
            <OptimizedImage
              src={getImageSrc()}
              alt={project.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              onError={() => setImageError(true)}
              priority={isHovering} // Add priority when hovering
            />
            
            {isHovering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
                <span className="px-4 py-2 bg-brand-blue rounded">{t('portfolio.viewDetails')}</span>
              </div>
            )}
          </div>
        </Link>
        
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className={isRtl ? 'text-right' : ''}>
              <Link 
                href={`/portfolio/${project.slug}`}
                className="text-xl font-semibold text-gray-900 hover:text-brand-blue"
              >
                {project.title}
              </Link>
              <p className="text-sm text-gray-500 mt-1">{project.category.name}</p>
            </div>
            
            <button
              onClick={handleSaveClick}
              className="p-2 text-gray-400 hover:text-brand-accent transition-colors"
              aria-label={t('portfolio.saveToFavorites')}
              title={t('portfolio.saveToFavorites')}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
          
          <p className={`text-gray-600 mt-2 line-clamp-2 ${isRtl ? 'text-right' : ''}`}>
            {project.description}
          </p>
          
          <div className={`flex flex-wrap gap-2 mt-4 ${isRtl ? 'justify-end' : ''}`}>
            {project.tags.map(tag => (
              <span 
                key={tag.id} 
                className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
              >
                {tag.name}
              </span>
            ))}
          </div>
          
          <div className={`mt-4 ${isRtl ? 'text-right' : ''}`}>
            <Link 
              href={`/portfolio/${project.slug}`}
              className="text-brand-blue-light font-medium hover:underline inline-flex items-center"
            >
              {isRtl ? (
                <>
                  {t('portfolio.viewDetails')} <span className="ms-1">←</span>
                </>
              ) : (
                <>
                  {t('portfolio.viewDetails')} <span className="ms-1">→</span>
                </>
              )}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Auth modal */}
      <Modal
        isOpen={showAuthModal}
        onClose={closeModal}
        title={t('portfolio.saveToFavorites')}
        rtl={isRtl}
      >
        <div className={isRtl ? 'text-right' : ''}>
          <p className="mb-6">{t('portfolio.signupPrompt')}</p>
          <div className={`flex ${isRtl ? 'justify-start' : 'justify-end'}`}>
            <Button
              onClick={closeModal}
              variant="outline"
              className={isRtl ? 'ms-2' : 'me-2'}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={navigateToSignup}
              variant="primary"
            >
              {t('auth.signup')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProjectCard; 