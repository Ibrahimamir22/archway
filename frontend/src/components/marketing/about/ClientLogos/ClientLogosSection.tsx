import React from 'react';
import LogoItem from './LogoItem';
import { ClientLogo } from '@/types/marketing';
import { LoadingState, ScrollReveal } from '@/components/ui';

interface ClientLogosSectionProps {
  t: (key: string) => string;
  isRtl: boolean;
  locale: string;
  featuredOnly?: boolean;
  logos?: ClientLogo[];
}

const ClientLogosSection: React.FC<ClientLogosSectionProps> = ({ 
  t, 
  isRtl, 
  locale,
  featuredOnly = false,
  logos = []
}) => {
  const isLoading = !logos;
  
  // Filter logos based on featured flag
  const filteredLogos = featuredOnly 
    ? logos.filter(logo => logo.is_active !== false) 
    : logos;

  // Debug output
  console.log('Logos props received:', logos);
  console.log('Filtered logos:', filteredLogos);

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
      
      {isLoading && (
        <div className="my-12">
          <LoadingState text={t('loadingLogos')} />
        </div>
      )}
      
      {!isLoading && filteredLogos.length > 0 && (
        <>
          {/* Logos grid */}
          <div 
            className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${isRtl ? 'dir-rtl' : ''}`}
          >
            {filteredLogos.map((logo, index) => (
              <LogoItem
                key={logo.id || index}
                name={logo.name}
                image={logo.logo_url || logo.logo}
                website={logo.url}
                delay={0.05 * (index % 4)}
                fadeEffect={true}
              />
            ))}
          </div>
          
          {/* No results message */}
          {filteredLogos.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              {t('noLogosFound')}
            </div>
          )}
        </>
      )}
      
      {!isLoading && (!logos || logos.length === 0) && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {t('noLogosFound')}
        </div>
      )}
    </section>
  );
};

export default ClientLogosSection; 