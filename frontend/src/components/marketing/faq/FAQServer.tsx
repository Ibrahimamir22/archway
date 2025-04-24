import { getTranslations } from 'next-intl/server';
import { getFAQs } from '@/lib/api/faq';
import FAQClient from './FAQ.client';
import { notFound } from 'next/navigation';

interface FAQServerProps {
  locale: string;
}

/**
 * Server component for FAQ page
 * Fetches data on the server and delegates to client component for interactivity
 * 
 * This follows the established pattern from other server component migrations:
 * - Server component handles data fetching
 * - Client component handles interactivity
 */
export default async function FAQServer({ locale }: FAQServerProps) {
  // Get translations for the current locale
  const t = await getTranslations('faq');
  const isRtl = locale === 'ar';
  
  try {
    // Fetch FAQs on the server
    const { faqs, categories } = await getFAQs(locale);
    
    if (!faqs || faqs.length === 0 || !categories || categories.length === 0) {
      console.error('No FAQ data available');
      return (
        <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-6 text-center">
          <p className="text-red-600 dark:text-red-400">{t('errorLoadingFAQs')}</p>
        </div>
      );
    }
    
    // Sort categories by order if available
    const sortedCategories = [...categories].sort((a, b) => {
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order;
      }
      return 0;
    });
    
    // Pass data and translations to the client component
    return (
      <FAQClient
        faqs={faqs}
        categories={sortedCategories}
        locale={locale}
        isRtl={isRtl}
        translations={{
          allCategories: t('allCategories'),
          searchPlaceholder: t('searchPlaceholder'),
          noResults: t('noResults'),
          tryDifferentSearch: t('tryDifferentSearch'),
          tryAgain: t('tryAgain'),
          errorLoadingFAQs: t('errorLoadingFAQs')
        }}
      />
    );
  } catch (error) {
    console.error('Error rendering FAQs:', error);
    return (
      <div className="p-6 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400">
        {t('errorLoadingFAQs')}
      </div>
    );
  }
} 