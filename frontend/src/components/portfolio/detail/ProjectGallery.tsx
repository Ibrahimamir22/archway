'use client';

import React, { useState, useEffect } from 'react';
// import { useTranslation } from 'next-i18next';
// import { useRouter } from 'next/router';
import { useTranslations } from 'next-intl';
import OptimizedImage from '@/components/common/OptimizedImage/index';
// import { useProjectImages } from '@/lib/hooks';
import DirectProjectImage from '../common/DirectProjectImage';
// Import from the new dedicated utility instead of the main images module
import { preloadImage } from '@/lib/imageLoader';

interface ProjectImage {
  id: string;
  src: string;
  alt: string;
  isCover: boolean;
  image?: string;
  image_url?: string;
}

interface ProjectGalleryProps {
  images: ProjectImage[];
}

const ProjectGallery: React.FC<ProjectGalleryProps> = ({ images = [] }) => {
  // const { t } = useTranslation('common');
  // const router = useRouter();
  // const isRtl = router.locale === 'ar';
  
  const t = useTranslations('portfolio');
  
  // State for client-side rendering
  const [isClient, setIsClient] = useState(false);
  const [selectedImage, setSelectedImage] = useState<ProjectImage | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [prefetchedImages, setPrefetchedImages] = useState<Set<string>>(new Set());
  
  // const { getImageSrc } = useProjectImages();

  // Resolve image URLs consistently
  const resolveImageUrl = (img: ProjectImage): string => {
    return img.src || img.image_url || img.image || '/images/placeholder.jpg';
  };

  // Set initial selected image only on client-side to prevent hydration mismatch
  useEffect(() => {
    setIsClient(true);
    if (images.length > 0) {
      setSelectedImage(images[0]);
    }
  }, [images]);

  // Prefetch the initial image and adjacent images on component mount
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    const prefetchInitialImages = async () => {
      if (!images.length) return;
      
      try {
        // Create a new Set to track prefetched images
        const prefetched = new Set<string>();
        
        // Always prefetch the first image
        const firstImageUrl = resolveImageUrl(images[0]);
        await preloadImage(firstImageUrl);
        prefetched.add(firstImageUrl);
        
        // If we have more images, prefetch the second one
        if (images.length > 1) {
          const secondImageUrl = resolveImageUrl(images[1]);
          await preloadImage(secondImageUrl);
          prefetched.add(secondImageUrl);
        }
        
        setPrefetchedImages(prefetched);
      } catch (error) {
        console.error("Error preloading gallery images:", error);
      }
    };
    
    prefetchInitialImages();
  }, [images]);
  
  // Prefetch the hovered image if it's not already loaded
  useEffect(() => {
    // Only run in browser environment
    if (typeof window === 'undefined') return;
    
    const prefetchHoveredImage = async () => {
      if (hoveredIndex === null || !images[hoveredIndex]) return;
      
      try {
        const imageUrl = resolveImageUrl(images[hoveredIndex]);
        
        // Skip if already prefetched
        if (prefetchedImages.has(imageUrl)) return;
        
        await preloadImage(imageUrl);
        
        // Update prefetched images set
        setPrefetchedImages(prev => {
          const updated = new Set(prev);
          updated.add(imageUrl);
          return updated;
        });
      } catch (error) {
        console.error("Error preloading hovered image:", error);
      }
    };
    
    prefetchHoveredImage();
  }, [hoveredIndex, images, prefetchedImages]);

  if (!images || images.length === 0) {
    return <p>{t('noGalleryImages', { default: 'No images available for this project gallery.' })}</p>;
  }
  
  // Prevent hydration mismatch by rendering differently on server and client
  if (!isClient) {
    return (
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">{t('projectGallery')}</h2>
        <div className="relative mb-6 h-[400px] md:h-[600px] w-full overflow-hidden rounded-lg bg-gray-100"></div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2"></div>
      </section>
    );
  }
  
  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-8">{t('projectGallery')}</h2>
      
      <div className="relative mb-6 h-[400px] md:h-[600px] w-full overflow-hidden rounded-lg bg-gray-100">
        {selectedImage ? (
           <DirectProjectImage
             src={resolveImageUrl(selectedImage)} 
             alt={selectedImage.alt || t('selectedImageAlt', { default: 'Selected project image' })}
             className="w-full h-full object-contain"
             priority={true}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
             <p>{t('noImageSelected', { default: 'No image selected' })}</p>
           </div>
        )}
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {images.map((image, index) => (
          <button 
            key={image.id}
            onClick={() => setSelectedImage(image)}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={`relative aspect-square w-full overflow-hidden rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue ${selectedImage?.id === image.id ? 'ring-2 ring-brand-blue ring-offset-2' : ''}`}
          >
            <DirectProjectImage 
              src={resolveImageUrl(image)}
              alt={image.alt || t('thumbnailAlt', { default: 'Project thumbnail' })}
              className="absolute inset-0 w-full h-full object-cover transition-opacity hover:opacity-80"
            />
             {selectedImage?.id === image.id && (
               <div className="absolute inset-0 bg-black/30"></div>
             )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default ProjectGallery; 