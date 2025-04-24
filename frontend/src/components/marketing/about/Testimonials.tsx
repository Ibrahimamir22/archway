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
}

const Testimonials: React.FC<TestimonialsProps> = ({
  className = '',
  featuredOnly = false,
  maxCount,
  industry,
  columns = 3
}) => {
  const { 
    data: testimonials, 
    isLoading, 
    error,
    refetch 
  } = useTestimonials({
    featuredOnly,
    limit: maxCount,
    industry
  });
  
  const displayedTestimonials = testimonials || [];

  if (error) {
    return (
      <div className={`py-8 ${className}`}>
        <ErrorMessage 
          message={error || "Failed to load testimonials. Please try again later."}
          retryText="Retry"
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <div className={`py-12 ${className}`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Hear from our satisfied clients about their experience working with our team.
          </p>
        </div>

        {isLoading && (
          <LoadingState type="testimonial" text="Loading testimonials..." />
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
            No testimonials found.
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonials; 