import { getProjects } from '@/lib/api/portfolio';
import ProjectGridLoader from './ProjectGridLoader';
import ProjectGridClient from './ProjectGrid.client';
import { Project } from '@/lib/hooks/portfolio/types';

interface ProjectGridProps {
  initialProjects?: Project[];
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
  limit?: number;
  lang?: string; 
  isAuthenticated?: boolean;
  hasNextPage?: boolean;
}

/**
 * Server component for project grid that handles data fetching
 * and passes data to client components for interactivity
 */
export default async function ProjectGrid({
  initialProjects,
  category,
  tag,
  search,
  featured = false,
  limit = 12,
  lang = 'en',
  isAuthenticated = false,
  hasNextPage: initialHasNextPage
}: ProjectGridProps) {
  // If initial projects are provided, use them directly
  if (initialProjects) {
    // Use the loader for pagination if hasNextPage is provided
    if (initialHasNextPage !== undefined) {
      return (
        <ProjectGridLoader
          initialProjects={initialProjects}
          hasNextPage={initialHasNextPage}
          category={category}
          tag={tag}
          search={search}
          featured={featured}
          limit={limit}
          lang={lang}
          isAuthenticated={isAuthenticated}
        />
      );
    }
    
    // Otherwise just render the initial projects without pagination
    return (
      <ProjectGridClient
        projects={initialProjects}
        isAuthenticated={isAuthenticated}
      />
    );
  }

  try {
    // Fetch projects server-side
    const result = await getProjects(
      {
        category,
        tag,
        search,
        featured,
        limit,
        lang
      },
      1
    );

    // Use the loader for pagination
    return (
      <ProjectGridLoader
        initialProjects={result.projects}
        hasNextPage={result.hasNextPage}
        category={category}
        tag={tag}
        search={search}
        featured={featured}
        limit={limit}
        lang={lang}
        isAuthenticated={isAuthenticated}
      />
    );
  } catch (error) {
    // Handle error gracefully
    console.error('Error fetching projects in server component:', error);
    
    // Return client component with error state
    return (
      <ProjectGridClient
        projects={[]}
        error="Failed to load projects. Please try again later."
        isAuthenticated={isAuthenticated}
      />
    );
  }
} 