import React, { useState } from 'react';
import { LogoItem } from './LogoItem';
import { useClientLogos } from '@/lib/hooks/marketing/about';
import { LoadingState, ErrorMessage, ScrollReveal } from '@/components/ui';

interface ClientLogosSectionProps {
  t: (key: string) => string;
  isRtl: boolean;
  locale: string;
  featuredOnly?: boolean;
}

const ClientLogosSection: React.FC<ClientLogosSectionProps> = ({ 
  t, 
  isRtl, 
  locale,
  featuredOnly = false 
}) => {
  const { logos, getFeaturedLogos, loading, error, refetch } = useClientLogos(locale);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Get all unique categories
  const getCategories = () => {
    const categories = logos
      .map(logo => logo.category)
      .filter((category): category is string => !!category);
    return [...new Set(categories)];
  };
  
  // Filter logos based on category selection and featured flag
  const filteredLogos = () => {
    let filtered = featuredOnly ? getFeaturedLogos() : logos;
    
    if (selectedCategory) {
      filtered = filtered.filter(logo => logo.category === selectedCategory);
    }
    
    return filtered;
  };

  return (
    <section className="mb-20">
      <ScrollReveal animation="fade-in" delay={0.1}>
        <h2 className="text-3xl font-heading font-semibold mb-8 text-center text-brand-blue dark:text-white">
          {featuredOnly 
            ? t('ourClients') 
            : t('trustedPartners')
          }
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-center mb-12">
          {featuredOnly 
            ? t('clientsDescription') 
            : t('partnersDescription')
          }
        </p>
      </ScrollReveal>
      
      {loading && (
        <div className="my-12">
          <LoadingState text={t('loadingLogos')} />
        </div>
      )}
      
      {error && (
        <div className="py-8 max-w-xl mx-auto">
          <ErrorMessage 
            message={error.message || t('errorLoadingLogos')} 
            retryText={t('retry')}
            onRetry={refetch}
          />
        </div>
      )}
      
      {!loading && !error && logos.length > 0 && (
        <>
          {/* Category filter - Only show if not in featured mode and has multiple categories */}
          {!featuredOnly && getCategories().length > 1 && (
            <div className="flex flex-wrap justify-center mb-8 gap-2">
              <button
                className={`px-4 py-2 rounded-full text-sm transition-colors
                  ${selectedCategory === null 
                    ? 'bg-brand-blue text-white dark:bg-brand-accent dark:text-gray-900' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                onClick={() => setSelectedCategory(null)}
              >
                {t('allCategories')}
              </button>
              
              {getCategories().map(category => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-full text-sm transition-colors
                    ${selectedCategory === category 
                      ? 'bg-brand-blue text-white dark:bg-brand-accent dark:text-gray-900' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {t(`category.${category.toLowerCase()}`, category)}
                </button>
              ))}
            </div>
          )}
          
          {/* Logos grid */}
          <div 
            className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${isRtl ? 'dir-rtl' : ''}`}
          >
            {filteredLogos().map((logo, index) => (
              <LogoItem
                key={logo.id}
                name={logo.name}
                image={logo.image}
                website={logo.website}
                delay={0.05 * (index % 4)} // Stagger animation by row
                fadeEffect={!featuredOnly} // Only apply fade effect on full listing
              />
            ))}
          </div>
          
          {/* No results message */}
          {filteredLogos().length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {selectedCategory 
                ? t('noCategoryLogosFound', { category: selectedCategory }) 
                : t('noLogosFound')
              }
            </div>
          )}
        </>
      )}
      
      {!loading && !error && logos.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {t('noLogosFound')}
        </div>
      )}
    </section>
  );
};

export default ClientLogosSection; 