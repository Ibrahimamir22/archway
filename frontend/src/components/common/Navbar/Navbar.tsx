'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import LanguageSwitcher from '../LanguageSwitcher';

export interface NavbarProps {
  // Add any props if needed in the future
}

const Navbar = (props: NavbarProps): JSX.Element => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const { locale } = router;
  const isRtl = locale === 'ar';
  const { t } = useTranslation('common');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="relative w-[180px] h-[60px] hover:scale-105 transition-transform">
              <Image 
                src="/images/Archway.png" 
                alt="Archway Logo" 
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8 rtl:space-x-reverse">
            <Link href="/" className="font-medium hover:text-brand-blue">
              {t('header.home')}
            </Link>
            <Link href="/portfolio" className="font-medium hover:text-brand-blue">
              {t('header.portfolio')}
            </Link>
            <Link href="/services" className="font-medium hover:text-brand-blue">
              {t('header.services')}
            </Link>
            <Link href="/about" className="font-medium hover:text-brand-blue">
              {t('header.about')}
            </Link>
            <Link href="/contact" className="font-medium hover:text-brand-blue">
              {t('header.contact')}
            </Link>
          </div>

          {/* CTA Button and Language Switcher */}
          <div className="hidden md:flex items-center space-x-4 rtl:space-x-reverse">
            <LanguageSwitcher />
            <Link 
              href="/contact" 
              className="bg-brand-blue text-white px-4 py-2 rounded hover:bg-brand-blue-light transition-colors"
            >
              {t('header.getQuote')}
            </Link>
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
            <Link href="/" className="block font-medium hover:text-brand-blue py-2">
              {t('header.home')}
            </Link>
            <Link href="/portfolio" className="block font-medium hover:text-brand-blue py-2">
              {t('header.portfolio')}
            </Link>
            <Link href="/services" className="block font-medium hover:text-brand-blue py-2">
              {t('header.services')}
            </Link>
            <Link href="/about" className="block font-medium hover:text-brand-blue py-2">
              {t('header.about')}
            </Link>
            <Link href="/contact" className="block font-medium hover:text-brand-blue py-2">
              {t('header.contact')}
            </Link>
            <div className="flex items-center justify-between py-2">
              <LanguageSwitcher />
              <Link 
                href="/contact" 
                className="bg-brand-blue text-white px-4 py-2 rounded hover:bg-brand-blue-light transition-colors"
              >
                {t('header.getQuote')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 