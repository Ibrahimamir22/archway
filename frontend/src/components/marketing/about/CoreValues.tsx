import React, { useCallback } from 'react';
import { useCoreValues } from '@/lib/hooks/marketing/about';
import { LoadingState, ErrorMessage, ScrollReveal } from '@/components/ui';

interface CoreValue {
  id: number;
  title: string;
  text: string;
  icon: React.ReactNode;
}

interface CoreValuesProps {
  t: (key: string) => string;
  isRtl: boolean;
  locale: string;
}

const CoreValues: React.FC<CoreValuesProps> = ({ t, isRtl, locale }) => {
  // Function to get icons based on id
  const getIcon = useCallback((id: number) => {
    switch (id) {
      case 1:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"></path>
          </svg>
        );
      case 2:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
          </svg>
        );
      case 3:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        );
      case 4:
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
        );
      default:
        return null;
    }
  }, []);

  const { coreValues, loading, error, refetch } = useCoreValues(locale, t, getIcon);

  return (
    <section className="mb-20">
      <ScrollReveal animation="fade-in" delay={0.1} offset="-50px">
        <h2 className="text-3xl font-heading font-semibold mb-8 text-center text-brand-blue dark:text-white">
          {t('values')}
        </h2>
      </ScrollReveal>
      
      {loading && (
        <LoadingState type="values" text={t('loadingValues')} />
      )}
      
      {error && (
        <div className="py-8">
          <ErrorMessage 
            message={error || t('errorLoadingValues')} 
            retryText={t('retry')}
            onRetry={refetch}
          />
        </div>
      )}
      
      {!loading && !error && coreValues.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {coreValues.map((value, index) => (
            <ScrollReveal 
              key={value.id} 
              animation="zoom-in"
              delay={0.1 + (index * 0.1)}
              offset="-50px"
            >
              <div 
                className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow h-full"
              >
                <div className={`flex flex-col ${isRtl ? 'items-end text-right' : ''}`}>
                  <div className="w-12 h-12 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-full flex items-center justify-center mb-4">
                    <div className="text-brand-blue dark:text-brand-accent">
                      {value.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-brand-blue dark:text-white">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{value.text}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      )}
      
      {!loading && !error && coreValues.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {t('noCoreValuesFound')}
        </div>
      )}
    </section>
  );
};

export default CoreValues; 