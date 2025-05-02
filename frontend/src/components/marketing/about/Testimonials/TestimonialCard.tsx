import React from 'react';
import Image from 'next/image';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
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
  
  /**
   * Optional fixed height
   */
  fixedHeight?: boolean;
}

const TestimonialCard: React.FC<TestimonialCardProps> = ({ 
  testimonial,
  delay = 0,
  className = '',
  fixedHeight = true
}) => {
  // Support both image field formats
  const imageSrc = testimonial.image || testimonial.image_url || 'https://via.placeholder.com/100?text=Client';
  
  // Support both formats of data (backend model vs mock)
  const author = testimonial.client_name || testimonial.author || '';
  const quote = testimonial.quote || testimonial.content || '';
  const project = testimonial.project || testimonial.company || '';
  // For role, we only have it in the mock data
  const role = testimonial.role || '';
  
  return (
    <ScrollReveal animation="fade-in" delay={delay}>
      <div className="transform-gpu h-full">
        <div 
          className={`bg-white dark:bg-gray-800 rounded-xl p-8 flex flex-col h-full 
                    relative overflow-hidden group transition-all duration-300
                    border border-gray-100 dark:border-gray-700 hover:-translate-y-1 ${className}
                    ${fixedHeight ? 'min-h-[400px]' : ''}`}
          style={{
            transformOrigin: 'center bottom',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease'
          }}
          onMouseEnter={(e) => {
            const target = e.currentTarget;
            target.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)';
          }}
          onMouseLeave={(e) => {
            const target = e.currentTarget;
            target.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
          }}
        >
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full -mr-16 -mt-16" aria-hidden="true"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-brand-accent/5 dark:bg-brand-accent/10 rounded-full -ml-12 -mb-12" aria-hidden="true"></div>
          
          {/* Quote icon */}
          <div className="text-brand-accent/30 dark:text-brand-accent/20 mb-4 flex-shrink-0">
            <FaQuoteLeft size={36} />
          </div>
          
          {/* Testimonial rating */}
          {testimonial.rating && (
            <div className="flex mb-4 flex-shrink-0">
              {Array.from({ length: 5 }).map((_, i) => (
                <FaStar 
                  key={i} 
                  className={`${i < testimonial.rating! ? 'text-yellow-400' : 'text-gray-200 dark:text-gray-700'} h-5 w-5`} 
                />
              ))}
            </div>
          )}
          
          {/* Testimonial quote */}
          <p className="text-gray-700 dark:text-gray-300 mb-6 flex-grow relative z-10 text-lg leading-relaxed font-light">
            "{quote}"
          </p>
          
          {/* Divider */}
          <div className="w-16 h-1 bg-brand-accent/50 rounded-full mb-6 flex-shrink-0"></div>
          
          {/* Author information */}
          <div className="flex items-center mt-auto flex-shrink-0">
            {imageSrc && (
              <div className="h-14 w-14 rounded-full overflow-hidden mr-4 ring-2 ring-brand-accent/30 dark:ring-brand-accent/50 flex-shrink-0">
                <div className="w-full h-full transform-gpu overflow-hidden"
                  style={{
                    transformOrigin: 'center center',
                    transition: 'transform 0.5s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.1)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <Image
                    src={imageSrc}
                    alt={author}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            )}
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white text-lg">
                {author}
              </h4>
              {(role || project) && (
                <p className="text-sm text-brand-accent dark:text-brand-accent/80">
                  {role}
                  {role && project && <span>, </span>}
                  {project}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
};

export default TestimonialCard; 