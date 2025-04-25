import React from 'react';
import { ScrollReveal } from '@/components/ui';
import { useTestimonials } from '@/lib/hooks/marketing/about';
import { ErrorMessage, LoadingState } from '@/components/ui';
import TestimonialGrid from './Testimonials/TestimonialGrid';

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
}

const Testimonials: React.FC<TestimonialsProps> = ({
  className = '',
  featuredOnly = false,
  maxCount,
  industry,
  columns = 3,
  t,
  isRtl = false,
  locale = 'en'
}) => {
  const { 
    data: testimonials, 
    isLoading, 
    error,
    refetch 
  } = useTestimonials({
    featuredOnly,
    limit: maxCount,
    industry,
    locale
  });
  
  const displayedTestimonials = testimonials || [];

  // Use translation function if provided, otherwise use English defaults
  const titleText = t ? t('testimonials') : 'What Our Clients Say';
  const descriptionText = t ? t('testimonialsDescription') : 'Hear from our satisfied clients about their experience working with our team.';
  const loadingText = t ? t('loadingTestimonials') : 'Loading testimonials...';
  const noTestimonialsText = t ? t('noTestimonialsFound') : 'No testimonials found.';
  const errorText = t ? t('errorLoadingTestimonials') : 'Failed to load testimonials. Please try again later.';
  const retryText = t ? t('retry') : 'Retry';

  if (error) {
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
    <div className={`py-12 ${className}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{titleText}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {descriptionText}
          </p>
        </div>

        {isLoading && (
          <LoadingState type="testimonial" text={loadingText} />
        )}
        
        {!isLoading && displayedTestimonials.length > 0 && (
          <ScrollReveal>
            <TestimonialGrid 
              testimonials={displayedTestimonials}
              columns={columns}
            />
          </ScrollReveal>
        )}
        
        {!isLoading && displayedTestimonials.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {noTestimonialsText}
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials; 