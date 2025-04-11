import React, { useState, useCallback, useEffect } from 'react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useProjects } from '@/hooks/useProjects';
import ProjectCard from '@/components/portfolio/ProjectCard';
import ProjectFilters from '@/components/portfolio/ProjectFilters';
import LoadingState from '@/components/common/LoadingState';

interface FilterOptions {
  category?: string;
  tag?: string;
  search?: string;
}

const PortfolioPage: NextPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isRtl = router.locale === 'ar';
  
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check auth state on mount
  useEffect(() => {
    // In a real application, this would check JWT token or session
    // For now, we'll use localStorage as a simple simulation
    const checkAuth = () => {
      const authToken = localStorage.getItem('authToken');
      setIsAuthenticated(!!authToken);
    };
    
    checkAuth();
    // Listen for storage events (for multi-tab authentication)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);
  
  const { projects, loading, error } = useProjects(filters);
  
  // Save to favorites function
  const handleSaveToFavorites = (projectId: string) => {
    if (!isAuthenticated) {
      // Handled by the ProjectCard component
      return;
    }
    
    // In actual implementation, this would make an API call to save to user's favorites
    console.log('Saved project to favorites:', projectId);
  };
  
  return (
    <>
      <Head>
        <title>{t('portfolio.title')} | Archway Interior Design</title>
        <meta name="description" content="Browse our portfolio of interior design projects, from residential spaces to commercial environments." />
      </Head>
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className={`text-center mb-16 ${isRtl ? 'rtl' : ''}`}>
          <h1 className="text-4xl font-heading font-bold mb-4">{t('portfolio.title')}</h1>
          <p className="text-xl text-gray-600">{t('portfolio.subtitle')}</p>
          <div className="w-24 h-1 bg-brand-accent mx-auto mt-8"></div>
        </div>
        
        {/* Filters */}
        <ProjectFilters 
          onFilterChange={handleFilterChange} 
          initialFilters={filters}
        />
        
        {/* Projects Grid */}
        {loading ? (
          <LoadingState type="card" count={6} />
        ) : error ? (
          <div className={`bg-red-50 border border-red-200 p-4 rounded-md ${isRtl ? 'text-right' : ''}`}>
            <p className="text-red-800">{error}</p>
          </div>
        ) : projects.length === 0 ? (
          <div className={`text-center py-12 ${isRtl ? 'text-right' : ''}`}>
            <p className="text-gray-600">
              {filters.search
                ? t('portfolio.noSearchResults', { search: filters.search })
                : t('portfolio.noProjects')}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onSaveToFavorites={handleSaveToFavorites}
                isAuthenticated={isAuthenticated} // Now uses the actual auth state
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default PortfolioPage; 