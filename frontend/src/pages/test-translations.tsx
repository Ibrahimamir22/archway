import React from 'react';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Link from 'next/link';
import { useRouter } from 'next/router';

const TranslationTestPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale } = router;
  const isRtl = locale === 'ar';

  // Create a list of all translation keys to test
  const keysToTest = [
    // Header
    'header.home',
    'header.portfolio',
    'header.services',
    'header.about',
    'header.contact',
    'header.getQuote',
    
    // Footer
    'footer.copyright',
    'footer.quickLinks',
    'footer.consultancy',
    'footer.renovation',
    
    // Home
    'home.heroTitle',
    'home.heroSubtitle',
    'home.servicesTitle',
    'home.projectsTitle',
    'home.viewProject',
    
    // Portfolio
    'portfolio.title',
    'portfolio.subtitle',
    'portfolio.saveToFavorites',
    
    // About
    'about.title',
    'about.mission',
    
    // Contact
    'contact.title',
    'contact.submit',
    
    // Auth
    'auth.login',
    'auth.signup',
    
    // Common
    'common.cancel',
    'common.submit'
  ];

  return (
    <div className={`container mx-auto px-4 py-12 ${isRtl ? 'text-right' : ''}`}>
      <h1 className="text-3xl font-bold mb-8">Translation Test Page</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <h2 className="text-2xl font-bold mb-4">Current Language: {locale === 'ar' ? 'Arabic' : 'English'}</h2>
        <div className="mb-4">
          <Link href={router.pathname} locale={locale === 'ar' ? 'en' : 'ar'} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Switch to {locale === 'ar' ? 'English' : 'Arabic'}
          </Link>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {keysToTest.map((key) => (
          <div key={key} className="bg-white p-4 rounded-lg shadow-md">
            <p className="text-sm text-gray-500 mb-1">{key}</p>
            <p className="text-lg font-medium">{t(key)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default TranslationTestPage; 