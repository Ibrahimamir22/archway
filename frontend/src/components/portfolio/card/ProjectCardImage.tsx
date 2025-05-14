'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Project } from '@/lib/hooks';
import OptimizedImage from '../../common/OptimizedImage/index';
import PrefetchLink from '../../common/PrefetchLink';

interface ProjectCardImageProps {
  project: Project;
}

const ProjectCardImage: React.FC<ProjectCardImageProps> = ({ project }) => {
  const [imageError, setImageError] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const params = useParams();
  const locale = params?.locale ? String(params.locale) : 'en';
  
  // Get translations
  const tPortfolio = useTranslations('portfolio');
  const tRoot = useTranslations();
  
  const getProjectTitle = () => {
    return tRoot(`projects.${project.slug}`, undefined, { defaultValue: project.title });
  };
  
  // Get image source with fallbacks
  const getImageSrc = () => {
    let originalUrl = "";
    
    if (project.cover_image_url) {
      originalUrl = project.cover_image_url;
    } else if (project.cover_image) {
      originalUrl = project.cover_image;
    } else if (project.image) {
      originalUrl = project.image;
    } else if (project.images && Array.isArray(project.images) && project.images.length > 0) {
      originalUrl = project.images[0].src || project.images[0].image_url || project.images[0].image || '';
    }
    
    if (!originalUrl) {
      return '/images/placeholder.jpg';
    }
    
    // For Django media files, always use our image proxy
    if (
      originalUrl.includes('/media/') || 
      originalUrl.includes('backend:8000') || 
      originalUrl.includes('localhost:8000')
    ) {
      // Extract the media path
      let mediaPath = "";
      
      if (originalUrl.includes('/media/')) {
        // Extract everything after '/media/'
        const parts = originalUrl.split('/media/');
        if (parts.length > 1) {
          mediaPath = '/media/' + parts[1];
        } else {
          mediaPath = '/media/' + originalUrl;
        }
      } else {
        // If no /media/ in URL, use the full path
        mediaPath = originalUrl;
      }
      
      // Use the image proxy API
      return `/api/image-proxy?path=${encodeURIComponent(mediaPath)}`;
    } else if (originalUrl.startsWith('http')) {
      // Direct external URLs can be used as-is
      return originalUrl;
    } else {
      // Local asset path (starting with '/' or not)
      return originalUrl.startsWith('/') ? originalUrl : `/${originalUrl}`;
    }
  };
  
  const handleMouseEnter = () => setIsHovering(true);
  const handleMouseLeave = () => setIsHovering(false);
  
  // Prepare API path for prefetching project details
  const projectDetailPath = `/api/portfolio/${project.slug}`;
  
  return (
    <PrefetchLink 
      href={`/${locale}/portfolio/${project.slug}`}
      prefetchType="data"
      dataPrefetchPath={projectDetailPath}
      queryKey={['project', project.slug, locale]}
      prefetchDelay={50} // Reduced delay for better responsiveness
    >
      <div 
        className="relative h-48 w-full"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <OptimizedImage
          src={getImageSrc()}
          alt={getProjectTitle()}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          onError={() => setImageError(true)}
          priority={false} // Changed to false since we'll prefetch on hover
        />
        
        {isHovering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white">
            <span className="px-4 py-2 bg-brand-blue rounded">{tPortfolio('viewDetails')}</span>
          </div>
        )}
      </div>
    </PrefetchLink>
  );
};

export default ProjectCardImage; 