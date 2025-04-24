'use client';

import { useEffect, useState } from 'react';
import arTranslations from '@/messages/ar.json';
import enTranslations from '@/messages/en.json';

export default function NotFound() {
  const [locale, setLocale] = useState('en');
  
  useEffect(() => {
    // Detect locale from URL - most reliable client-side method
    const pathname = window.location.pathname;
    const isArabic = pathname.includes('/ar/');
    setLocale(isArabic ? 'ar' : 'en');
  }, []);

  // Get translations from the imported files
  const translations = locale === 'ar' ? arTranslations : enTranslations;
  const isArabic = locale === 'ar';
  
  // Extract the specific translations we need
  const t = {
    errorCode: translations.common.errorCode || (isArabic ? '٤٠٤' : '404'), // Get from translations or fall back to numerals
    notFoundTitle: translations.common.notFoundTitle,
    notFoundDescription: translations.common.notFoundDescription,
    backToHome: translations.common.backToHome
  };
  
  // Home link
  const homeHref = `/${locale}`;
  
  return (
    <div 
      className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center" 
      dir={isArabic ? 'rtl' : 'ltr'}
    >
      <h1 className="text-6xl font-bold text-brand-blue mb-4">{t.errorCode}</h1>
      <p className="text-2xl font-semibold mb-4">{t.notFoundTitle}</p>
      <p className="text-gray-600 mb-8 max-w-md">{t.notFoundDescription}</p>
      <a 
        href={homeHref}
        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-light"
      >
        {t.backToHome}
      </a>
    </div>
  );
} 