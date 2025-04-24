import React from 'react';

interface TimelineDividerProps {
  /**
   * Label to show in the divider
   */
  label: string;
  
  /**
   * Custom class names
   */
  className?: string;
}

export const TimelineDivider: React.FC<TimelineDividerProps> = ({ 
  label, 
  className = '' 
}) => {
  return (
    <div className={`relative flex items-center justify-center my-12 ${className}`}>
      <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-10"></div>
      <div className="px-4 py-2 bg-brand-accent/10 dark:bg-brand-accent/20 text-brand-accent font-medium rounded-full border border-brand-accent/30 text-sm">
        {label}
      </div>
    </div>
  );
}; 