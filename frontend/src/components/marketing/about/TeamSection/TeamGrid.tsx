import React from 'react';
import { TeamMember } from '@/types/marketing';
import TeamMemberCard from './TeamMemberCard';
import { Skeleton } from '@/components/ui/skeleton';

interface TeamGridProps {
  teamMembers: TeamMember[];
  isLoading: boolean;
  columns?: 1 | 2 | 3;
  className?: string;
}

const TeamGrid: React.FC<TeamGridProps> = ({
  teamMembers,
  isLoading,
  columns = 3,
  className = '',
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  }[columns];

  return (
    <div className={`grid ${gridCols} gap-8 mt-12 ${className} h-full grid-flow-row-dense`}>
      {isLoading ? (
        // Loading skeletons
        Array(columns).fill(0).map((_, index) => (
          <div key={`skeleton-${index}`} className="bg-white rounded-lg shadow-md overflow-hidden h-full">
            <div className="aspect-w-3 aspect-h-2 w-full">
              <Skeleton className="w-full h-[250px]" />
            </div>
            <div className="p-6 space-y-4">
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-20 w-full" />
              <div className="flex space-x-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          </div>
        ))
      ) : (
        <React.Fragment>
          {teamMembers.map((member) => (
            <div key={member.id} className="h-full">
              <TeamMemberCard 
                member={member} 
              />
            </div>
          ))}
        </React.Fragment>
      )}
    </div>
  );
};

export default TeamGrid; 