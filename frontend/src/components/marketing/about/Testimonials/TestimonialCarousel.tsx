'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Testimonial } from '@/types/marketing';
import TestimonialCard from './TestimonialCard';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

interface TestimonialCarouselProps {
  /**
   * List of testimonials to display
   */
  testimonials: Testimonial[];
  
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
}

const TestimonialCarousel: React.FC<TestimonialCarouselProps> = ({
  testimonials,
  className = '',
  autoPlayInterval = 5000,
  locale = 'en'
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  
  // For auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (autoPlayInterval > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
      }, autoPlayInterval);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoPlayInterval, testimonials.length]);
  
  // Handle navigation
  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      (prevIndex + 1) % testimonials.length
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
  
  // If no testimonials, don't render
  if (!testimonials.length) return null;
  
  // Screen reader text
  const srPrevText = locale === 'ar' ? 'الشهادة السابقة' : 'Previous testimonial';
  const srNextText = locale === 'ar' ? 'الشهادة التالية' : 'Next testimonial';
  
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
        {testimonials.map((testimonial, index) => (
          <div 
            key={testimonial.id || index} 
            className="w-full flex-shrink-0 px-2"
          >
            <TestimonialCard 
              testimonial={testimonial}
              delay={0}
              fixedHeight={false}
            />
          </div>
        ))}
      </div>
      
      {/* Navigation buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md text-brand-blue dark:text-white z-10 opacity-70 hover:opacity-100 transition-opacity"
        aria-label={srPrevText}
      >
        <FaChevronLeft size={16} />
      </button>
      
      <button
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 rounded-full p-2 shadow-md text-brand-blue dark:text-white z-10 opacity-70 hover:opacity-100 transition-opacity"
        aria-label={srNextText}
      >
        <FaChevronRight size={16} />
      </button>
      
      {/* Indicators */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-10">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentIndex 
                ? 'bg-brand-accent w-4' 
                : 'bg-gray-300 dark:bg-gray-600'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default TestimonialCarousel; 