import React, { useState, useEffect } from 'react';

interface DirectProjectImageProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * This component renders a plain img tag with direct image URLs
 * It is intentionally simple to ensure consistency between server and client rendering
 * This follows the same pattern as DirectServiceImage
 */
const DirectProjectImage: React.FC<DirectProjectImageProps> = ({ src, alt, className }) => {
  const [imageSrc, setImageSrc] = useState<string>(src);
  const [hasError, setHasError] = useState(false);

  // Normalize image URL - always keep it consistent with what the server rendered
  useEffect(() => {
    // If the URL is from backend:8000, replace with localhost:8000 directly
    if (src && src.includes('backend:8000')) {
      const normalized = src.replace('backend:8000', 'localhost:8000');
      setImageSrc(normalized);
    }
  }, [src]);

  // Handle error
  const handleError = () => {
    setHasError(true);
    setImageSrc('/images/project-placeholder.jpg');
  };

  return (
    <img
      src={hasError ? '/images/project-placeholder.jpg' : imageSrc}
      alt={alt}
      className={className || 'w-full h-full object-cover'}
      onError={handleError}
    />
  );
};

export default DirectProjectImage; 