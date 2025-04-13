import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import OptimizedImage from '@/components/common/OptimizedImage/index';
import { useProjectImages } from '@/hooks';
import DirectProjectImage from './DirectProjectImage';

interface ProjectImage {
  id: string;
  src: string;
  alt: string;
  isCover?: boolean;
}

interface ProjectGalleryProps {
  images: ProjectImage[];
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ images }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isRtl = router.locale === 'ar';
  
  const {
    getFilteredImages,
    handleImageError,
    handleImageLoad,
    getImageSrc
  } = useProjectImages();
  
  const filteredImages = getFilteredImages(images);
  const galleryImages = filteredImages.filter(image => !image.isCover);
  
  if (galleryImages.length === 0) return null;
  
  return (
    <div className={`${isRtl ? 'text-right' : ''}`}>
      <h2 className="text-2xl font-heading font-semibold mb-6">{t('projectGallery')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {galleryImages.map((image, index) => (
          <div key={image.id} className="relative h-64 rounded-lg overflow-hidden shadow-md bg-gray-100" suppressHydrationWarning>
            <DirectProjectImage
              src={getImageSrc(image)}
              alt={image.alt || `Project image ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectGallery; 