'use client';

import React, { useState, useEffect, useRef } from 'react';
import { TeamMember } from '@/types/marketing';
import TeamMemberCard from './TeamMemberCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface TeamCarouselProps {
  /**
   * List of team members to display
   */
  teamMembers: TeamMember[];
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Auto-play interval in milliseconds (0 to disable)
   */
  autoPlayInterval?: number;
  
  /**
   * Locale for screen reader text
   */
  locale?: string;
  
  /**
   * Is loading state
   */
  isLoading?: boolean;
}

const TeamCarousel: React.FC<TeamCarouselProps> = ({
  teamMembers,
  className = '',
  autoPlayInterval = 0, // Default to no autoplay for team members
  locale = 'en',
  isLoading = false
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // For auto-play functionality (if enabled)
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (autoPlayInterval > 0 && !isLoading && teamMembers.length > 1) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % teamMembers.length);
      }, autoPlayInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoPlayInterval, teamMembers.length, isLoading]);
  
  // Handle navigation
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? teamMembers.length - 1 : prevIndex - 1
    );
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % teamMembers.length
    );
  };
  
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };
  
  // Handle touch events for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isSignificantSwipe = Math.abs(distance) > 50;
    
    if (isSignificantSwipe) {
      if (distance > 0) {
        // Swiped left, go next
        goToNext();
      } else {
        // Swiped right, go previous
        goToPrevious();
      }
    }
    
    setTouchStart(null);
    setTouchEnd(null);
  };
  
  // If no team members and not loading, don't render
  if (!teamMembers.length && !isLoading) return null;
  
  // Screen reader text
  const srPrevText = locale === 'ar' ? 'العضو السابق' : 'Previous team member';
  const srNextText = locale === 'ar' ? 'العضو التالي' : 'Next team member';
  
  return (
    <div 
      className={`relative overflow-hidden rounded-xl ${className}`}
      ref={carouselRef}
    >
      <div 
        className="flex transition-transform duration-500 ease-out h-full"
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {teamMembers.map((member, index) => (
          <div 
            key={member.id || index} 
            className="w-full flex-shrink-0 px-4 py-2"
          >
            <TeamMemberCard member={member} />
          </div>
        ))}
      </div>
      
      {/* Only show navigation if there are multiple team members */}
      {teamMembers.length > 1 && (
        <>
          {/* Navigation buttons */}
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-3 shadow-md text-brand-blue dark:text-white z-10 opacity-70 hover:opacity-100 transition-opacity"
            aria-label={srPrevText}
          >
            <FaChevronLeft size={16} />
          </button>
          
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-3 shadow-md text-brand-blue dark:text-white z-10 opacity-70 hover:opacity-100 transition-opacity"
            aria-label={srNextText}
          >
            <FaChevronRight size={16} />
          </button>
          
          {/* Indicators */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-10">
            {teamMembers.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-brand-accent w-4' 
                    : 'bg-gray-300 dark:bg-gray-600'
                }`}
                aria-label={`Go to team member ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default TeamCarousel; 