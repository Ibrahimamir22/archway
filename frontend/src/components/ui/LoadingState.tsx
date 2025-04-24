import React from 'react';
import { LoadingSpinner } from './LoadingSpinner';

interface LoadingStateProps {
  type?: 'default' | 'team' | 'testimonials' | 'values';
  text?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'default',
  text = 'Loading...',
  size = 'md',
  className = ''
}) => {
  // Component-specific loading placeholders
  const renderSectionSpecificLoading = () => {
    switch (type) {
      case 'team':
        return (
          <div className="space-y-8">
            <div className="text-center">{text}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className="h-64 w-full bg-gray-200 dark:bg-gray-700 animate-pulse" />
                  <div className="p-6 space-y-3">
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'testimonials':
        return (
          <div className="space-y-8">
            <div className="text-center">{text}</div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8">
                  <div className="space-y-4">
                    <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
                    </div>
                    <div className="pt-4 space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
                      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'values':
        return (
          <div className="space-y-8">
            <div className="text-center">{text}</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="space-y-4">
                    <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse" />
                    <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse" />
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
                      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'default':
      default:
        return (
          <div className="flex flex-col items-center justify-center py-12">
            <LoadingSpinner size={size} className="mb-4" />
            {text && <p className="text-gray-500 dark:text-gray-400">{text}</p>}
          </div>
        );
    }
  };

  return (
    <div className={`w-full ${className}`} role="status" aria-live="polite">
      {renderSectionSpecificLoading()}
    </div>
  );
};

export default LoadingState; 