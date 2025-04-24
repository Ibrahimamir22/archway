import React from 'react';
import { TimelineItem } from './TimelineItem';
import { TimelineDivider } from './TimelineDivider';
import { useCompanyHistory } from '@/lib/hooks/marketing/about';
import { LoadingState, ErrorMessage, ScrollReveal } from '@/components/ui';

interface CompanyHistoryProps {
  t: (key: string) => string;
  isRtl: boolean;
  locale: string;
}

const CompanyHistory: React.FC<CompanyHistoryProps> = ({ t, isRtl, locale }) => {
  const { historyData, loading, error, refetch } = useCompanyHistory(locale);
  
  // Group events by era
  const getEventsByEra = () => {
    const eventsByEra: Record<string, typeof historyData.events> = {};
    
    historyData.eras.forEach(era => {
      eventsByEra[era] = historyData.events.filter(event => event.era === era);
    });
    
    return eventsByEra;
  };

  return (
    <section className="mb-20">
      <ScrollReveal animation="fade-in" delay={0.1}>
        <h2 className="text-3xl font-heading font-semibold mb-8 text-center text-brand-blue dark:text-white">
          {t('ourJourney')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-center mb-12">
          {t('journeyDescription')}
        </p>
      </ScrollReveal>
      
      {loading && (
        <div className="my-12">
          <LoadingState text={t('loadingHistory')} />
        </div>
      )}
      
      {error && (
        <div className="py-8">
          <ErrorMessage 
            message={error.message || t('errorLoadingHistory')} 
            retryText={t('retry')}
            onRetry={refetch}
          />
        </div>
      )}
      
      {!loading && !error && historyData.events.length > 0 && (
        <div className="relative">
          {/* Mobile timeline (visible only on small screens) */}
          <div className="md:hidden">
            {historyData.eras.map((era, eraIndex) => (
              <div key={`era-${eraIndex}`}>
                <TimelineDivider label={t(`era.${era.toLowerCase()}`)} />
                
                {historyData.events
                  .filter(event => event.era === era)
                  .map((event, eventIndex) => (
                    <ScrollReveal
                      key={event.id}
                      animation="slide-up"
                      delay={0.1 * eventIndex}
                    >
                      <div className="bg-white dark:bg-gray-800 p-6 mb-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 relative">
                        <div className="absolute -top-3 left-4 px-3 py-1 bg-brand-blue dark:bg-brand-blue/80 text-white text-sm font-medium rounded-full">
                          {event.year}
                        </div>
                        <div className="mt-3">
                          <h3 className="text-xl font-semibold mb-2 text-brand-blue dark:text-white">
                            {event.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            {event.description}
                          </p>
                          
                          {event.image && (
                            <div className="mt-4 rounded-lg overflow-hidden">
                              <img 
                                src={event.image} 
                                alt={event.title} 
                                className="w-full h-auto object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
              </div>
            ))}
          </div>
          
          {/* Desktop timeline (hidden on small screens) */}
          <div className="hidden md:block">
            {historyData.eras.map((era, eraIndex) => (
              <div key={`era-${eraIndex}`}>
                <TimelineDivider label={t(`era.${era.toLowerCase()}`)} />
                
                {historyData.events
                  .filter(event => event.era === era)
                  .map((event, eventIndex) => (
                    <TimelineItem
                      key={event.id}
                      year={event.year}
                      title={event.title}
                      description={event.description}
                      image={event.image}
                      index={eventIndex}
                      isRtl={isRtl}
                    />
                  ))}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {!loading && !error && historyData.events.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {t('noHistoryFound')}
        </div>
      )}
    </section>
  );
};

export default CompanyHistory; 