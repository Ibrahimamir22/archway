import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Project, fixImageUrl } from '@/hooks';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { useQueryClient } from 'react-query';
import axios from 'axios';
import OptimizedImage from '../common/OptimizedImage';
import { getCoverImageUrl } from '@/data/placeholders/projectPlaceholders';

// Track loaded images globally across all components
const loadedImages = typeof window !== 'undefined' ? new Set<string>() : new Set();
const preloadedProjects = typeof window !== 'undefined' ? new Set<string>() : new Set();

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
  const [isPreloaded, setIsPreloaded] = useState(false);
  const queryClient = useQueryClient();
  const preloadDivRef = useRef<HTMLDivElement | null>(null);
  
  // Get translated project title
  const getProjectTitle = () => {
    return t(`projects.${project.slug}`, { defaultValue: project.title });
  };
  
  // Get translated project description
  const getProjectDescription = () => {
    return t(`descriptions.${project.slug}`, { defaultValue: project.description });
  };
  
  // Get translated category name
  const getCategoryName = () => {
    return t(`categories.${project.category.slug}`, { defaultValue: project.category.name });
  };
  
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

  // Preload images when the component mounts
  useEffect(() => {
    // Check if this project has already been preloaded
    if (preloadedProjects.has(project.slug)) {
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
      div.dataset.projectSlug = project.slug;
      document.body.appendChild(div);
      preloadDivRef.current = div;
    }

    // Immediately preload cover image
    if (project.cover_image_url || project.cover_image) {
      const img = new Image();
      img.src = fixImageUrl(project.cover_image_url || project.cover_image || '');
      preloadDivRef.current.appendChild(img);
    }

    // Prefetch the project data and preload all images
    const prefetchProjectData = async () => {
      try {
        const cachedData = queryClient.getQueryData(['projectDetail', project.slug, router.locale]);
        
        if (!cachedData) {
          // Prefetch the Next.js page
          router.prefetch(`/portfolio/${project.slug}`);
          
          // Fetch project data directly
          const API_BASE_URL = getApiBaseUrl();
          const locale = router.locale || 'en';
          const response = await axios.get(`${API_BASE_URL}/projects/${project.slug}/?lang=${locale}`);
          const data = response.data;
          
          if (data.images && Array.isArray(data.images)) {
            // Process and preload all images
            data.images.forEach((img: any) => {
              // Get normalized image URL
              let imgSrc = img.image_url || img.image;
              if (!imgSrc) return;
              
              // Use our consistent fixImageUrl function
              const normalizedSrc = fixImageUrl(imgSrc);
              
              // Create an actual Image object for more reliable loading
              const imageObj = new Image();
              imageObj.src = normalizedSrc;
              
              // Add to hidden div to ensure images are kept in cache
              if (preloadDivRef.current) {
                const imgElement = document.createElement('img');
                imgElement.src = normalizedSrc;
                imgElement.alt = "Preload";
                preloadDivRef.current.appendChild(imgElement);
              }
            });
            
            // Store processed data in React Query cache to make it available on the detail page
            const processedData = {
              ...data,
              images: data.images.map((img: any) => ({
                ...img,
                src: fixImageUrl(img.image_url || img.image || ''),
                alt: img.alt_text || project.title,
                isCover: img.is_cover
              }))
            };
            
            queryClient.setQueryData(['projectDetail', project.slug, locale], processedData);
            preloadedProjects.add(project.slug);
            setIsPreloaded(true);
          }
        } else {
          setIsPreloaded(true);
        }
      } catch (error) {
        console.error('Error preloading project data:', error);
      }
    };
    
    // Start preloading after a slight delay
    const timerId = setTimeout(prefetchProjectData, 100);
    
    // Cleanup function
    return () => {
      clearTimeout(timerId);
    };
  }, [project.slug, project.cover_image, project.cover_image_url, queryClient, router]);
  
  // Add mouse enter/leave effects
  const handleMouseEnter = () => {
    setIsHovering(true);
    // Immediately trigger navigation prefetch as a backup
    router.prefetch(`/portfolio/${project.slug}`);
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
        <Link href={`/portfolio/${project.slug}`} prefetch={true}>
          <div className="relative h-48 w-full">
            <OptimizedImage
              src={getImageSrc()}
              alt={getProjectTitle()}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              onError={() => setImageError(true)}
              priority={true} // Always use priority for these images
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
                prefetch={true}
              >
                {getProjectTitle()}
              </Link>
              <p className="text-sm text-gray-500 mt-1">{getCategoryName()}</p>
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
            {getProjectDescription()}
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
              prefetch={true}
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