'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
// import { useNewsletterSubscription } from '@/lib/hooks/ui/useFooter'; // Old import
import { useNewsletterSubscription } from '@/lib/hooks/marketing'; // Corrected import
import { MdOutlineEmail, MdCheck } from 'react-icons/md';
import { FaSpinner } from 'react-icons/fa';

export interface NewsletterFormProps {
  isRtl?: boolean;
  newsletterText?: string;
  newsletterLabel?: string;
}

const NewsletterForm = ({ 
  isRtl = false, 
  newsletterText: propsText, // Rename so we can ignore it
  newsletterLabel: propsLabel // Rename so we can ignore it
}: NewsletterFormProps): JSX.Element => {
  const t = useTranslations('footer.newsletter');
  const [email, setEmail] = useState('');
  const [localStatus, setLocalStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Use the enhanced hook
  const { subscribeToNewsletter, status: hookStatus } = useNewsletterSubscription();
  
  // CRITICAL FIX: Always use translations directly, not props
  // This ensures proper localization in all cases
  const displayLabel = t('title');
  const displayText = t('description');
  const displaySubscribeText = t('subscribe'); // Fix for the button text
  const displaySubmittingText = t('subscribing'); // Fix for the button submitting text
  
  // Log translation values for debugging
  console.log("Newsletter direct translations:", {
    isRtl,
    title: t('title'),
    description: t('description'),
    placeholder: t('placeholder'),
    subscribe: t('subscribe'),
    subscribing: t('subscribing'),
    buttonText: displaySubscribeText
  });
  
  // Sync hook status with local status
  useEffect(() => {
    if (hookStatus !== 'idle') {
      setLocalStatus(hookStatus);
    }
  }, [hookStatus]);
  
  // Reset form after success (after 5 seconds)
  useEffect(() => {
    if (localStatus === 'success') {
      const timer = setTimeout(() => {
        setLocalStatus('idle');
        setSuccessMessage('');
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [localStatus]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset states
    setErrorMessage('');
    setSuccessMessage('');
    
    // Basic validation
    if (!email) {
      setLocalStatus('error');
      setErrorMessage(t('emptyEmail'));
      return;
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalStatus('error');
      setErrorMessage(t('invalidEmail'));
      return;
    }
    
    // Submit to API
    try {
      console.log('Submitting email subscription:', email);
      setLocalStatus('submitting');
      const result = await subscribeToNewsletter(email);
      
      console.log('Newsletter subscription result:', result);
      
      if (result.success) {
        setLocalStatus('success');
        setSuccessMessage(result.message || t('thankYou'));
        setEmail('');
      } else {
        setLocalStatus('error');
        setErrorMessage(result.error || t('errorMessage'));
      }
    } catch (error: any) {
      console.error('Newsletter submission detailed error:', error);
      // Try to log more details for debugging
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
      }
      setLocalStatus('error');
      setErrorMessage(t('errorMessage'));
    }
  };
  
  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="newsletter-container">
      <h3 className="text-lg font-semibold mb-4">{displayLabel}</h3>
      <p className="text-gray-400 mb-5 text-sm">{displayText}</p>
      
      {localStatus === 'success' ? (
        <div 
          className="mb-4 p-3 bg-green-800 bg-opacity-30 rounded-lg text-green-300 flex items-center"
          role="alert"
          aria-live="polite"
        >
          <MdCheck className={`${isRtl ? 'ml-2' : 'mr-2'} text-green-400`} size={18} />
          <span className="text-sm">{successMessage || t('thankYou')}</span>
        </div>
      ) : localStatus === 'error' && errorMessage.includes('unavailable') ? (
        <div className="space-y-3">
          <div 
            className="mb-4 p-3 bg-gray-800 rounded-lg text-gray-300 text-sm"
            role="alert"
            aria-live="polite"
          >
            {errorMessage}
            <div className="mt-2">
              <a 
                href="mailto:info@archwayeg.com" 
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Email us directly
              </a>
            </div>
          </div>
          <button
            onClick={() => setLocalStatus('idle')}
            className="text-blue-400 hover:text-blue-300 text-sm underline"
          >
            Try again
          </button>
        </div>
      ) : (
        <form 
          onSubmit={handleSubmit} 
          className="flex flex-col space-y-3"
          aria-label="Newsletter subscription form"
        >
          <div className="relative">
            <label htmlFor="newsletter-email" className="sr-only">
              {t('placeholder')}
            </label>
            <div className="relative flex items-center">
              <div className={`absolute ${isRtl ? 'right-3' : 'left-3'} flex items-center justify-center pointer-events-none`}>
                <MdOutlineEmail className="text-gray-500" size={16} />
              </div>
              <input
                id="newsletter-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('placeholder')}
                className={`w-full ${isRtl ? 'pr-10 text-right' : 'pl-10 text-left'} py-2.5 text-sm text-white bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-required="true"
                aria-invalid={localStatus === 'error'}
                aria-describedby={localStatus === 'error' ? "newsletter-error" : undefined}
                disabled={localStatus === 'submitting'}
                dir={isRtl ? 'rtl' : 'ltr'}
              />
            </div>
          </div>
          
          {localStatus === 'error' && (
            <div 
              id="newsletter-error" 
              className="text-red-400 text-xs px-2" 
              role="alert"
              aria-live="assertive"
            >
              {errorMessage}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full px-4 py-2.5 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
            disabled={localStatus === 'submitting'}
            aria-busy={localStatus === 'submitting'}
          >
            {localStatus === 'submitting' ? (
              <>
                <FaSpinner className={`animate-spin ${isRtl ? 'ml-2' : 'mr-2'}`} aria-hidden="true" />
                {displaySubmittingText}
              </>
            ) : (
              displaySubscribeText
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default NewsletterForm; 