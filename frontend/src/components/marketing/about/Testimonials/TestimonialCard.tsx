import React from 'react';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';
import { Testimonial } from '@/types/marketing';
import { ScrollReveal } from '@/components/ui';

interface TestimonialCardProps {
  /**
   * Testimonial data to display
   */
  testimonial: Testimonial;
  
  /**
   * Animation delay in seconds
   */
  delay?: number;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  testimonial,
  delay = 0,
  className = '' 
}) => {
  // If image path doesn't exist, use a placeholder
  const imageSrc = testimonial.image || 'https://via.placeholder.com/100?text=Client';
  
  return (
    <ScrollReveal animation="fade-in" delay={delay}>
      <div 
        className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 flex flex-col h-full hover:shadow-lg transition-shadow duration-300 border border-gray-100 dark:border-gray-700 ${className}`}
      >
        {testimonial.rating && (
          <div className="flex mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar 
                key={i} 
                className={`${i < testimonial.rating! ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'} h-5 w-5`} 
              />
            ))}
          </div>
        )}
        
        <p className="text-gray-700 dark:text-gray-300 mb-4 flex-grow italic">
          &ldquo;{testimonial.content}&rdquo;
        </p>
        
        <div className="flex items-center mt-4">
          {imageSrc && (
            <div className="h-12 w-12 rounded-full overflow-hidden mr-4">
              <Image
                src={imageSrc}
                alt={testimonial.author}
                width={48}
                height={48}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {testimonial.author}
            </h4>
            {(testimonial.role || testimonial.company) && (
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {testimonial.role}
                {testimonial.role && testimonial.company && <span>, </span>}
                {testimonial.company}
              </p>
            )}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default TestimonialCard; 