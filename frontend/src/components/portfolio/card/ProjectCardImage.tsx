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
    if (project.cover_image_url) {
      return project.cover_image_url;
    }
    
    if (project.cover_image) {
      return project.cover_image;
    }
    
    if (project.image) {
      return project.image;
    }
    
    if (project.images && Array.isArray(project.images) && project.images.length > 0) {
      return project.images[0].src || project.images[0].image_url || project.images[0].image || '/images/placeholder.jpg';
    }
    
    return '/images/placeholder.jpg';
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