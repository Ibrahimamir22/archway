import { useState } from 'react';

/**
 * Custom hook for handling project images with error tracking
 */
export const useProjectImages = (initialImages?: Array<{id: string, src: string, alt: string, isCover?: boolean}>) => {
  // Create a more robust error tracking state
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  
  // Filter out images that failed to load
  const getFilteredImages = (images?: Array<{id: string, src: string, alt: string, isCover?: boolean}>) => {
    if (!images) return [];
    
    // Only show images that haven't explicitly failed
    return images.filter(img => !imageErrors[img.id]);
  };
  
  // Improved error handler for images
  const handleImageError = (imageId: string) => {
    // Use a direct object update instead of a function to satisfy TypeScript
    const newErrors = { ...imageErrors };
    newErrors[imageId] = true;
    setImageErrors(newErrors);
  };
  
  // Success handler for images
  const handleImageLoad = (imageId: string) => {
    // Use a direct object update instead of a function to satisfy TypeScript
    const newLoaded = { ...loadedImages };
    newLoaded[imageId] = true;
    setLoadedImages(newLoaded);
  };

  // Get cover image (first checking that it loaded successfully)
  const getCoverImage = (images?: Array<{id: string, src: string, alt: string, isCover?: boolean}>) => {
    if (!images) return null;
    return images.find(img => img.isCover === true && !imageErrors[img.id]);
  };
  
  // If no valid cover, get first valid image
  const getFirstValidImage = (images?: Array<{id: string, src: string, alt: string, isCover?: boolean}>) => {
    if (!images) return null;
    return images.find(img => !imageErrors[img.id]);
  };

  // Update the getImageSrc function to ensure it always returns valid image URLs
  const getImageSrc = (image?: {id: string, src: string}) => {
    if (!image || !image.src) {
      return '/images/placeholder.jpg';
    }
    
    // Return the actual image source
    return image.src;
  };
  
  return {
    imageErrors,
    loadedImages,
    getFilteredImages,
    handleImageError,
    handleImageLoad,
    getCoverImage,
    getFirstValidImage,
    getImageSrc,
  };
}; 