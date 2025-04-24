'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from 'react-icons/fa';

interface SocialLink {
  platform: 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'youtube';
  url: string;
}

interface SocialLinksProps {
  title: string;
  links: SocialLink[];
  isRtl: boolean;
}

/**
 * SocialLinks component to display social media links with animations and accessibility
 */
export default function SocialLinks({ title, links, isRtl }: SocialLinksProps) {
  // No links to display
  if (!links || links.length === 0) {
    return null;
  }

  // Preload social media links on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Use requestIdleCallback for non-critical prefetching
    const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 100));
    
    idleCallback(() => {
      links.forEach(link => {
        const prefetchLink = document.createElement('link');
        prefetchLink.rel = 'dns-prefetch';
        prefetchLink.href = new URL(link.url).origin;
        document.head.appendChild(prefetchLink);
      });
    });
    
    return () => {
      // Cleanup is optional for prefetch links
    };
  }, [links]);

  const socialIcons = {
    facebook: <FaFacebookF className="w-5 h-5 text-white" aria-hidden="true" />,
    instagram: <FaInstagram className="w-5 h-5 text-white" aria-hidden="true" />,
    linkedin: <FaLinkedinIn className="w-5 h-5 text-white" aria-hidden="true" />,
    twitter: <FaTwitter className="w-5 h-5 text-white" aria-hidden="true" />,
    youtube: <FaYoutube className="w-5 h-5 text-white" aria-hidden="true" />
  };

  const socialColors = {
    facebook: 'bg-blue-600 hover:bg-blue-700',
    instagram: 'bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600',
    linkedin: 'bg-blue-500 hover:bg-blue-600',
    twitter: 'bg-sky-500 hover:bg-sky-600',
    youtube: 'bg-red-600 hover:bg-red-700'
  };

  const socialNames = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    linkedin: 'LinkedIn',
    twitter: 'Twitter',
    youtube: 'YouTube'
  };

  // Animation variants with staggered animation
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
        duration: 0.3
      }
    }
  };

  const item = {
    hidden: { scale: 0.8, opacity: 0 },
    show: { 
      scale: 1, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 300,
        duration: 0.3
      } 
    }
  };

  return (
    <div className="border-t border-gray-100 dark:border-gray-700 p-6 bg-gray-50 dark:bg-gray-800/70">
      <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-white">{title}</h3>
      <motion.div 
        className={`flex ${isRtl ? 'space-x-reverse space-x-4' : 'space-x-4'}`}
        initial="hidden"
        animate="show"
        variants={container}
      >
        {links.map((link) => (
          <motion.a
            key={link.platform}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`w-10 h-10 rounded-full ${socialColors[link.platform]} flex items-center justify-center transition-all shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${link.platform === 'instagram' ? 'pink' : link.platform}-500`}
            aria-label={socialNames[link.platform]}
            variants={item}
            whileHover={{ scale: 1.1, transition: { duration: 0.2 } }}
            whileTap={{ scale: 0.95, transition: { duration: 0.1 } }}
          >
            {socialIcons[link.platform]}
          </motion.a>
        ))}
      </motion.div>
    </div>
  );
} 