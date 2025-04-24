import React from 'react';
import { Metadata } from 'next';
import { locales } from "@/../i18n";
import { notFound } from "next/navigation";
import { Pattern } from '@/components/ui/Pattern';
import { FAQServer } from '@/components/marketing/faq';

export async function generateMetadata(
  { params: { locale } }: { params: { locale: string } }
): Promise<Metadata> {
  let metaMessages;
  try {
    metaMessages = require(`@/../src/messages/${locale}.json`);
  } catch (e) {
    metaMessages = require(`@/../src/messages/${locales[0]}.json`); // Fallback
  }
  const faqNamespace = metaMessages?.faq || {};
  
  return {
    title: faqNamespace.pageTitle || 'Frequently Asked Questions',
    description: faqNamespace.pageDescription || 'Find answers to common questions about Archway Interior Design services'
  };
}

export default function FAQPage({ params: { locale } }: { params: { locale: string }}) {
  // Explicitly load messages for this page
  let messages;
  try {
    messages = require(`@/../src/messages/${locale}.json`);
  } catch (error) {
    console.error(`FAQPage: Failed loading messages for ${locale}`, error);
    messages = require(`@/../src/messages/${locales[0]}.json`); // Fallback
  }
  
  // Access the specific namespace for FAQ
  const faqMessages = messages?.faq || {};
  
  // Helper function to get translation
  const t = (key: string): string => {
    return faqMessages[key] || key;
  };
  
  const isRtl = locale === 'ar';
  
  if (!messages?.faq) {
    console.error(`FAQ namespace not found in messages for locale ${locale}`);
    // Optional: return a loading/error state or call notFound()
  }

  return (
    <main 
      className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 min-h-[90vh]"
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {/* Background pattern overlay */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10" aria-hidden="true">
        <Pattern />
      </div>
      
      {/* Decorative elements */}
      <div 
        className="absolute top-20 -left-20 w-64 h-64 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-full blur-3xl"
        aria-hidden="true"
      ></div>
      <div 
        className="absolute bottom-20 -right-20 w-80 h-80 bg-brand-accent/10 dark:bg-brand-accent/20 rounded-full blur-3xl"
        aria-hidden="true"
      ></div>
      
      <div className="relative container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <header className="text-center mb-16 animate-fade-in">
            <span className="inline-block px-4 py-1.5 bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue dark:text-brand-accent rounded-full text-sm font-medium mb-6">
              {t('helpSection')}
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold mb-6 text-brand-blue dark:text-white">
              {t('title') || 'Frequently Asked Questions'}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
              {t('subtitle') || 'Find answers to common questions about our services and process'}
            </p>
          </header>
          
          {/* FAQ Component */}
          <section className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <FAQServer locale={locale} />
          </section>
          
          {/* Still Have Questions Section */}
          <section 
            className="mt-20 md:mt-24 text-center animate-fade-in p-8 rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm shadow-sm border border-gray-100 dark:border-gray-800" 
            style={{ animationDelay: '0.5s' }}
            aria-labelledby="contact-heading"
          >
            <h2 id="contact-heading" className="text-2xl font-heading font-bold mb-4 text-brand-blue dark:text-white">
              {t('stillHaveQuestions')}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {t('contactUsForMore')}
            </p>
            <a 
              href={`/${locale}/contact`} 
              className="inline-flex items-center justify-center px-5 py-3 bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue dark:text-brand-accent rounded-lg hover:bg-brand-blue/20 dark:hover:bg-brand-blue/30 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-accent focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {t('contactUs')}
              <svg 
                className={`w-4 h-4 ${isRtl ? 'mr-2 rotate-180' : 'ml-2'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </a>
          </section>
        </div>
      </div>
    </main>
  );
} 