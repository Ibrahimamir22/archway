import React from 'react';
import { ScrollReveal } from '@/components/ui';
import { useTestimonials } from '@/lib/hooks/marketing/about';
import { ErrorMessage, LoadingState } from '@/components/ui';
import TestimonialGrid from './Testimonials/TestimonialGrid';
import { Testimonial } from '@/types/marketing';

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
  sectionTitle
}) => {
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
    <div className={`py-12 ${className}`} dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{titleText}</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {descriptionText}
          </p>
        </div>

        {showLoading && (
          <LoadingState type="testimonial" text={loadingText} />
        )}
        
        {!showLoading && displayedTestimonials.length > 0 && (
          <ScrollReveal>
            <TestimonialGrid 
              testimonials={displayedTestimonials}
              columns={columns}
            />
          </ScrollReveal>
        )}
        
        {!showLoading && displayedTestimonials.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {noTestimonialsText}
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials; 