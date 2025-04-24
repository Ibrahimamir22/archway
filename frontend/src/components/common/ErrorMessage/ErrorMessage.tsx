'use client';

import React from 'react';

export interface ErrorMessageProps {
  message: string;
  className?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, className = '' }) => {
  if (!message) return null;
  
  return (
    <p className={`text-red-600 text-sm mt-1 ${className}`}>
      {message}
    </p>
  );
};

export default ErrorMessage; 