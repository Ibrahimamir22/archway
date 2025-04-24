'use client';

import React from 'react';
import StatCard from './StatCard';
import { useCompanyStats } from '@/lib/hooks/marketing/about';
import { LoadingState, ErrorMessage, ScrollReveal } from '@/components/ui';

interface StatsSectionProps {
  t: (key: string) => string;
  isRtl: boolean;
  locale: string;
}

const StatsSection: React.FC<StatsSectionProps> = ({ t, isRtl, locale }) => {
  const { companyStats, isLoading, error, retry } = useCompanyStats(locale);
  
  // Function to get the right icon based on the icon property
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'fas fa-smile':
        return <span className="text-2xl">😊</span>;
      case 'fas fa-users':
        return <span className="text-2xl">👥</span>;
      case 'fas fa-calendar':
        return <span className="text-2xl">📅</span>;
      case 'fas fa-building':
        return <span className="text-2xl">🏢</span>;
      default:
        return <span className="text-2xl">📊</span>;
    }
  };

  // Prepare stats data from API or use fallback
  const statsData = React.useMemo(() => {
    if (companyStats && Array.isArray(companyStats.stats)) {
      return companyStats.stats;
    }
    
    // Fallback data if API fails
    return [
      {
        id: 'stat1',
        title: t('stat.client_satisfaction'),
        value: 98.5,
        suffix: '%',
        icon: 'fas fa-smile',
        description: t('stat.client_satisfaction_desc'),
        order: 1
      },
      {
        id: 'stat2',
        title: t('stat.happy_clients'),
        value: 120,
        prefix: '+',
        icon: 'fas fa-users',
        description: t('stat.happy_clients_desc'),
        order: 2
      },
      {
        id: 'stat3',
        title: t('stat.years_experience'),
        value: 9,
        prefix: '+',
        icon: 'fas fa-calendar',
        description: t('stat.years_experience_desc'),
        order: 3
      },
      {
        id: 'stat4',
        title: t('stat.completed_projects'),
        value: 250,
        prefix: '+',
        icon: 'fas fa-building',
        description: t('stat.completed_projects_desc'),
        order: 4
      }
    ];
  }, [companyStats, t]);

  return (
    <section className="mb-20 py-12 bg-gray-50 dark:bg-gray-900 rounded-2xl">
      <ScrollReveal animation="fade-in" delay={0.1}>
        <h2 className="text-3xl font-heading font-semibold mb-8 text-center text-brand-blue dark:text-white">
          {companyStats?.meta?.title || t('companyStats')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-center mb-12">
          {companyStats?.meta?.description || t('statsDescription')}
        </p>
      </ScrollReveal>
      
      {isLoading && (
        <div className="my-12">
          <LoadingState text={t('loadingStats')} />
        </div>
      )}
      
      {error && !isLoading && (
        <div className="py-8 max-w-xl mx-auto">
          <ErrorMessage 
            message={error.message || t('errorLoadingStats')} 
            retryText={t('retry')}
            onRetry={retry}
          />
        </div>
      )}
      
      {!isLoading && !error && statsData.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8 px-4">
          {statsData
            .sort((a, b) => a.order - b.order)
            .map((stat, index) => (
              <StatCard
                key={stat.id || `stat-${index}`}
                value={stat.value}
                label={stat.title}
                prefix={stat.prefix || ''}
                suffix={stat.suffix || ''}
                decimals={stat.value % 1 === 0 ? 0 : 1}
                icon={getIconComponent(stat.icon)}
                delay={0.1 + (index * 0.1)}
                isRtl={isRtl}
                description={stat.description}
              />
            ))}
        </div>
      )}
      
      {!isLoading && !error && statsData.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {t('noStatsFound')}
        </div>
      )}
    </section>
  );
};

export default StatsSection; 