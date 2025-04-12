import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Project, fixImageUrl } from '@/hooks/useProjects';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';
import { useQueryClient } from 'react-query';
import axios from 'axios';

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
  
  // Prefetch project detail data and images on hover
  const prefetchProjectDetails = async () => {
    try {
      const API_BASE_URL = getApiBaseUrl();
      const locale = router.locale || 'en';
      const params = new URLSearchParams();
      params.append('lang', locale);
      
      // First, fetch project details for caching
      const projectData = await queryClient.fetchQuery(
        ['projectDetail', project.slug, locale],
        async () => {
          const response = await axios.get(`${API_BASE_URL}/projects/${project.slug}/?${params.toString()}`);
          return response.data;
        },
        { staleTime: 300000 }  // 5 minutes
      );
      
      // Then preload all images
      if (projectData && projectData.images) {
        projectData.images.forEach(async (image: any) => {
          const imgSrc = image.image_url || image.image;
          if (imgSrc) {
            const imgUrl = fixImageUrl(imgSrc);
            // Use window.Image constructor to avoid TypeScript error
            const img = new window.Image();
            img.src = imgUrl;
          }
        });
      }
    } catch (error) {
      console.error('Error prefetching project details:', error);
    }
  };
  
  // Handle hover events 
  const handleMouseEnter = () => {
    setIsHovering(true);
    prefetchProjectDetails();
  };
  
  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  
  // Simple and reliable image URL handling
  const getImageUrl = () => {
    if (imageError) {
      return '/images/placeholder.jpg';
    }
    
    // Use the absolute URL from the API if available
    if (project.cover_image_url) {
      return fixImageUrl(project.cover_image_url);
    }
    
    // If cover_image is available, use it
    if (project.cover_image) {
      return fixImageUrl(project.cover_image);
    }
    
    // Default fallback
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
            <img
              src={getImageUrl()}
              alt={project.title}
              className="absolute inset-0 w-full h-full object-cover"
              onError={() => setImageError(true)}
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