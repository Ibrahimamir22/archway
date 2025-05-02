import React, { useEffect, useState } from 'react';
import { ScrollReveal } from '@/components/ui';
import { useTestimonials } from '@/lib/hooks/marketing/about';
import { ErrorMessage, LoadingState } from '@/components/ui';
import TestimonialGrid from './Testimonials/TestimonialGrid';
import TestimonialCarousel from './Testimonials/TestimonialCarousel';
import { Testimonial } from '@/types/marketing';
import { Pattern } from '@/components/ui/Pattern';

interface TestimonialsProps {
  /**
   * Optional className for styling
   */
  className?: string;
  
  /**
   * Whether to only show featured testimonials
   */
  featuredOnly?: boolean;
  
  /**
   * Maximum number of testimonials to display
   */
  maxCount?: number;
  
  /**
   * Industry to filter testimonials by
   */
  industry?: string;
  
  /**
   * Number of columns to display (1-3)
   */
  columns?: 1 | 2 | 3;

  /**
   * Translation function
   */
  t?: (key: string) => string;

  /**
   * Whether the text direction is RTL
   */
  isRtl?: boolean;

  /**
   * Current locale
   */
  locale?: string;

  /**
   * Optional testimonials data to use directly (bypasses API fetch)
   */
  testimonials?: Testimonial[];

  /**
   * Optional section title
   */
  sectionTitle?: string;
  
  /**
   * Whether to use the carousel on mobile
   */
  useCarouselOnMobile?: boolean;
}

const Testimonials: React.FC<TestimonialsProps> = ({
  className = '',
  featuredOnly = false,
  maxCount,
  industry,
  columns = 3,
  t,
  isRtl = false,
  locale = 'en',
  testimonials: providedTestimonials,
  sectionTitle,
  useCarouselOnMobile = true
}) => {
  // Track if we're on mobile screen
  const [isMobile, setIsMobile] = useState(false);
  
  // Check screen size on mount and window resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Listen for resize events
    window.addEventListener('resize', checkScreenSize);
    
    // Clean up
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);
  
  // Only fetch testimonials if they weren't provided as props
  const { 
    data: fetchedTestimonials, 
    isLoading, 
    error,
    refetch 
  } = useTestimonials({
    featuredOnly,
    limit: maxCount,
    industry,
    locale,
    autoFetch: !providedTestimonials // Only auto-fetch if testimonials weren't provided
  });
  
  // Use provided testimonials or fallback to fetched ones
  const displayedTestimonials = providedTestimonials || fetchedTestimonials || [];
  
  // If we're using provided testimonials, we're not loading
  const showLoading = !providedTestimonials && isLoading;
  
  // Use translation function if provided, otherwise use English defaults
  const titleText = sectionTitle || (t ? t('testimonials') : 'What Our Clients Say');
  const descriptionText = t ? t('testimonialsDescription') : 'Hear from our satisfied clients about their experience working with our team.';
  const loadingText = t ? t('loadingTestimonials') : 'Loading testimonials...';
  const noTestimonialsText = t ? t('noTestimonialsFound') : 'No testimonials found.';
  const errorText = t ? t('errorLoadingTestimonials') : 'Failed to load testimonials. Please try again later.';
  const retryText = t ? t('retry') : 'Retry';

  // Only show error if we're using the hook and there's an error
  if (!providedTestimonials && error) {
    return (
      <div className={`py-8 ${className}`} dir={isRtl ? 'rtl' : 'ltr'}>
        <ErrorMessage 
          message={error || errorText}
          retryText={retryText}
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className={`py-20 ${className} relative overflow-hidden bg-gradient-to-b from-gray-50/50 to-white dark:from-gray-900/50 dark:to-gray-950 rounded-3xl`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Decorative background pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10 -z-10">
        <Pattern />
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-40 -left-20 w-64 h-64 bg-brand-accent/10 dark:bg-brand-accent/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-20 -right-20 w-80 h-80 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-full blur-3xl -z-10"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-brand-blue-light dark:from-brand-light dark:to-white">
            {titleText}
          </h2>
          <div className="w-24 h-1 bg-brand-accent mx-auto rounded-full mb-6"></div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {descriptionText}
          </p>
        </div>

        {showLoading && (
          <div className="py-16">
            <LoadingState type="testimonial" text={loadingText} />
          </div>
        )}
        
        {!showLoading && displayedTestimonials.length > 0 && (
          <ScrollReveal animation="slide-up" delay={0.2}>
            {isMobile && useCarouselOnMobile ? (
              // Show carousel on mobile
              <TestimonialCarousel 
                testimonials={displayedTestimonials}
                locale={locale}
                className="mb-8"
              />
            ) : (
              // Show grid on desktop
              <TestimonialGrid 
                testimonials={displayedTestimonials}
                columns={columns}
                className="gap-8"
              />
            )}
            
            {/* More testimonials button (if needed) */}
            {featuredOnly && displayedTestimonials.length >= 3 && (
              <div className="text-center mt-12">
                <a href={`/${locale}/testimonials`} className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-blue hover:bg-brand-blue-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-colors duration-200">
                  {t ? t('viewMoreTestimonials') : 'View More Testimonials'}
                </a>
              </div>
            )}
          </ScrollReveal>
        )}
        
        {!showLoading && displayedTestimonials.length === 0 && (
          <div className="text-center py-12 bg-white/50 dark:bg-gray-800/30 rounded-xl backdrop-blur-sm">
            <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            <p className="text-gray-500 dark:text-gray-400 text-lg font-medium">
              {noTestimonialsText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials; 