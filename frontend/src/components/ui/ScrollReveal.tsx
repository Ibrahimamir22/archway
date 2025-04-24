import React, { useRef } from 'react';
import { useIntersectionObserver } from '@/lib/hooks/ui/useIntersectionObserver';

export type AnimationType = 
  'fade-in' | 
  'slide-up' | 
  'slide-down' | 
  'slide-left' | 
  'slide-right' | 
  'zoom-in' | 
  'rotate';

interface ScrollRevealProps {
  /**
   * The animation to apply when the element enters the viewport
   */
  animation: AnimationType;
  
  /**
   * Delay in seconds before the animation starts
   */
  delay?: number;
  
  /**
   * Duration of the animation in seconds
   */
  duration?: number;
  
  /**
   * Content to be revealed
   */
  children: React.ReactNode;
  
  /**
   * Offset from the viewport edge to trigger the animation (e.g., '100px')
   */
  offset?: string;
  
  /**
   * Whether to animate only once
   */
  once?: boolean;
  
  /**
   * Additional classes to apply to the wrapper
   */
  className?: string;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  animation,
  delay = 0,
  duration = 0.8,
  children,
  offset = '0px',
  once = true,
  className = '',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver({
    elementRef: ref,
    rootMargin: offset,
    freezeOnceVisible: once,
  });

  // Animation classes based on the animation type
  const getAnimationClass = (type: AnimationType): string => {
    switch (type) {
      case 'fade-in':
        return 'opacity-0 transition-opacity';
      case 'slide-up':
        return 'opacity-0 translate-y-8 transition-all';
      case 'slide-down':
        return 'opacity-0 -translate-y-8 transition-all';
      case 'slide-left':
        return 'opacity-0 translate-x-8 transition-all';
      case 'slide-right':
        return 'opacity-0 -translate-x-8 transition-all';
      case 'zoom-in':
        return 'opacity-0 scale-95 transition-all';
      case 'rotate':
        return 'opacity-0 rotate-6 transition-all';
      default:
        return 'opacity-0 transition-opacity';
    }
  };

  // Classes to apply when the element is visible
  const visibleClass = 'opacity-100 translate-x-0 translate-y-0 scale-100 rotate-0';

  return (
    <div
      ref={ref}
      className={`${className} ${getAnimationClass(animation)} ${isVisible ? visibleClass : ''}`}
      style={{
        transitionDuration: `${duration}s`,
        transitionDelay: `${delay}s`,
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal; 