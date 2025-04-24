'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useServiceCategories, Service, ServiceCategory } from '@/lib/hooks';

// Update imports to use our new server component and avoid direct imports from hooks
import ServiceGrid from '@/components/services/list/ServiceGrid';

interface ServicesClientProps {
  initialServices: Service[];
  initialCategories: ServiceCategory[];
  selectedCategory?: string;
  locale: string;
}

export default function ServicesClient({ 
  initialServices,
  initialCategories,
  selectedCategory,
  locale 
}: ServicesClientProps) {
  const t = useTranslations('services');
  const router = useRouter();
  const isRtl = locale === 'ar';
  
  const [category, setCategory] = useState<string | undefined>(selectedCategory);
  
  // Just use service categories from props, we'll let ServiceGrid handle the services
  const { categories } = useServiceCategories(initialCategories);
  
  // Update state when URL parameter changes
  useEffect(() => {
    setCategory(selectedCategory);
  }, [selectedCategory]);
  
  // Handle category selection
  const handleCategoryChange = (slug: string | undefined) => {
    setCategory(slug);
    
    const url = slug 
      ? `/services?category=${slug}` 
      : '/services';
      
    router.push(`/${locale}${url}`);
  };
  
  // Need to check if 'common.tryAgain' is used. If so, we need a separate hook for common.
  const tCommon = useTranslations('common'); 
  
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-brand-blue text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className={`text-center ${isRtl ? 'rtl' : ''}`}>
            <h1 className="text-4xl md:text-5xl font-heading font-bold mb-6">
              {t('heroTitle')}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {t('heroSubtitle')}
            </p>
          </div>
        </div>
      </section>
      
      {/* Categories Filter */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className={`flex flex-wrap gap-4 justify-center ${isRtl ? 'rtl' : ''}`}>
            <button
              onClick={() => handleCategoryChange(undefined)}
              className={`px-4 py-2 rounded-full ${
                !category
                  ? 'bg-brand-blue text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              } transition-colors shadow-sm`}
            >
              {t('allServices')}
            </button>
            
            {Array.isArray(categories) && categories.length > 0 ? (
              categories.map((cat: ServiceCategory) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategoryChange(cat.slug)}
                  className={`px-4 py-2 rounded-full ${
                    category === cat.slug
                      ? 'bg-brand-blue text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  } transition-colors shadow-sm`}
                >
                  {cat.name}
                </button>
              ))
            ) : null}
          </div>
        </div>
      </section>
      
      {/* Services Listing */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <ServiceGrid
            initialServices={initialServices}
            category={category}
            lang={locale}
          />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-brand-light py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className={`text-3xl md:text-4xl font-heading font-bold mb-6 ${isRtl ? 'rtl' : ''}`}>
            {t('ctaTitle')}
          </h2>
          <p className={`text-gray-600 mb-8 max-w-2xl mx-auto ${isRtl ? 'rtl' : ''}`}>
            {t('ctaSubtitle')}
          </p>
          <Link 
            href={`/${locale}/contact`} 
            className="px-6 py-3 bg-brand-blue text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            {t('contactUs')}
          </Link>
        </div>
      </section>
    </div>
  );
} 