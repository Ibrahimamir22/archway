import React from 'react';
import { SectionHeader } from '../common';
import { useTeamMembers } from '@/lib/hooks/marketing/about';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { LoadingState } from '@/components/ui';
import TeamGrid from './TeamSection/TeamGrid';

interface TeamSectionProps {
  className?: string;
  displayCount?: number;
  showLeadershipOnly?: boolean;
  columns?: 1 | 2 | 3;
}

const TeamSection: React.FC<TeamSectionProps> = ({
  className = '',
  displayCount,
  showLeadershipOnly = false,
  columns = 3
}) => {
  const { 
    data: teamMembers, 
    isLoading, 
    error,
    refetch
  } = useTeamMembers({
    featuredOnly: showLeadershipOnly,
    limit: displayCount
  });
  
  const displayedTeamMembers = teamMembers || [];

  if (error) {
    return (
      <div className={`py-16 ${className}`}>
        <ErrorMessage 
          message={error || "Failed to load team members. Please try again later."}
          retryText="Retry"
          onRetry={refetch}
        />
      </div>
    );
  }

  return (
    <section className={`py-16 ${className}`}>
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Our Team"
          subtitle="Meet the people behind Archway"
          description="Our diverse team brings together expertise in architecture, sustainability, urban planning, and design to deliver exceptional results for our clients."
        />
        
        {isLoading && (
          <LoadingState type="team" text="Loading team members..." />
        )}
        
        {!isLoading && displayedTeamMembers.length > 0 && (
          <TeamGrid 
            teamMembers={displayedTeamMembers}
            isLoading={false}
            columns={columns}
          />
        )}
        
        {!isLoading && displayedTeamMembers.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No team members found.
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamSection; 