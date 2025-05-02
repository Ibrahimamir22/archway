import React, { useState, useEffect } from 'react';
import TeamGrid from './TeamGrid';
import TeamCarousel from './TeamCarousel';
import { TeamMember } from '@/types/marketing';
import { LoadingState, ErrorMessage, ScrollReveal } from '@/components/ui';

interface TeamSectionProps {
  t: (key: string) => string;
  isRtl: boolean;
  locale: string;
  teamMembers?: TeamMember[];
  sectionTitle?: string;
  useCarouselOnMobile?: boolean;
}

const TeamSection: React.FC<TeamSectionProps> = ({ 
  t, 
  isRtl, 
  locale, 
  teamMembers, 
  sectionTitle,
  useCarouselOnMobile = true
}) => {
  const isLoading = !teamMembers;
  
  // Track if we're on mobile screen
  const [isMobile, setIsMobile] = useState(false);
  
  // Check screen size on mount and window resize
  useEffect(() => {
    // Only run on client-side
    if (typeof window !== 'undefined') {
      const checkScreenSize = () => {
        setIsMobile(window.innerWidth < 768);
      };
      
      // Initial check
      checkScreenSize();
      
      // Listen for resize events
      window.addEventListener('resize', checkScreenSize);
      
      // Clean up
      return () => window.removeEventListener('resize', checkScreenSize);
    }
  }, []);
  
  return (
    <section className="py-16 bg-gradient-to-b from-transparent to-gray-50 dark:from-transparent dark:to-gray-900/50 mb-20 rounded-3xl relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 -left-20 w-64 h-64 bg-brand-blue/5 dark:bg-brand-blue/10 rounded-full blur-3xl" aria-hidden="true"></div>
      <div className="absolute bottom-20 -right-20 w-80 h-80 bg-brand-accent/5 dark:bg-brand-accent/10 rounded-full blur-3xl" aria-hidden="true"></div>
      
      <div className="container mx-auto px-4">
        <ScrollReveal animation="fade-in" delay={0.2}>
          <div className="text-center mb-12">
            <h2 className="text-4xl font-heading font-bold mb-4 text-brand-blue dark:text-white bg-clip-text 
                         text-transparent bg-gradient-to-r from-brand-blue to-brand-blue-light 
                         dark:from-brand-light dark:to-white">
              {sectionTitle || t('team')}
            </h2>
            <div className="w-24 h-1 bg-brand-accent mx-auto rounded-full mb-6"></div>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t('teamDescription')}
            </p>
          </div>
        </ScrollReveal>
        
        {isLoading && (
          <LoadingState type="team" text={t('loadingTeam')} />
        )}
        
        {!isLoading && teamMembers && teamMembers.length > 0 && (
          <ScrollReveal animation="slide-up" offset="-50px" delay={0.3}>
            {isMobile && useCarouselOnMobile ? (
              // Show carousel on mobile
              <TeamCarousel 
                teamMembers={teamMembers}
                isLoading={isLoading}
                locale={locale}
                className="mb-8 px-2"
              />
            ) : (
              // Show grid on desktop
              <TeamGrid 
                teamMembers={teamMembers} 
                isLoading={false}
                columns={3}
                className="gap-8 md:gap-10"
              />
            )}
          </ScrollReveal>
        )}
        
        {!isLoading && (!teamMembers || teamMembers.length === 0) && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-white/50 dark:bg-gray-800/30 rounded-xl p-8 backdrop-blur-sm">
            {t('noTeamMembersFound')}
          </div>
        )}
      </div>
    </section>
  );
};

export default TeamSection; 