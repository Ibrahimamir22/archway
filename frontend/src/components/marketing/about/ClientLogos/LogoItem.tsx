import React, { useState, useEffect } from 'react';
import { ScrollReveal } from '@/components/ui';

interface LogoItemProps {
  /**
   * The name of the client or partner
   */
  name: string;
  
  /**
   * URL to the logo image
   */
  image: string;
  
  /**
   * Optional URL to the client's website
   */
  website?: string;
  
  /**
   * Animation delay in seconds
   */
  delay?: number;
  
  /**
   * Whether to apply a reduced opacity effect when not hovered
   */
  fadeEffect?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

const LogoItem: React.FC<LogoItemProps> = ({
  name,
  image,
  website,
  delay = 0,
  fadeEffect = true,
  className = ''
}) => {
  // State to track image errors
  const [imgError, setImgError] = useState(false);

  // If the path to the image doesn't exist yet, use a placeholder
  let logoSrc = image;
  
  // If no image or error loading image, use placeholder
  if (!logoSrc || imgError) {
    logoSrc = 'https://via.placeholder.com/200x80?text=Logo';
  }
  
  // Debug logging
  useEffect(() => {
    console.log('LogoItem rendered with:', { name, image, logoSrc });
  }, [name, image, logoSrc]);
  
  // The logo content
  const logoContent = (
    <div 
      className={`
        bg-white dark:bg-gray-800 p-5 rounded-lg flex items-center justify-center h-24 
        ${fadeEffect ? 'opacity-70 hover:opacity-100 dark:opacity-60 dark:hover:opacity-100' : 'opacity-100'} 
        transition-all duration-300 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700
        ${className}
      `}
    >
      <img 
        src={logoSrc} 
        alt={`${name} logo`} 
        className="max-h-12 max-w-full object-contain" 
        onError={() => setImgError(true)}
      />
    </div>
  );

  return (
    <ScrollReveal
      animation="fade-in"
      delay={delay}
      offset="-20px"
    >
      {website ? (
        <a 
          href={website}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
          title={`Visit ${name} website`}
        >
          {logoContent}
        </a>
      ) : (
        logoContent
      )}
    </ScrollReveal>
  );
};

export { LogoItem };
export default LogoItem; 