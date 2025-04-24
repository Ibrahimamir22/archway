'use client';

import React, { forwardRef, ReactNode } from 'react';

export interface ButtonProps {
  children?: React.ReactNode;  // Make children optional
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
  [key: string]: any; // Allow any other props
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  variant = 'primary',
  fullWidth = false,
  type = 'button',
  disabled = false,
  className = '',
  ...props
}, ref) => {
  // Define base styles
  let variantClasses = '';
  
  // Apply styling based on the variant
  switch (variant) {
    case 'primary':
      variantClasses = 'bg-brand-blue hover:bg-brand-blue-light text-white';
      break;
    case 'secondary':
      variantClasses = 'bg-brand-accent hover:bg-brand-accent-light text-white';
      break;
    case 'outline':
      variantClasses = 'bg-transparent border border-gray-300 hover:border-brand-blue text-gray-800 hover:text-brand-blue';
      break;
    default:
      variantClasses = 'bg-brand-blue hover:bg-brand-blue-light text-white';
  }
  
  // The button uses Tailwind classes for styling
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled}
      className={`px-4 py-2 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue-light focus:ring-opacity-50 ${
        fullWidth ? 'w-full' : ''
      } ${variantClasses} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

// Add display name for better debugging
Button.displayName = 'Button';

export default Button; 