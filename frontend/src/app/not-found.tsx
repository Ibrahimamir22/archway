// 'use client'; // No longer needed

import React from 'react';
import Link from 'next/link';
// Remove client hooks
// import { useTranslations } from 'next-intl'; 
// import { usePathname } from 'next/navigation';

export default function NotFound() {
  // Keep it simple - localized version handles translations
  // const t = useTranslations('common'); 
  // const pathname = usePathname();
  // const likelyLocale = pathname.split('/')[1];
  // const homeHref = locales.includes(likelyLocale) ? `/${likelyLocale}` : '/';
  const homeHref = '/'; // Default link to absolute root

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-brand-blue mb-4">404</h1>
      <p className="text-2xl font-semibold mb-4">Page Not Found</p>
      <p className="text-gray-600 mb-8 max-w-md">
        Sorry, the page you are looking for does not exist or has been moved.
      </p>
      <Link href={homeHref} className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue-light">
        Go Back Home
      </Link>
    </div>
  );
}

// Translations removed for now.

// No getStaticProps needed in App Router for this simple case.
// Next.js automatically renders this component for 404 errors.
// Ensure you have the translation keys (e.g., notFoundTitle) in your common.json (or relevant) message files.
