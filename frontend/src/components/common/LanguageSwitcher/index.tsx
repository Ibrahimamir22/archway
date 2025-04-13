import React, { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import LanguageSwitcherComponent, { Language, languages } from './LanguageSwitcher';

// Export types
export type { Language };
export { languages };

// Export the LanguageSwitcher component
export default LanguageSwitcherComponent;

/**
 * Language switcher component with optimized language switching
 */
const LanguageSwitcher: React.FC = () => {
  const router = useRouter();
  const { i18n } = useTranslation();
  const { locale, asPath } = router;
  
  // Determine the other locale
  const otherLocale = locale === 'en' ? 'ar' : 'en';
  
  // Preload language files on hover to make switching faster
  const handleMouseEnter = useCallback(() => {
    // Get the current path - handles both shallow and deep routes
    const path = asPath || '/';
    
    // Prefetch the current page in the other language
    router.prefetch(path, undefined, { locale: otherLocale });
    
    // Force preload language file
    i18n.loadLanguages(otherLocale).catch(err => {
      console.warn('Error preloading language:', err);
    });
  }, [asPath, router, otherLocale, i18n]);
  
  return (
    <div className="flex items-center z-20 relative">
      <Link
        href={asPath}
        locale={otherLocale}
        className="flex items-center justify-center w-10 h-10 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors duration-200"
        onMouseEnter={handleMouseEnter}
        aria-label={`Switch to ${otherLocale === 'en' ? 'English' : 'Arabic'}`}
      >
        <span className="text-sm font-medium">
          {otherLocale === 'en' ? 'EN' : 'AR'}
        </span>
      </Link>
    </div>
  );
}; 