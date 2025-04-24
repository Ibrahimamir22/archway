import React from 'react';
import { ScrollReveal } from '@/components/ui';

interface FAQTeaserProps {
  t: (key: string) => string;
  isRtl: boolean;
  locale: string;
}

const FAQTeaser: React.FC<FAQTeaserProps> = ({ t, isRtl, locale }) => {
  return (
    <ScrollReveal 
      animation="fade-in" 
      delay={0.3} 
      offset="-100px"
    >
      <section 
        className="mt-20 md:mt-24 text-center p-8 rounded-xl bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm shadow-sm border border-gray-100 dark:border-gray-800" 
        aria-labelledby="faq-heading"
      >
        <h2 id="faq-heading" className="text-2xl font-heading font-bold mb-4 text-brand-blue dark:text-white">
          {t('frequentlyAsked')}
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{t('cannotFind')}</p>
        <a 
          href={`/${locale}/faq`} 
          className="inline-flex items-center justify-center px-5 py-3 bg-brand-blue/10 dark:bg-brand-blue/20 text-brand-blue dark:text-brand-accent rounded-lg hover:bg-brand-blue/20 dark:hover:bg-brand-blue/30 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue dark:focus:ring-brand-accent focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          {t('viewFaq')}
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
    </ScrollReveal>
  );
};

export default FAQTeaser; 