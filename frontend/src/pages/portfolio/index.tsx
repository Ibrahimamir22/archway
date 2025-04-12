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

const PortfolioPage: NextPage<PortfolioPageProps> = ({ initialCategories, initialTags, initialProjects }) => {
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

  // Function to prefetch project details
  const prefetchProjectDetails = useCallback(
    (slug: string) => {
      // Don't prefetch if already loading another page
      if (loading || isFetchingNextPage) return;
      
      // Skip if this project was already preloaded
      if (preloadedProjects.has(slug)) {
        console.log(`Project ${slug} already preloaded, skipping`);
        return;
      }
      
      console.log(`Starting prefetch for project: ${slug}`);
      const locale = router.locale || 'en';
      
      // Create preload container early and keep reference
      const preloadDiv = document.createElement('div');
      preloadDiv.style.position = 'absolute';
      preloadDiv.style.width = '0';
      preloadDiv.style.height = '0';
      preloadDiv.style.overflow = 'hidden';
      preloadDiv.style.opacity = '0';
      document.body.appendChild(preloadDiv);
      
      queryClient.prefetchQuery(
        ['projectDetail', slug, locale],
        async () => {
          const params = new URLSearchParams();
          params.append('lang', locale);
          const API_BASE_URL = getApiBaseUrl();
          
          try {
            const response = await axios.get(
              `${API_BASE_URL}/projects/${slug}/?${params.toString()}`
            );
            
            // Process image URLs before caching
            const data = response.data;
            if (data.images && Array.isArray(data.images)) {
              // Mark as preloaded right away
              preloadedProjects.add(slug);
              
              // Process and preload images
              data.images.forEach((img: any) => {
                // Get normalized image URL
                let imgSrc = img.image_url || img.image;
                if (!imgSrc) return;
                
                // Normalize URLs
                if (imgSrc.includes('backend:8000')) {
                  imgSrc = imgSrc.replace(/backend:8000/g, 'localhost:8000');
                } else if (imgSrc.startsWith('/media/')) {
                  imgSrc = `http://localhost:8000${imgSrc}`;
                } else if (imgSrc.startsWith('media/')) {
                  imgSrc = `http://localhost:8000/${imgSrc}`;
                }
                
                // Create and add preload image
                const imgElement = document.createElement('img');
                imgElement.src = imgSrc;
                imgElement.alt = 'preload';
                imgElement.dataset.projectSlug = slug;
                preloadDiv.appendChild(imgElement);
                
                console.log(`Preloading ${slug} image: ${imgSrc}`);
              });
              
              // Add normalized data to cache
              return data;
            }
            
            return data;
          } catch (error) {
            console.error('Error prefetching project:', error);
            return null;
          }
        },
        {
          staleTime: 300000, // 5 minutes
          cacheTime: 600000, // 10 minutes
        }
      );
      
      // We intentionally don't remove the preload div to ensure images stay in browser cache
    },
    [queryClient, router.locale, loading, isFetchingNextPage]
  );

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
        
        {/* Projects Grid */}
        {loading && projects.length === 0 ? (
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
        ) : projects.length === 0 ? (
          <div className={`text-center py-12 ${isRtl ? 'text-right' : ''}`}>
            <p className="text-gray-600">
              {filters.search
                ? t('portfolio.noSearchResults', { search: filters.search })
                : t('portfolio.noProjects')}
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project: Project) => (
                <div 
                  key={project.id}
                  onMouseEnter={() => {
                    prefetchProjectDetails(project.slug);
                    // Also attempt to preload the cover image directly
                    if (project.cover_image_url || project.cover_image) {
                      const img = new Image();
                      img.src = project.cover_image_url || project.cover_image || '';
                      console.log('Preloading cover image:', img.src);
                    }
                  }}
                >
                  <ProjectCard
                    key={project.id}
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
            
            {/* Loading indicator for pagination */}
            {isFetchingNextPage && !hasNextPage && (
              <div className="mt-8">
                <LoadingState type="card" count={3} />
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
    console.log('Categories response:', categoriesResponse.status);
    const categories = categoriesResponse.data.results || categoriesResponse.data || [];
    
    // Fetch tags data
    const tagsParams = new URLSearchParams();
    tagsParams.append('lang', locale);
    const tagsResponse = await axios.get(`${API_BASE_URL}/tags/?${tagsParams.toString()}`);
    console.log('Tags response:', tagsResponse.status);
    const tags = tagsResponse.data.results || tagsResponse.data || [];
    
    // Fetch initial projects
    const projectsParams = new URLSearchParams();
    projectsParams.append('lang', locale);
    projectsParams.append('limit', '6'); // Limit to first 6 projects for initial load
    const projectsResponse = await axios.get(`${API_BASE_URL}/projects/?${projectsParams.toString()}`);
    console.log('Projects response:', projectsResponse.status);
    const projects = projectsResponse.data.results || [];
    
    // Process image URLs on the server-side for consistent hydration
    const processedProjects = projects.map((project: any) => {
      // Process cover image URLs to ensure consistency
      if (project.cover_image_url && project.cover_image_url.includes('backend:8000')) {
        project.cover_image_url = project.cover_image_url.replace(/backend:8000/g, 'localhost:8000');
      }
      
      if (project.cover_image && project.cover_image.includes('backend:8000')) {
        project.cover_image = project.cover_image.replace(/backend:8000/g, 'localhost:8000');
      }
      
      // Process all images in the project if they exist
      if (project.images && Array.isArray(project.images)) {
        project.images = project.images.map((img: any) => {
          if (img.image_url && img.image_url.includes('backend:8000')) {
            img.image_url = img.image_url.replace(/backend:8000/g, 'localhost:8000');
          }
          if (img.image && img.image.includes('backend:8000')) {
            img.image = img.image.replace(/backend:8000/g, 'localhost:8000');
          }
          return img;
        });
      }
      
      return project;
    });
    
    console.log(`Successfully fetched: ${processedProjects.length} projects, ${categories.length} categories, ${tags.length} tags`);

    return {
      props: {
        initialCategories: categories,
        initialTags: tags,
        initialProjects: processedProjects,
        ...(await serverSideTranslations(locale, ['common'])),
      },
      revalidate: 60 // Revalidate at most once per minute
    };
  } catch (error: any) {
    console.error('Error fetching filter data:', error.message || 'Unknown error');
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
    }
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