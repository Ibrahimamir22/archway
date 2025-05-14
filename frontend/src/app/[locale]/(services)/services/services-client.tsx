'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useServiceCategories, Service, ServiceCategory } from '@/lib/hooks';

// Direct import of ServiceCard instead of using ServiceGrid
import ServiceCard from '@/components/services/card/ServiceCard';

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
  const [services, setServices] = useState<Service[]>(initialServices);
  const [loading, setLoading] = useState(false);
  
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
      
      {/* Services Listing - Direct implementation instead of using ServiceGrid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-200 h-80 rounded-lg"></div>
              ))}
            </div>
          ) : initialServices.length === 0 ? (
            <div className={`bg-gray-50 border border-gray-200 p-8 rounded-md text-center ${isRtl ? 'text-right' : ''}`}>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{t('noServices')}</h3>
              <p className="text-gray-600 mb-2">{t('tryDifferentCategory')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {initialServices.map((service: Service) => (
                <div key={service.id || service.slug}>
                  <ServiceCard
                    service={service}
                    priority={false}
                    locale={locale}
                  />
                </div>
              ))}
            </div>
          )}
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