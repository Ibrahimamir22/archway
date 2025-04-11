import React, { forwardRef, InputHTMLAttributes } from 'react';
import ErrorMessage from './ErrorMessage';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  rtl?: boolean;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ 
    label, 
    name, 
    error, 
    containerClassName = '', 
    labelClassName = '',
    inputClassName = '',
    rtl = false,
    ...props 
  }, ref) => {
    const inputClasses = `w-full px-4 py-2 border rounded focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors
      ${error ? 'border-red-500' : 'border-gray-300'} 
      ${rtl ? 'text-right' : 'text-left'}
      ${inputClassName}`;
    
    const labelClasses = `block mb-2 font-medium text-gray-700 ${rtl ? 'text-right' : 'text-left'} ${labelClassName}`;
    
    return (
      <div className={`mb-4 ${containerClassName}`}>
        <label htmlFor={name} className={labelClasses}>
          {label}
        </label>
        <input
          id={name}
          ref={ref}
          className={inputClasses}
          dir={rtl ? 'rtl' : 'ltr'}
          {...props}
        />
        {error && <ErrorMessage message={error} />}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput; 