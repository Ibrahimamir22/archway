import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function NotFound() {
  const { t } = useTranslation('common');
  
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16">
      <h1 className="text-4xl font-bold mb-4">404</h1>
      <p className="text-xl mb-8">{t('projectNotFound', 'Page Not Found')}</p>
      <p className="text-gray-600 mb-8 max-w-md text-center">
        {t('projectNotFoundDesc', 'The page you are looking for does not exist or may have been removed.')}
      </p>
      <Link href="/" className="btn btn-primary">
        {t('backToHome', 'Back to Home')}
      </Link>
    </div>
  );
}

export async function getStaticProps({ locale = 'en' }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 