import React from 'react';
import { Testimonial } from '@/types/marketing';
import TestimonialCard from './TestimonialCard';

interface TestimonialGridProps {
  /**
   * List of testimonials to display
   */
  testimonials: Testimonial[];
  
  /**
   * Number of columns in the grid
   */
  columns?: 1 | 2 | 3;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Whether to enforce equal height cards
   */
  equalHeight?: boolean;
}

export const TestimonialGrid: React.FC<TestimonialGridProps> = ({
  testimonials,
  columns = 3,
  className = '',
  equalHeight = true,
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }[columns];

  return (
    <div className={`grid ${gridCols} gap-6 ${className} h-full grid-flow-row-dense`}>
      {testimonials.map((testimonial, index) => (
        <div key={testimonial.id} className="h-full">
          <TestimonialCard 
            testimonial={testimonial}
            delay={0.1 * (index % columns)}
            fixedHeight={equalHeight}
          />
        </div>
      ))}
    </div>
  );
};

export default TestimonialGrid; 