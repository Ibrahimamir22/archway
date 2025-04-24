'use client';

import React, { forwardRef, InputHTMLAttributes } from 'react';
import ErrorMessage from '../ErrorMessage';

export interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  isRtl?: boolean;
  rtl?: boolean; // Keep for backward compatibility
  type?: string;
  rows?: number;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ 
    label, 
    name, 
    error, 
    containerClassName = '', 
    labelClassName = '',
    inputClassName = '',
    isRtl = false,
    rtl = false, // Keep for backward compatibility
    type = 'text',
    rows = 3,
    ...props 
  }, ref) => {
    // Use isRtl prop, fall back to rtl for backward compatibility
    const isRightToLeft = isRtl || rtl;
    
    const inputClasses = `w-full px-4 py-2 border rounded focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors
      ${error ? 'border-red-500' : 'border-gray-300'} 
      ${isRightToLeft ? 'text-right' : 'text-left'}
      ${inputClassName}`;
    
    const labelClasses = `block mb-2 font-medium text-gray-700 ${isRightToLeft ? 'text-right' : 'text-left'} ${labelClassName}`;
    
    // Render textarea if type is 'textarea'
    if (type === 'textarea') {
      return (
        <div className={`mb-4 ${containerClassName}`}>
          <label htmlFor={name} className={labelClasses}>
            {label}
          </label>
          <textarea
            id={name as string}
            className={inputClasses}
            dir={isRightToLeft ? 'rtl' : 'ltr'}
            rows={rows}
            {...props as any}
          />
          {error && <ErrorMessage message={error} />}
        </div>
      );
    }
    
    // Otherwise render a regular input
    return (
      <div className={`mb-4 ${containerClassName}`}>
        <label htmlFor={name} className={labelClasses}>
          {label}
        </label>
        <input
          id={name as string}
          ref={ref}
          className={inputClasses}
          dir={isRightToLeft ? 'rtl' : 'ltr'}
          type={type}
          {...props}
        />
        {error && <ErrorMessage message={error} />}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput; 