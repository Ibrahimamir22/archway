'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import LanguageSwitcher from '../LanguageSwitcher/index';
import PrefetchLink from '../PrefetchLink';

export interface NavbarProps {
  // Add any props if needed in the future
}

const Navbar = (props: NavbarProps): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const t = useTranslations('header');
  const params = useParams(); // Get params to know the context

  // Add Logging
  const pageType = params?.slug ? 'Slug Page' : 'Other Page';
  console.log(`Navbar (${pageType}): Locale is "${locale}", RTL is ${isRtl}`);
  try {
    const homeText = t('home');
    console.log(`Navbar (${pageType}): t('home') resolved to "${homeText}"`);
  } catch (e) {
    console.error(`Navbar (${pageType}): Error resolving t('home'):`, e);
  }
  // End Logging

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <PrefetchLink href={`/${locale}`} className="flex items-center">
            <div className="relative w-[180px] h-[60px] hover:scale-105 transition-transform">
              <Image 
                src="/images/Archway.png" 
                alt="Archway Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
          </PrefetchLink>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 rtl:space-x-reverse">
            <PrefetchLink 
              href={`/${locale}`} 
              className="font-medium hover:text-brand-blue"
              prefetchType="route"
            >
              {t('home')}
            </PrefetchLink>
            <PrefetchLink 
              href={`/${locale}/portfolio`} 
              className="font-medium hover:text-brand-blue"
              prefetchType="route"
              dataPrefetchPath="/api/portfolio"
              queryKey={['portfolio', 'list']}
            >
              {t('portfolio')}
            </PrefetchLink>
            <PrefetchLink 
              href={`/${locale}/services`} 
              className="font-medium hover:text-brand-blue"
              prefetchType="route"
              dataPrefetchPath="/api/services"
              queryKey={['services', 'list']}
            >
              {t('services')}
            </PrefetchLink>
            <PrefetchLink 
              href={`/${locale}/about`} 
              className="font-medium hover:text-brand-blue"
              prefetchType="route"
            >
              {t('about')}
            </PrefetchLink>
            <PrefetchLink 
              href={`/${locale}/contact`} 
              className="font-medium hover:text-brand-blue"
              prefetchType="route"
            >
              {t('contact')}
            </PrefetchLink>
          </div>

          {/* CTA Button and Language Switcher */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <LanguageSwitcher />
            <PrefetchLink 
              href={`/${locale}/contact`}
              className="bg-brand-blue text-white px-4 py-2 rounded hover:bg-brand-blue-light transition-colors"
              prefetchType="route"
            >
              {t('getQuote')}
            </PrefetchLink>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pt-4 pb-2 space-y-4 animate-fade-in">
            <PrefetchLink 
              href={`/${locale}`} 
              className="block font-medium hover:text-brand-blue py-2"
              prefetchType="route"
            >
              {t('home')}
            </PrefetchLink>
            <PrefetchLink 
              href={`/${locale}/portfolio`} 
              className="block font-medium hover:text-brand-blue py-2"
              prefetchType="route"
            >
              {t('portfolio')}
            </PrefetchLink>
            <PrefetchLink 
              href={`/${locale}/services`} 
              className="block font-medium hover:text-brand-blue py-2"
              prefetchType="route"
            >
              {t('services')}
            </PrefetchLink>
            <PrefetchLink 
              href={`/${locale}/about`} 
              className="block font-medium hover:text-brand-blue py-2"
              prefetchType="route"
            >
              {t('about')}
            </PrefetchLink>
            <PrefetchLink 
              href={`/${locale}/contact`} 
              className="block font-medium hover:text-brand-blue py-2"
              prefetchType="route"
            >
              {t('contact')}
            </PrefetchLink>
            <div className="flex items-center justify-between py-2">
              <LanguageSwitcher />
              <PrefetchLink 
                href={`/${locale}/contact`}
                className="bg-brand-blue text-white px-4 py-2 rounded hover:bg-brand-blue-light transition-colors"
                prefetchType="route"
              >
                {t('getQuote')}
              </PrefetchLink>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 