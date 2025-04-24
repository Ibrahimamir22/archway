import React from 'react';
import { ScrollReveal } from '@/components/ui';

interface TimelineItemProps {
  /**
   * Year or date of the timeline event
   */
  year: string;
  
  /**
   * Title of the timeline event
   */
  title: string;
  
  /**
   * Description of the timeline event
   */
  description: string;
  
  /**
   * Whether this is an even or odd numbered item (affects layout)
   */
  index: number;
  
  /**
   * Whether to show the item on the right side in RTL mode
   */
  isRtl: boolean;
  
  /**
   * Optional image URL
   */
  image?: string;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({
  year,
  title,
  description,
  index,
  isRtl,
  image
}) => {
  const isEven = index % 2 === 0;
  
  // Determine the layout direction based on index and RTL setting
  const isRight = isRtl ? !isEven : isEven;
  
  return (
    <div className={`relative flex items-center ${isRight ? 'justify-end' : 'justify-start'} mb-8`}>
      {/* Line connector - not shown on mobile */}
      <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-10"></div>
      
      {/* Content with animation */}
      <ScrollReveal
        animation={isRight ? 'slide-left' : 'slide-right'}
        delay={0.1 * index}
        offset="-100px"
        className="md:w-5/12"
      >
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative">
          {/* Year badge */}
          <div className="absolute -top-3 left-4 px-3 py-1 bg-brand-blue dark:bg-brand-blue/80 text-white text-sm font-medium rounded-full">
            {year}
          </div>
          
          <div className="mt-3">
            <h3 className="text-xl font-semibold mb-2 text-brand-blue dark:text-white">
              {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              {description}
            </p>
            
            {/* Optional image */}
            {image && (
              <div className="mt-4 rounded-lg overflow-hidden">
                <img 
                  src={image} 
                  alt={title} 
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
          </div>
          
          {/* Timeline bullet */}
          <div className={`absolute top-1/2 ${isRight ? 'left-0 -translate-x-1/2' : 'right-0 translate-x-1/2'} -translate-y-1/2 w-4 h-4 rounded-full bg-brand-accent border-4 border-white dark:border-gray-800 hidden md:block`}></div>
        </div>
      </ScrollReveal>
    </div>
  );
}; 