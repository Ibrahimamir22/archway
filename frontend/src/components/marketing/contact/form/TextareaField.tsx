'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TextareaFieldProps } from '@/types/marketing/contact';

// Brand accent color - using amber-500 to match site theme
const BRAND_ACCENT_COLOR = '#f59e0b';

/**
 * Textarea field component with character counting and validation
 */
const TextareaField = ({
  id,
  name,
  value,
  label,
  error,
  icon,
  isRequired = true,
  isValid = false,
  isRtl = false,
  maxLength = 500,
  charsRemaining = 500,
  isNearLimit = false,
  isAtLimit = false,
  onFocus,
  onBlur,
  onChange,
  required,
}: TextareaFieldProps) => {
  // Track internal focus state to avoid animation lag
  const [internalFocused, setInternalFocused] = useState(false);
  
  // Whether the field should show an error message
  const showError = !!error;
  
  // Whether the field has content (used for floating label animation)
  const hasContent = value?.trim ? value.trim() !== '' : !!value;

  // Enhanced focus handlers
  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setInternalFocused(true);
    if (onFocus) onFocus(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
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
        <textarea
          id={id}
          name={name}
          rows={5}
          value={value || ''}
          onChange={onChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className={`w-full ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 rounded-lg focus:outline-none transition-all 
            bg-gray-700/60 border ${
            internalFocused 
              ? `ring-2 ring-amber-500/30 border-transparent shadow-md shadow-amber-700/10` 
              : showError
                ? 'border-red-700/60 bg-red-900/10' 
                : isAtLimit
                  ? 'border-orange-700/60 bg-orange-900/10'
                  : 'border-gray-600 hover:border-gray-500'
          } text-white resize-none`}
          aria-required={required || isRequired ? 'true' : 'false'}
          maxLength={maxLength + 5} // Allow a small buffer beyond the limit for better UX
          aria-invalid={showError ? 'true' : 'false'}
          aria-describedby={showError ? `${id}-error` : undefined}
          required={required}
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
        
        {/* Character counter */}
        <motion.div 
          initial={false}
          animate={{
            color: isAtLimit 
              ? '#ef4444' 
              : isNearLimit 
                ? '#f59e0b' 
                : '#9ca3af'
          }}
          transition={{ duration: 0.2 }}
          className={`absolute ${isRtl ? 'left-3' : 'right-3'} bottom-3 text-sm flex items-center`}
        >
          <span className="text-xs">
            {charsRemaining}
          </span>
        </motion.div>
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

export default TextareaField; 