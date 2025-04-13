import React, { useState, useCallback, useEffect } from 'react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useProjects, Project, Category, Tag } from '@/hooks/useProjects';
import ProjectCard from '@/components/portfolio/ProjectCard';
import ProjectFilters from '@/components/portfolio/ProjectFilters';
import LoadingState from '@/components/common/LoadingState';
import ErrorMessage from '@/components/common/ErrorMessage';
import PlaceholderProjects from '@/components/portfolio/PlaceholderProjects';
import axios from 'axios';
import { useQueryClient } from 'react-query';

// Global preload cache to keep track of which projects have been preloaded
const preloadedProjects = typeof window !== 'undefined' ? new Set<string>() : new Set();

// Smart detection of environment to handle both browser and container contexts
const getApiBaseUrl = () => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  // Get the configured API URL (from environment variables)
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (configuredUrl) {
    // If we're in a browser and the URL contains 'backend', replace with 'localhost'
    if (isBrowser && configuredUrl.includes('backend')) {
      return configuredUrl.replace('backend', 'localhost');
    }
    return configuredUrl;
  }
  
  // Default fallback - use backend for server-side, localhost for client-side
  return isBrowser 
    ? 'http://localhost:8000/api/v1' 
    : 'http://backend:8000/api/v1';
};

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
  
  // Add error boundary state
  const [hasError, setHasError] = useState(false);
  
  const [filters, setFilters] = useState<FilterOptions>({});
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Error recovery logic
  useEffect(() => {
    // If there was an error, attempt to recover by invalidating queries
    if (hasError) {
      queryClient.invalidateQueries(['projects']);
      setHasError(false);
    }
  }, [hasError, queryClient]);
  
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
  
  // Save to favorites function
  const handleSaveToFavorites = (projectId: string) => {
    if (!isAuthenticated) {
      // Handled by the ProjectCard component
      return;
    }
    
    // In actual implementation, this would make an API call to save to user's favorites
    console.log('Saved project to favorites:', projectId);
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
        
        {/* Projects Grid - ULTRA SIMPLIFIED LOGIC */}
        {loading ? (
          <LoadingState type="card" count={6} />
        ) : error ? (
          <div className={`bg-red-50 border border-red-200 p-6 rounded-md text-center ${isRtl ? 'text-right' : ''}`}>
            <p className="text-red-800 mb-4">{error}</p>
            <button 
              onClick={handleRetry}
              className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-dark transition-colors"
            >
              {t('common.retry')}
            </button>
          </div>
        ) : initialProjects.length === 0 && projects.length === 0 ? (
          // Show placeholders only when we have no projects at all - initial or fetched
          <PlaceholderProjects count={3} />
        ) : (
          // Otherwise show the real projects
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project: Project) => (
                <div key={project.id}>
                  <ProjectCard
                    project={project}
                    onSaveToFavorites={handleSaveToFavorites}
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
                      {t('common.loading')}
                    </>
                  ) : (
                    t('portfolio.loadMore')
                  )}
                </button>
              </div>
            )}
          </>
        )}
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
      revalidate: 60 // Revalidate at most once per minute
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
      revalidate: 60
    };
  }
}

export default PortfolioPage; 