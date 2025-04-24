'use client';

import { useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useProjectCategories, useProjectTags } from '@/lib/hooks/portfolio';
import ProjectFilters from '@/components/portfolio/list/ProjectFilters';

interface FilterWrapperProps {
  initialCategory?: string;
  initialTag?: string;
  initialSearch?: string;
  locale: string;
  children: ReactNode;
}

interface FilterOptions {
  category?: string;
  tag?: string;
  search?: string;
}

/**
 * Client component that wraps the portfolio page content and handles filter changes
 */
export default function FilterWrapper({
  initialCategory,
  initialTag,
  initialSearch,
  locale,
  children
}: FilterWrapperProps) {
  const router = useRouter();
  const initialFilters = {
    category: initialCategory,
    tag: initialTag,
    search: initialSearch
  };

  // Fetch categories and tags
  const { 
    categories, 
    loading: categoriesLoading, 
    error: categoriesError 
  } = useProjectCategories(); 
  
  const { 
    tags, 
    loading: tagsLoading, 
    error: tagsError 
  } = useProjectTags({ lang: locale });

  // Handle filter changes by updating the URL
  const handleFilterChange = useCallback((newFilters: FilterOptions) => {
    const params = new URLSearchParams();
    
    if (newFilters.category) {
      params.append('category', newFilters.category);
    }
    
    if (newFilters.tag) {
      params.append('tag', newFilters.tag);
    }
    
    if (newFilters.search) {
      params.append('search', newFilters.search);
    }
    
    const queryString = params.toString();
    const newPath = `/${locale}/portfolio${queryString ? `?${queryString}` : ''}`;
    
    router.push(newPath, { scroll: false });
  }, [router, locale]);

  return (
    <>
      <ProjectFilters 
        onFilterChange={handleFilterChange} 
        initialFilters={initialFilters}
        categories={categories} 
        tags={tags}         
        isLoading={categoriesLoading || tagsLoading}
        error={categoriesError || tagsError}       
      />
      
      {children}
    </>
  );
} 