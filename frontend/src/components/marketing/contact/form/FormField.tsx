'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormFieldProps } from '@/types/marketing/contact';

// Brand accent color - using amber-500 to match site theme
const BRAND_ACCENT_COLOR = '#f59e0b';

/**
 * Reusable form field component with styling, animations, and validation states
 */
const FormField = ({
  id,
  name,
  value,
  label,
  error,
  icon,
  isRequired = true,
  isValid = false,
  isRtl = false,
  onFocus,
  onBlur,
  onChange,
  onKeyDown,
  required,
  autoComplete,
  inputMode,
  type,
}: FormFieldProps) => {
  // Track internal focus state to avoid animation lag
  const [internalFocused, setInternalFocused] = useState(false);
  
  // Whether the field should show an error message
  const showError = !!error;
  
  // Whether the field has content (used for floating label animation)
  const hasContent = value?.trim ? value.trim() !== '' : !!value;

  // Enhanced focus handlers
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setInternalFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setInternalFocused(false);
    if (onBlur) onBlur(e);
  };

  return (
    <div className="form-field">
      <div className="relative">
        <motion.div 
          initial={false}
          animate={{
            scale: internalFocused ? 1.1 : 1,
            color: internalFocused ? BRAND_ACCENT_COLOR : '#9ca3af'
          }}
          transition={{ duration: 0.2 }}
          className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-3 text-gray-400 pointer-events-none`}
        >
          {icon}
        </motion.div>
        <input
          type={type || (name === 'email' ? 'email' : 'text')}
          id={id}
          name={name}
          value={value || ''}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={onKeyDown}
          className={`w-full ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 rounded-lg focus:outline-none transition-all 
            bg-gray-700/60 border ${
            internalFocused 
              ? `ring-2 ring-amber-500/30 border-transparent shadow-md shadow-amber-700/10` 
              : showError
                ? 'border-red-700/60 bg-red-900/10' 
                : 'border-gray-600 hover:border-gray-500'
          } text-white`}
          aria-required={required || isRequired ? 'true' : 'false'}
          aria-invalid={showError ? 'true' : 'false'}
          aria-describedby={showError ? `${id}-error` : undefined}
          dir={name === 'email' ? 'ltr' : undefined} // Email input should always be LTR
          required={required}
          autoComplete={autoComplete}
          inputMode={inputMode}
        />
        <motion.label 
          initial={false}
          animate={{
            y: internalFocused || hasContent ? -24 : 0,
            x: internalFocused || hasContent ? (isRtl ? 0 : 0) : 0,
            scale: internalFocused || hasContent ? 0.8 : 1,
            color: internalFocused 
              ? BRAND_ACCENT_COLOR
              : showError 
                ? '#f87171' 
                : '#9ca3af'
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          htmlFor={id}
          className={`absolute ${isRtl ? 'right-10' : 'left-10'} top-3 origin-[0_0] pointer-events-none`}
        >
          {label} {isRequired && !showError ? <span className="text-red-400/70">*</span> : null}
        </motion.label>
        <AnimatePresence>
          {isValid && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 0.2 }}
              className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2`}
            >
              <svg 
                className="text-green-400 w-5 h-5" 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor"
                aria-hidden="true"
              >
                <path fillRule="evenodd" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" clipRule="evenodd" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {showError && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            id={`${id}-error`} 
            className="mt-1 text-sm text-red-400/90"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FormField; 