import React, { useState, useCallback, useEffect } from 'react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useProjects, Project, Category, Tag } from '@/hooks/useProjects';
import ProjectFilters from '@/components/portfolio/ProjectFilters';
import ProjectGrid from '@/components/portfolio/ProjectGrid';
import { useQueryClient } from 'react-query';
import { useAuth } from '@/hooks/useAuth';
import { getApiBaseUrl } from '@/utils/urls';
import axios from 'axios';

interface FilterOptions {
  category?: string;
  tag?: string;
  search?: string;
}

interface PortfolioPageProps {
  initialCategories: Category[];
  initialTags: Tag[];
  initialProjects: Project[];
}

const PortfolioPage: NextPage<PortfolioPageProps> = ({ 
  initialCategories, 
  initialTags, 
  initialProjects
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isRtl = router.locale === 'ar';
  const queryClient = useQueryClient();
  const { isAuthenticated, saveToFavorites } = useAuth();
  
  // Add error boundary state
  const [hasError, setHasError] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  
  // Error recovery logic
  useEffect(() => {
    // If there was an error, attempt to recover by invalidating queries
    if (hasError) {
      queryClient.invalidateQueries(['projects']);
      setHasError(false);
    }
  }, [hasError, queryClient]);
  
  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    setFilters(newFilters);
  }, []);
  
  // Wrap fetching in error handling
  const { 
    projects, 
    loading, 
    error, 
    fetchNextPage, 
    hasNextPage, 
    isFetchingNextPage,
    refetch 
  } = useProjects(filters, initialProjects);
  
  // Error handling for React Query failures
  useEffect(() => {
    if (error) {
      setHasError(true);
    }
  }, [error]);
  
  // Handle save to favorites
  const handleSaveToFavorites = (projectId: string) => {
    saveToFavorites(projectId);
  };

  // Handle retry when API connection fails
  const handleRetry = () => {
    refetch();
  };
  
  // Retry on mount if needed
  useEffect(() => {
    // If there are no projects but we have initialProjects, we should refetch
    if ((!projects || projects.length === 0) && initialProjects && initialProjects.length > 0) {
      refetch();
    }
  }, [projects, initialProjects, refetch]);
  
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
          initialCategories={initialCategories}
          initialTags={initialTags}
        />
        
        {/* Projects Grid - Using extracted component */}
        <ProjectGrid
          projects={projects}
          initialProjects={initialProjects}
          loading={loading}
          error={error}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          isAuthenticated={isAuthenticated}
          onSaveToFavorites={handleSaveToFavorites}
          onRetry={handleRetry}
        />
      </div>
    </>
  );
};

export async function getStaticProps({ locale = 'en' }) {
  const API_BASE_URL = getApiBaseUrl();
  
  try {
    // Fetch categories data
    const categoriesParams = new URLSearchParams();
    categoriesParams.append('lang', locale);
    const categoriesResponse = await axios.get(`${API_BASE_URL}/categories/?${categoriesParams.toString()}`);
    const categories = categoriesResponse.data.results || categoriesResponse.data || [];
    
    // Fetch tags data
    const tagsParams = new URLSearchParams();
    tagsParams.append('lang', locale);
    const tagsResponse = await axios.get(`${API_BASE_URL}/tags/?${tagsParams.toString()}`);
    const tags = tagsResponse.data.results || tagsResponse.data || [];
    
    // Fetch initial projects - only published ones
    const projectsParams = new URLSearchParams();
    projectsParams.append('lang', locale);
    projectsParams.append('limit', '6'); // Limit to first 6 projects for initial load
    projectsParams.append('is_published', 'true'); // Only fetch published projects
    
    let projects = [];
    
    try {
      const projectsResponse = await axios.get(`${API_BASE_URL}/projects/?${projectsParams.toString()}`);
      projects = projectsResponse.data.results || [];
    } catch (error) {
      console.error('Error fetching projects:', error);
      // Continue with empty projects array
    }

    return {
      props: {
        initialCategories: categories,
        initialTags: tags,
        initialProjects: projects,
        ...(await serverSideTranslations(locale, ['common'])),
      },
      // Increased revalidation time for better performance
      revalidate: 300 // Revalidate at most once per 5 minutes
    };
  } catch (error: any) {
    console.error('Error fetching filter data:', error.message || 'Unknown error');
    
    // Return empty arrays if there's an error
    return {
      props: {
        initialCategories: [],
        initialTags: [],
        initialProjects: [],
        ...(await serverSideTranslations(locale, ['common'])),
      },
      revalidate: 300
    };
  }
}

export default PortfolioPage; 