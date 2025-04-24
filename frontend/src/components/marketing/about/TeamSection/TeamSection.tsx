import React from 'react';
import { TeamGrid } from './TeamGrid';
import { useTeamMembers } from '@/lib/hooks/marketing/about';
import { LoadingState, ErrorMessage, ScrollReveal } from '@/components/ui';

interface TeamSectionProps {
  t: (key: string) => string;
  isRtl: boolean;
  locale: string;
}

export const TeamSection: React.FC<TeamSectionProps> = ({ t, isRtl, locale }) => {
  const { data: teamMembers, isLoading, error, refetch } = useTeamMembers({
    locale,
    featuredOnly: true,
    limit: 6,
    autoFetch: true
  });

  return (
    <section className="mb-20">
      <ScrollReveal animation="fade-in" delay={0.2}>
        <h2 className="text-3xl font-heading font-semibold mb-8 text-center text-brand-blue dark:text-white">
          {t('team')}
        </h2>
      </ScrollReveal>
      
      {isLoading && (
        <LoadingState type="team" text={t('loadingTeam')} />
      )}
      
      {error && (
        <div className="py-8">
          <ErrorMessage 
            message={error || t('errorLoadingTeam')} 
            retryText={t('retry')}
            onRetry={refetch}
          />
        </div>
      )}
      
      {!isLoading && !error && teamMembers && teamMembers.length > 0 && (
        <ScrollReveal animation="slide-up" offset="-50px" delay={0.3}>
          <TeamGrid members={teamMembers} isRtl={isRtl} />
        </ScrollReveal>
      )}
      
      {!isLoading && !error && (!teamMembers || teamMembers.length === 0) && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {t('noTeamMembersFound')}
        </div>
      )}
    </section>
  );
}; 