import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Pattern } from '@/components/ui/Pattern';
import OptimizedAboutClient from '@/components/marketing/about/OptimizedAboutClient';

// Generate metadata for better SEO
export async function generateMetadata({ 
  params 
}: { 
  params: { locale: string } 
}): Promise<Metadata> {
  // Get translations for metadata
  const t = await getTranslations({ locale: params.locale, namespace: 'About' });
  
  return {
    title: t('meta.title'),
    description: t('meta.description'),
    openGraph: {
      title: t('meta.og.title'),
      description: t('meta.og.description'),
      images: ['/images/about-og-image.jpg'],
    },
  };
}

// Main About page server component
export default async function AboutPage({ 
  params 
}: { 
  params: { locale: string } 
}) {
  // Get translations for the page
  const t = await getTranslations({ locale: params.locale, namespace: 'About' });
  const isRtl = params.locale === 'ar';
  
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
      
      {/* Client component for interactive elements with centralized data management */}
      <OptimizedAboutClient locale={params.locale} />
    </main>
  );
} 