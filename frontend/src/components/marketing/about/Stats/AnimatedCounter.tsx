'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  onComplete?: () => void;
  easing?: 'linear' | 'easeOut' | 'easeInOut';
  shouldAnimate?: boolean;
  threshold?: number;
}

/**
 * AnimatedCounter component that smoothly animates from 0 to a target number
 * Features include customizable duration, prefix/suffix, decimal precision,
 * easing functions, and intersection observer integration for triggering
 * when the counter comes into view.
 */
const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  end,
  duration = 2000,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
  onComplete,
  easing = 'easeOut',
  shouldAnimate = true,
  threshold = 0.1,
}) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const counterRef = useRef<HTMLSpanElement>(null);
  const startTimeRef = useRef<number | null>(null);
  const requestRef = useRef<number | null>(null);
  
  // Format the number with proper decimal places and locale-aware formatting
  const formatNumber = useCallback((num: number) => {
    return num.toLocaleString(undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }, [decimals]);
  
  // Define easing functions
  const getEasedValue = useCallback((t: number): number => {
    switch (easing) {
      case 'linear':
        return t;
      case 'easeOut':
        return 1 - Math.pow(1 - t, 3); // Cubic ease out
      case 'easeInOut':
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      default:
        return t;
    }
  }, [easing]);
  
  // Animation loop using requestAnimationFrame
  const animate = useCallback((timestamp: number) => {
    if (startTimeRef.current === null) {
      startTimeRef.current = timestamp;
    }
    
    const elapsed = timestamp - startTimeRef.current;
    const progress = Math.min(elapsed / duration, 1);
    const easedProgress = getEasedValue(progress);
    
    // Calculate current count based on progress
    const currentCount = easedProgress * end;
    setCount(currentCount);
    
    // Continue animation if not complete
    if (progress < 1) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      // Animation complete
      setCount(end);
      setHasAnimated(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [duration, end, getEasedValue, onComplete]);
  
  // Set up intersection observer to trigger animation when visible
  useEffect(() => {
    if (!shouldAnimate || hasAnimated) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: '0px 0px 100px 0px', // Start animation slightly before element comes into view
      }
    );
    
    if (counterRef.current) {
      observer.observe(counterRef.current);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [shouldAnimate, hasAnimated, threshold]);
  
  // Start animation when counter becomes visible
  useEffect(() => {
    if (isVisible && shouldAnimate && !hasAnimated) {
      startTimeRef.current = null;
      requestRef.current = requestAnimationFrame(animate);
      
      return () => {
        if (requestRef.current !== null) {
          cancelAnimationFrame(requestRef.current);
        }
      };
    }
  }, [isVisible, shouldAnimate, hasAnimated, animate]);
  
  // Handle the case when shouldAnimate is false (instant display)
  useEffect(() => {
    if (!shouldAnimate && !hasAnimated) {
      setCount(end);
      setHasAnimated(true);
      if (onComplete) {
        onComplete();
      }
    }
  }, [shouldAnimate, end, hasAnimated, onComplete]);
  
  return (
    <span ref={counterRef} className={className} aria-live="polite">
      {prefix}
      {formatNumber(count)}
      {suffix}
    </span>
  );
};

export default AnimatedCounter; 