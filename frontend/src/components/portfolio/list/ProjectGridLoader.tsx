'use client';

import { useEffect, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { api, getApiBaseUrl } from '@/lib/api';
import { Project, ProjectsResponse } from '@/lib/hooks/portfolio/types';
import ProjectGridClient from './ProjectGrid.client';
import { fixImageUrl } from '@/lib/images';

interface ProjectGridLoaderProps {
  initialProjects: Project[];
  hasNextPage: boolean;
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  lang?: string;
  isAuthenticated?: boolean;
  onSaveToFavorites?: (projectId: string) => void;
}

/**
 * Client component that handles pagination and loading more projects
 * Works with the server-rendered initial page of projects
 */
export default function ProjectGridLoader({
  initialProjects,
  hasNextPage: initialHasNextPage,
  category,
  tag,
  search,
  featured = false,
  limit = 12,
  lang = 'en',
  isAuthenticated = false,
  onSaveToFavorites
}: ProjectGridLoaderProps) {
  const [allProjects, setAllProjects] = useState<Project[]>(initialProjects);
  const API_BASE_URL = getApiBaseUrl();

  // Function to fetch more projects from API for pagination
  const fetchProjects = async ({ pageParam = 2 }) => {
    // Build query parameters
    const params = new URLSearchParams();
    
    if (category) {
      params.append('category__slug', category);
    }
    
    if (tag) {
      params.append('tags__slug', tag);
    }
    
    if (search) {
      params.append('search', search);
    }
    
    if (featured) {
      params.append('is_featured', 'true');
    }
    
    params.append('is_published', 'true');
    
    if (limit) {
      params.append('limit', limit.toString());
    }
    
    params.append('lang', lang);
    params.append('page', pageParam.toString());
    
    try {
      const response = await api.get<ProjectsResponse>(
        `${API_BASE_URL}/projects/?${params.toString()}`
      );
      
      const results = response.data.results.map(project => ({
        ...project,
        cover_image: project.cover_image ? fixImageUrl(project.cover_image) : undefined,
        cover_image_url: project.cover_image_url ? fixImageUrl(project.cover_image_url) : undefined,
        images: project.images ? project.images.map(img => ({
          ...img,
          image: img.image ? fixImageUrl(img.image) : undefined,
          image_url: img.image_url ? fixImageUrl(img.image_url) : undefined,
        })) : []
      }));
      
      return {
        ...response.data,
        results
      };
    } catch (error) {
      console.error('Error fetching projects:', error);
      throw error;
    }
  };

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    refetch
  } = useInfiniteQuery({
    queryKey: ['projects', { category, tag, search, featured, limit, lang }],
    queryFn: fetchProjects,
    initialPageParam: 2, // Start from page 2 since page 1 is server-rendered
    getNextPageParam: (lastPage: ProjectsResponse) => {
      if (lastPage.next) {
        const url = new URL(lastPage.next);
        return url.searchParams.get('page');
      }
      return undefined;
    },
    retry: 2,
    refetchOnWindowFocus: false,
    staleTime: 60000,
    enabled: initialHasNextPage, // Only run the query if there are more pages
  });

  // Update allProjects when new data is fetched
  useEffect(() => {
    if (data?.pages) {
      const newProjects = data.pages.flatMap((page: ProjectsResponse) => page?.results || []);
      setAllProjects([...initialProjects, ...newProjects]);
    }
  }, [data, initialProjects]);

  return (
    <ProjectGridClient
      projects={allProjects}
      loading={status === 'loading' && allProjects.length === 0}
      error={status === 'error' ? error : null}
      fetchNextPage={fetchNextPage}
      hasNextPage={hasNextPage}
      isFetchingNextPage={isFetchingNextPage}
      isAuthenticated={isAuthenticated}
      onSaveToFavorites={onSaveToFavorites}
      onRetry={refetch}
    />
  );
} 