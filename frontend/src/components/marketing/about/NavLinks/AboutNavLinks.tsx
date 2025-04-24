import React, { useRef } from 'react';
import { PrefetchLink } from '@/components/common/PrefetchLink';
import { usePrefetch } from '@/lib/hooks/ui';
import { 
  createTeamMembersPrefetcher,
  createTestimonialsPrefetcher,
  createCompanyHistoryPrefetcher,
  createCompanyStatsPrefetcher,
  createClientLogosPrefetcher 
} from '@/lib/utils/prefetch';

interface AboutNavLinksProps {
  /**
   * Translation function
   */
  t: (key: string) => string;
  
  /**
   * Current locale
   */
  locale: string;
  
  /**
   * Whether the UI is in right-to-left mode
   */
  isRtl?: boolean;
  
  /**
   * Active section id (for highlighting)
   */
  activeSection?: string;
  
  /**
   * Whether to style as pills (vs. underline)
   */
  pillStyle?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
}

const AboutNavLinks: React.FC<AboutNavLinksProps> = ({
  t,
  locale,
  isRtl = false,
  activeSection = '',
  pillStyle = false,
  className = ''
}) => {
  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({
    mission: null,
    values: null,
    stats: null,
    clients: null,
    history: null,
    team: null,
    testimonials: null
  });
  
  // Create prefetch functions
  const teamPrefetcher = createTeamMembersPrefetcher(locale);
  const testimonialsPrefetcher = createTestimonialsPrefetcher(locale);
  const historyPrefetcher = createCompanyHistoryPrefetcher(locale);
  const statsPrefetcher = createCompanyStatsPrefetcher(locale);
  const clientsPrefetcher = createClientLogosPrefetcher(locale);
  
  // Use the prefetch hook for each section
  const { prefetchProps: teamPrefetchProps } = usePrefetch(teamPrefetcher, { delay: 100 });
  const { prefetchProps: testimonialsPrefetchProps } = usePrefetch(testimonialsPrefetcher, { delay: 100 });
  const { prefetchProps: historyPrefetchProps } = usePrefetch(historyPrefetcher, { delay: 100 });
  const { prefetchProps: statsPrefetchProps } = usePrefetch(statsPrefetcher, { delay: 100 });
  const { prefetchProps: clientsPrefetchProps } = usePrefetch(clientsPrefetcher, { delay: 100 });
  
  // Function to smooth scroll to a section
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Base classes for links
  const linkBaseClasses = 
    pillStyle 
      ? 'px-4 py-2 rounded-full text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-brand-blue/40'
      : 'px-3 py-2 border-b-2 transition-colors focus:outline-none';
  
  // Active link classes
  const activeLinkClasses = 
    pillStyle
      ? 'bg-brand-blue text-white dark:bg-brand-accent/90 dark:text-gray-900'
      : 'border-brand-blue text-brand-blue dark:border-brand-accent dark:text-brand-accent';
  
  // Inactive link classes
  const inactiveLinkClasses = 
    pillStyle
      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
      : 'border-transparent text-gray-600 hover:text-brand-blue hover:border-brand-blue/50 dark:text-gray-300 dark:hover:text-brand-accent dark:hover:border-brand-accent/50';
  
  // Define the navigation links with their prefetch props
  const navLinks = [
    { id: 'mission', label: t('mission'), prefetchProps: {} },
    { id: 'values', label: t('values'), prefetchProps: {} },
    { id: 'stats', label: t('stats'), prefetchProps: statsPrefetchProps },
    { id: 'clients', label: t('clients'), prefetchProps: clientsPrefetchProps },
    { id: 'history', label: t('history'), prefetchProps: historyPrefetchProps },
    { id: 'team', label: t('team'), prefetchProps: teamPrefetchProps },
    { id: 'testimonials', label: t('testimonials'), prefetchProps: testimonialsPrefetchProps },
  ];

  return (
    <nav className={`flex flex-wrap gap-2 justify-center ${className}`}>
      {navLinks.map(link => (
        <button
          key={link.id}
          onClick={() => scrollToSection(link.id)}
          className={`${linkBaseClasses} ${activeSection === link.id ? activeLinkClasses : inactiveLinkClasses}`}
          {...link.prefetchProps}
        >
          {link.label}
        </button>
      ))}
    </nav>
  );
};

export default AboutNavLinks; 