'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MdDirections, MdMap } from 'react-icons/md';

interface MapDisplayProps {
  address: string;
  mapUrl?: string;
  directionsUrl?: string;
  viewOnMapText: string;
  getDirectionsText: string;
  isRtl: boolean;
}

/**
 * Map display component with lazy loading and skeleton loading state
 * Uses intersection observer for performance and reduces layout shifts
 */
export default function MapDisplay({
  address,
  mapUrl,
  directionsUrl,
  viewOnMapText,
  getDirectionsText,
  isRtl
}: MapDisplayProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Prioritize map loading on visible scroll
  useEffect(() => {
    // Only run on client
    if (typeof window === 'undefined') return;

    // Disconnect previous observer if component re-renders
    let observer: IntersectionObserver;

    // Use requestIdleCallback for non-critical initialization
    const idleCallback = window.requestIdleCallback || ((cb) => setTimeout(cb, 50));
    
    idleCallback(() => {
      // Check if intersection observer is supported
      if ('IntersectionObserver' in window) {
        observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              // Start loading the map when in viewport
              setShowMap(true);
              
              // Keep observing until map is fully loaded
              if (isMapLoaded && observer) {
                observer.disconnect();
              }
            }
          },
          { 
            threshold: 0.1,
            rootMargin: '200px 0px' // Start loading slightly before visible
          }
        );

        if (mapContainerRef.current) {
          observer.observe(mapContainerRef.current);
        }
      } else {
        // Fallback for browsers that don't support IntersectionObserver
        setShowMap(true);
      }
    });

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [isMapLoaded]);

  const handleMapLoad = () => {
    setIsMapLoaded(true);
  };

  // Prefetch the map URL when component mounts
  useEffect(() => {
    if (mapUrl && typeof window !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = new URL(mapUrl).origin;
      document.head.appendChild(link);
      
      return () => {
        document.head.removeChild(link);
      };
    }
  }, [mapUrl]);

  return (
    <motion.div
      ref={mapContainerRef}
      id="map-container"
      className="relative rounded-lg overflow-hidden shadow-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        duration: 0.5,
        delay: 0.2
      }}
    >
      <div className="relative h-[250px] bg-gray-200 dark:bg-gray-700">
        {/* Skeleton loader shown while map is loading */}
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-700 animate-pulse">
            <div className="flex flex-col items-center justify-center space-y-2">
              <MdMap className="w-10 h-10 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              <div className="text-sm text-gray-500 dark:text-gray-400">{viewOnMapText}</div>
            </div>
          </div>
        )}

        {/* The map iframe, only rendered when in viewport */}
        {showMap && (
          <iframe
            ref={iframeRef}
            title={`Map showing ${address}`}
            src={`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=m&z=15&ie=UTF8&iwloc=&output=embed`}
            className="absolute top-0 left-0 w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            aria-label={`Location map for ${address}`}
            onLoad={handleMapLoad}
            style={{ 
              opacity: isMapLoaded ? 1 : 0,
              transition: 'opacity 0.5s ease-in-out'
            }}
          ></iframe>
        )}
      </div>

      <div className="flex items-center justify-between bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-3 border-t border-gray-100 dark:border-gray-700">
        <a
          href={mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-medium text-brand-blue dark:text-brand-accent hover:underline transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-accent focus:ring-offset-2 dark:focus:ring-offset-gray-800"
          aria-label={`${viewOnMapText} ${address}`}
        >
          {viewOnMapText}
          <svg
            className={`w-4 h-4 ${isRtl ? 'mr-1 rotate-180' : 'ml-1'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            ></path>
          </svg>
        </a>
        {directionsUrl && (
          <a
            href={directionsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-sm font-medium px-3 py-1.5 bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue dark:text-brand-accent rounded-full hover:bg-brand-blue/20 dark:hover:bg-brand-blue/30 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-accent focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            aria-label={`${getDirectionsText} ${address}`}
          >
            <MdDirections className={`w-4 h-4 ${isRtl ? 'ml-1.5' : 'mr-1.5'}`} aria-hidden="true" />
            {getDirectionsText}
          </a>
        )}
      </div>
    </motion.div>
  );
} 