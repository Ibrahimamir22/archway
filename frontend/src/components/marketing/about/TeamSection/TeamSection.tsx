import React from 'react';
import TeamGrid from './TeamGrid';
import { TeamMember } from '@/types/marketing';
import { LoadingState, ErrorMessage, ScrollReveal } from '@/components/ui';

interface TeamSectionProps {
  t: (key: string) => string;
  isRtl: boolean;
  locale: string;
  teamMembers?: TeamMember[];
  sectionTitle?: string;
}

const TeamSection: React.FC<TeamSectionProps> = ({ 
  t, 
  isRtl, 
  locale, 
  teamMembers, 
  sectionTitle 
}) => {
  const isLoading = !teamMembers;
  
  return (
    <section className="mb-20">
      <ScrollReveal animation="fade-in" delay={0.2}>
        <h2 className="text-3xl font-heading font-semibold mb-8 text-center text-brand-blue dark:text-white">
          {sectionTitle || t('team')}
        </h2>
      </ScrollReveal>
      
      {isLoading && (
        <LoadingState type="team" text={t('loadingTeam')} />
      )}
      
      {!isLoading && teamMembers && teamMembers.length > 0 && (
        <ScrollReveal animation="slide-up" offset="-50px" delay={0.3}>
          <TeamGrid 
            teamMembers={teamMembers} 
            isLoading={false}
            columns={3}
          />
        </ScrollReveal>
      )}
      
      {!isLoading && (!teamMembers || teamMembers.length === 0) && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          {t('noTeamMembersFound')}
        </div>
      )}
    </section>
  );
};

export default TeamSection; 