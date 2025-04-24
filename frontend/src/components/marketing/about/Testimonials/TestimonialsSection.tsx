import React from 'react';
import Testimonials from '../Testimonials';

interface TestimonialsSectionProps {
  className?: string;
  featuredOnly?: boolean;
  maxCount?: number;
  columns?: 1 | 2 | 3;
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = (props) => {
  return <Testimonials {...props} />;
};

export default TestimonialsSection; 