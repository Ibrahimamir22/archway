import React from 'react';

interface LoadingStateProps {
  type?: 'card' | 'list' | 'text' | 'form';
  count?: number;
  className?: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'card',
  count = 1,
  className = '',
}) => {
  const renderText = () => (
    <div className={`animate-pulse ${className}`}>
      <div className="h-2.5 bg-gray-200 rounded-full w-full max-w-[360px] mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full max-w-[260px] mb-2.5"></div>
      <div className="h-2 bg-gray-200 rounded-full max-w-[300px]"></div>
    </div>
  );

  const renderForm = () => (
    <div className={`animate-pulse space-y-6 ${className}`}>
      <div className="space-y-3">
        <div className="h-2.5 bg-gray-200 rounded-full w-32"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="space-y-3">
        <div className="h-2.5 bg-gray-200 rounded-full w-32"></div>
        <div className="h-10 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="space-y-3">
        <div className="h-2.5 bg-gray-200 rounded-full w-32"></div>
        <div className="h-20 bg-gray-200 rounded w-full"></div>
      </div>
      <div className="h-12 bg-gray-200 rounded-md w-40"></div>
    </div>
  );

  const renderCard = () => (
    <div className={`animate-pulse bg-white rounded-lg shadow-md p-4 ${className}`}>
      <div className="rounded-md bg-gray-200 h-48 w-full mb-4"></div>
      <div className="h-4 bg-gray-200 rounded-full w-3/4 mb-2.5"></div>
      <div className="h-3 bg-gray-200 rounded-full w-1/2 mb-2.5"></div>
      <div className="flex justify-between items-center mt-4">
        <div className="h-8 bg-gray-200 rounded w-24"></div>
        <div className="h-8 bg-gray-200 rounded-full w-8"></div>
      </div>
    </div>
  );

  const renderList = () => (
    <div className={`animate-pulse space-y-4 ${className}`}>
      <div className="flex items-center space-x-4">
        <div className="rounded-md bg-gray-200 h-14 w-14"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded-full w-3/4"></div>
          <div className="h-2.5 bg-gray-200 rounded-full w-1/2"></div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="rounded-md bg-gray-200 h-14 w-14"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded-full w-3/4"></div>
          <div className="h-2.5 bg-gray-200 rounded-full w-1/2"></div>
        </div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="rounded-md bg-gray-200 h-14 w-14"></div>
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-gray-200 rounded-full w-3/4"></div>
          <div className="h-2.5 bg-gray-200 rounded-full w-1/2"></div>
        </div>
      </div>
    </div>
  );

  const renderTypeContent = () => {
    switch (type) {
      case 'text':
        return renderText();
      case 'form':
        return renderForm();
      case 'list':
        return renderList();
      case 'card':
      default:
        return renderCard();
    }
  };

  // If count is 1, just render the type content
  if (count === 1) {
    return renderTypeContent();
  }

  // If count is > 1, render multiple items
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${className}`}>
      {Array.from({ length: count }).map((_, index) => (
        <React.Fragment key={index}>{renderTypeContent()}</React.Fragment>
      ))}
    </div>
  );
};

export default LoadingState; 