'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Project } from '@/lib/hooks/portfolio/types';
import ProjectCard from '@/components/portfolio/card/ProjectCard';
import LoadingState from '@/components/common/LoadingState/index';
import PlaceholderProjects from './PlaceholderProjects';

interface ProjectGridClientProps {
  projects: Project[];
  loading?: boolean;
  error?: any;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage?: boolean;
  isAuthenticated?: boolean;
  onSaveToFavorites?: (projectId: string) => void;
  onRetry?: () => void;
}

/**
 * Client component for project grid with interactive elements
 */
const ProjectGridClient: React.FC<ProjectGridClientProps> = ({
  projects = [],
  loading = false,
  error = null,
  fetchNextPage = () => {},
  hasNextPage = false,
  isFetchingNextPage = false,
  isAuthenticated = false,
  onSaveToFavorites = () => {},
  onRetry = () => {}
}) => {
  const t = useTranslations('portfolio');
  const params = useParams();
  const locale = params?.locale ? String(params.locale) : 'en';
  const isRtl = locale === 'ar';

  if (loading) {
    return <LoadingState type="card" count={6} />;
  }

  if (error) {
    return (
      <div className={`bg-red-50 border border-red-200 p-6 rounded-md text-center ${isRtl ? 'text-right' : ''}`}>
        <p className="text-red-800 mb-4">{error}</p>
        <button 
          onClick={onRetry}
          className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark transition-colors"
        >
          {t('tryAgain')}
        </button>
      </div>
    );
  }

  // Show placeholders only when we have no projects at all
  if (projects.length === 0) {
    return <PlaceholderProjects count={3} />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project: Project) => (
          <div key={project.id}>
            <ProjectCard
              project={project}
              onSaveToFavorites={onSaveToFavorites}
              isAuthenticated={isAuthenticated}
            />
          </div>
        ))}
      </div>
      
      {/* Load More Button */}
      {hasNextPage && (
        <div className="mt-12 text-center">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-6 py-3 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark transition-colors disabled:bg-gray-400 flex items-center justify-center mx-auto"
          >
            {isFetchingNextPage ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('loading')}
              </>
            ) : (
              t('loadMore')
            )}
          </button>
        </div>
      )}
    </>
  );
};

export default ProjectGridClient; 