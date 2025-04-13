'use client';
/** @jsxImportSource react */

import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'next-i18next';
import { useNewsletterSubscription } from '../../../hooks/ui/useFooter';
import { PiSpinnerGap } from 'react-icons/pi';
import { MdOutlineEmail } from 'react-icons/md';
import { FaCheck, FaTimesCircle } from 'react-icons/fa';

interface NewsletterFormProps {
  isRtl?: boolean;
}

const NewsletterForm: React.FC<NewsletterFormProps> = ({ isRtl = false }) => {
  const { t } = useTranslation('common');
  const { subscribeToNewsletter } = useNewsletterSubscription();
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [hasSubscribed, setHasSubscribed] = useState(false);
  const [toastMessage, setToastMessage] = useState<{
    message: string;
    type: 'success' | 'error';
    visible: boolean;
  } | null>(null);
  
  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  
  // Hide toast after 5 seconds
  useEffect(() => {
    if (toastMessage?.visible) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);
  
  // Validate email on change
  useEffect(() => {
    if (email && !emailRegex.test(email)) {
      setEmailError(t('newsletter.invalidEmail'));
    } else {
      setEmailError('');
    }
  }, [email, t]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clear previous errors
    setEmailError('');
    
    // Validate email
    if (!email.trim()) {
      setEmailError(t('newsletter.emptyEmail'));
      return;
    }
    
    if (!emailRegex.test(email)) {
      setEmailError(t('newsletter.invalidEmail'));
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await subscribeToNewsletter(email);
      
      if (result.success) {
        setHasSubscribed(true);
        setEmail('');
        setToastMessage({
          message: t('newsletter.success'),
          type: 'success',
          visible: true
        });
      } else {
        setEmailError(result.error || t('newsletter.error'));
        setToastMessage({
          message: result.error || t('newsletter.error'),
          type: 'error',
          visible: true
        });
      }
    } catch (error) {
      setEmailError(t('newsletter.error'));
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mt-3 lg:mt-0">
      <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200 uppercase mb-3">
        {t('newsletter.title')}
      </h4>
      <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
        {t('newsletter.description')}
      </p>
      
      {toastMessage && (
        <div 
          className={`mb-4 p-3 rounded-md ${
            toastMessage.type === 'success' 
              ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' 
              : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <FaCheck className="inline mr-2" />
          ) : (
            <FaTimesCircle className="inline mr-2" />
          )}
          <span>{toastMessage.message}</span>
        </div>
      )}
      
      {hasSubscribed ? (
        <div className="flex items-center p-3 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-md">
          <FaCheck className="mr-2" />
          <span>{t('newsletter.thankYou')}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-2">
          <div className={`relative ${emailError ? 'mb-1' : 'mb-4'}`}>
            <div className={`absolute inset-y-0 left-0 flex items-center pl-3 ${isFocused ? 'text-blue-500' : 'text-gray-400'}`}>
              <MdOutlineEmail className="h-5 w-5" />
            </div>
            <input
              ref={inputRef}
              type="email"
              name="email"
              id="newsletter-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder={t('newsletter.placeholder')}
              className={`block w-full py-2.5 pl-10 pr-3 border ${
                emailError 
                  ? 'border-red-300 dark:border-red-600 text-red-600 dark:text-red-300 focus:border-red-500 focus:ring-red-500' 
                  : 'border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 focus:border-blue-500 focus:ring-blue-500'
              } rounded-md shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-500 dark:bg-gray-800 focus:outline-none focus:ring-2 transition-colors duration-200`}
              aria-invalid={!!emailError}
              aria-describedby={emailError ? "email-error" : undefined}
              dir={isRtl ? 'rtl' : 'ltr'}
              disabled={isLoading}
            />
          </div>
          
          {emailError && (
            <p id="email-error" className="text-red-600 dark:text-red-400 text-xs mt-1 mb-3 flex items-center">
              <FaTimesCircle className="mr-1" /> {emailError}
            </p>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:bg-blue-700 dark:hover:bg-blue-600 transition-colors duration-200 disabled:opacity-70 disabled:cursor-not-allowed ${
              isRtl ? 'flex-row-reverse' : ''
            }`}
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <PiSpinnerGap className={`animate-spin h-5 w-5 ${isRtl ? 'ml-2' : 'mr-2'}`} />
                <span>{t('newsletter.subscribing')}</span>
              </>
            ) : (
              <span>{t('newsletter.subscribe')}</span>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default NewsletterForm; 