'use client';

import React from 'react';
import StatCard from './StatCard';
import { CompanyStatistic } from '@/types/marketing';
import { LoadingState, ErrorMessage, ScrollReveal } from '@/components/ui';

interface StatsSectionProps {
  t: (key: string) => string;
  isRtl: boolean;
  locale: string;
  stats?: CompanyStatistic[];
}

const StatsSection: React.FC<StatsSectionProps> = ({ t, isRtl, locale, stats = [] }) => {
  // Function to get the right icon based on the stat title
  const getIconComponent = (stat: CompanyStatistic) => {
    // Generate icon based on title keywords
    const title = (stat.title || '').toLowerCase();
    
    if (title.includes('client') || title.includes('عميل')) {
      return <span className="text-2xl">😊</span>;
    } else if (title.includes('team') || title.includes('فريق')) {
      return <span className="text-2xl">👥</span>;
    } else if (title.includes('year') || title.includes('سنة')) {
      return <span className="text-2xl">📅</span>;
    } else if (title.includes('project') || title.includes('مشروع')) {
      return <span className="text-2xl">🏢</span>;
    } else {
      return <span className="text-2xl">📊</span>;
    }
  };

  // Prepare stats data from props or use fallback
  const statsData = React.useMemo(() => {
    // If there are stats passed, use them
    if (stats && stats.length > 0) {
      console.log("Using stats from props:", stats);
      return stats.map(stat => ({
        id: String(stat.id),
        title: stat.title,
        value: stat.value,
        suffix: stat.unit || '',
        prefix: '',
        icon: 'fas fa-chart-line', // Default icon
        description: '',
        order: stat.order || 0
      }));
    }
    
    console.log("Using fallback stats data");
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
  }, [stats, t]);

  const isLoading = !statsData;

  return (
    <section className="mb-20 py-12 bg-gray-50 dark:bg-gray-900 rounded-2xl">
      <ScrollReveal animation="fade-in" delay={0.1}>
        <h2 className="text-3xl font-heading font-semibold mb-8 text-center text-brand-blue dark:text-white">
          {t('companyStats')}
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto text-center mb-12">
          {t('statsDescription')}
        </p>
      </ScrollReveal>
      
      {isLoading && (
        <div className="my-12">
          <LoadingState text={t('loadingStats')} />
        </div>
      )}
      
      {!isLoading && statsData.length > 0 && (
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
                decimals={typeof stat.value === 'number' && stat.value % 1 === 0 ? 0 : 1}
                icon={getIconComponent(stat as any)}
                delay={0.1 + (index * 0.1)}
                isRtl={isRtl}
                description={stat.description}
              />
            ))}
        </div>
      )}
      
      {!isLoading && statsData.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {t('noStatsFound')}
        </div>
      )}
    </section>
  );
};

export default StatsSection; 