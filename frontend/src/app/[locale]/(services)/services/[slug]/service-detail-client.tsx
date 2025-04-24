'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Service } from '@/lib/hooks/services/types';
import { useServiceCategories } from '@/lib/hooks';
import Link from 'next/link';
import ServiceDetail from '@/components/services/detail/ServiceDetail';

// Import from service API utilities
import { getRelatedServices } from '@/lib/api/services';

interface ServiceDetailClientProps {
  service: Service;
  locale: string;
}

const ServiceDetailClient: React.FC<ServiceDetailClientProps> = ({
  service,
  locale
}) => {
  const t = useTranslations('services');
  const isRtl = locale === 'ar';
  
  return (
    <div className="min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className={`bg-gray-50 py-4 mb-8 border-b ${isRtl ? 'rtl' : ''}`}>
        <div className="container mx-auto px-4">
          <nav className="text-sm text-gray-500">
            <Link href={`/${locale}`} className="hover:underline">
              {t('home', { default: 'Home' })}
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/${locale}/services`} className="hover:underline">{t('title')}</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-700">{service.title}</span>
          </nav>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <ServiceDetail 
              service={service}
              className="mb-12"
              locale={locale}
            />
          </div>
          
          <div className="lg:col-span-1">
            {/* Sidebar content if needed */}
            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold mb-4">{t('sidebar.contactInfo')}</h3>
              <p className="mb-6 text-gray-700">{t('sidebar.contactText')}</p>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-1">{t('sidebar.email')}</h4>
                  <a href="mailto:contact@example.com" className="text-brand-blue hover:underline">
                    contact@example.com
                  </a>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-1">{t('sidebar.phone')}</h4>
                  <a href="tel:+123456789" className="text-brand-blue hover:underline">
                    +1 (234) 567-890
                  </a>
                </div>
                
                <div className="pt-4 border-t">
                  <Link 
                    href={`/${locale}/services`} 
                    className="flex items-center text-brand-blue hover:underline"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    {t('backToServices')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Services Section - We'll implement this later with server data fetching */}
      </div>
    </div>
  );
};

export default ServiceDetailClient; 