'use client';

import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { useNewsletterSubscription } from '../../../hooks/ui/useFooter';

export interface NewsletterFormProps {
  // Add props if needed
}

const NewsletterForm = (props: NewsletterFormProps): JSX.Element => {
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{text: string; isError: boolean} | null>(null);
  const { subscribeToNewsletter } = useNewsletterSubscription();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({
        text: t('footer.newsletter.emailRequired'),
        isError: true
      });
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({
        text: t('footer.newsletter.invalidEmail'),
        isError: true
      });
      return;
    }
    
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const result = await subscribeToNewsletter(email);
      
      if (result.success) {
        setMessage({
          text: t('footer.newsletter.successMessage'),
          isError: false
        });
        setEmail('');
      } else {
        setMessage({
          text: result.error || t('footer.newsletter.errorMessage'),
          isError: true
        });
      }
    } catch (error) {
      setMessage({
        text: t('footer.newsletter.errorMessage'),
        isError: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('footer.newsletter.placeholder') || "Enter your email"}
          className="px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
          aria-label={t('footer.newsletter.placeholder') || "Email for newsletter"}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-brand-blue text-white rounded hover:bg-brand-blue-dark transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('common.submitting')}
            </span>
          ) : (
            t('footer.newsletter.subscribe') || "Subscribe"
          )}
        </button>
      </div>
      
      {message && (
        <p className={`mt-2 text-sm ${message.isError ? 'text-red-400' : 'text-green-400'}`}>
          {message.text}
        </p>
      )}
    </form>
  );
};

export default NewsletterForm; 