'use client';

import React from 'react';
import { getSocialMediaColor } from '@/lib/utils/socialMediaColors';
import { 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaYoutube, 
  FaPinterest, 
  FaTiktok, 
  FaBehance, 
  FaWhatsapp,
  FaGlobe
} from 'react-icons/fa';

export interface SocialMediaLinkProps {
  platform: string;
  url: string;
  icon?: string; // Optional custom icon
  isRtl?: boolean;
}

const iconMap: Record<string, React.ComponentType> = {
  facebook: FaFacebook,
  twitter: FaTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedin,
  youtube: FaYoutube,
  pinterest: FaPinterest,
  tiktok: FaTiktok,
  behance: FaBehance,
  whatsapp: FaWhatsapp,
  other: FaGlobe,
  // Add common variations
  'fab fa-facebook-f': FaFacebook,
  'fab fa-facebook': FaFacebook,
  'fab fa-twitter': FaTwitter,
  'fab fa-instagram': FaInstagram,
  'fab fa-linkedin-in': FaLinkedin,
  'fab fa-youtube': FaYoutube,
  'fab fa-pinterest-p': FaPinterest,
  'fab fa-tiktok': FaTiktok,
  'fab fa-behance': FaBehance,
  'fab fa-whatsapp': FaWhatsapp,
  'fas fa-link': FaGlobe
};

const SocialMediaLink: React.FC<SocialMediaLinkProps> = ({ 
  platform, 
  url, 
  icon, 
  isRtl = false 
}) => {
  // Get the correct icon component to use
  const normalizedPlatform = platform?.toLowerCase() || 'other';
  
  // Extract platform name if it's a font awesome string
  const extractedPlatform = 
    typeof normalizedPlatform === 'string' && normalizedPlatform.includes('fa-') 
    ? normalizedPlatform.split('fa-')[1]?.replace(/-/g, '') 
    : normalizedPlatform;
  
  // Similar extraction for icon (if provided)
  const normalizedIcon = icon?.toLowerCase() || '';
  const extractedIcon = 
    normalizedIcon.includes('fa-') 
    ? normalizedIcon.split('fa-')[1]?.replace(/-/g, '')
    : normalizedIcon;
  
  // Try to find the appropriate icon component
  let IconComponent = icon 
    ? (iconMap[normalizedIcon] || iconMap[extractedIcon]) 
    : (iconMap[normalizedPlatform] || iconMap[extractedPlatform]);
    
  // Fallback to other icon if none found
  if (!IconComponent) {
    console.warn(`No icon found for platform: ${platform}, icon: ${icon}`);
    IconComponent = iconMap.other;
  }
  
  // Get the platform-specific color
  const color = getSocialMediaColor(normalizedPlatform);
  
  // Handle Instagram's gradient (can't use a gradient directly as a color)
  const isInstagram = normalizedPlatform === 'instagram' || extractedPlatform === 'instagram';
  const style = isInstagram 
    ? { background: color, color: 'white', borderRadius: '8px', padding: '2px' } 
    : { color };
  
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer" 
      className="transition-transform hover:scale-110 hover:brightness-125 inline-flex"
      aria-label={`Follow us on ${platform}`}
      style={{
        margin: '0' // Remove all margins to let parent container control spacing
      }}
    >
      <span 
        className="rounded-full bg-gray-800 hover:bg-gray-700 transition-colors inline-flex items-center justify-center"
        style={{
          padding: '0.5rem',
          width: '2.5rem',
          height: '2.5rem'
        }}
      >
        <IconComponent 
          style={{
            ...style,
            width: '1.25rem',
            height: '1.25rem'
          }} 
        />
      </span>
    </a>
  );
};

export default SocialMediaLink;