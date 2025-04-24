'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl'; 
import { useParams } from 'next/navigation';
import { Category, Tag } from '@/lib/hooks/portfolio/types';
import LoadingState from '@/components/common/LoadingState/index';

interface ProjectFiltersProps {
  onFilterChange: (filters: { category?: string; tag?: string; search?: string }) => void;
  initialFilters?: {
    category?: string;
    tag?: string;
    search?: string;
  };
  categories: Category[];
  tags: Tag[];
  isLoading?: boolean;
  error?: any;
}

const ProjectFilters: React.FC<ProjectFiltersProps> = ({
  onFilterChange,
  initialFilters = {},
  categories = [],
  tags = [],
  isLoading = false,
  error
}) => {
  const t = useTranslations('portfolio');
  const params = useParams();
  const locale = params?.locale ? String(params.locale) : 'en';
  const isRtl = locale === 'ar';
  
  // Ensure tags and categories are arrays
  const safeCategories = Array.isArray(categories) ? categories : [];
  const safeTags = Array.isArray(tags) ? tags : [];
  
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(initialFilters.category);
  const [selectedTag, setSelectedTag] = useState<string | undefined>(initialFilters.tag);
  const [searchQuery, setSearchQuery] = useState<string>(initialFilters.search || '');
  
  // Apply filters when they change
  useEffect(() => {
    onFilterChange({
      category: selectedCategory,
      tag: selectedTag,
      search: searchQuery.trim() || undefined
    });
  }, [selectedCategory, selectedTag, searchQuery, onFilterChange]);
  
  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug === 'all' ? undefined : categorySlug);
  };
  
  const handleTagChange = (tagSlug: string) => {
    setSelectedTag(tagSlug === 'all' ? undefined : tagSlug);
  };
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      category: selectedCategory,
      tag: selectedTag,
      search: searchQuery.trim() || undefined
    });
  };
  
  const handleClearFilters = () => {
    setSelectedCategory(undefined);
    setSelectedTag(undefined);
    setSearchQuery('');
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 p-4 rounded-md mb-8">
        <p>{error.toString()}</p>
        <button 
          className="text-red-600 underline mt-2" 
          onClick={() => window.location.reload()}
        >
          {t('tryAgain')}
        </button>
      </div>
    );
  }
  
  return (
    <div className="mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Search Bar */}
        <div className="md:col-span-3">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder={t('searchProjects')}
              className={`w-full ps-4 pe-10 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-brand-blue focus:border-brand-blue transition-colors ${
                isRtl ? 'text-right' : ''
              }`}
              dir={isRtl ? 'rtl' : 'ltr'}
            />
            <button
              type="submit"
              className={`absolute ${isRtl ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-gray-500 hover:text-brand-blue`}
              aria-label="Search"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </form>
        </div>
        
        {/* Category Filter */}
        <div className={isRtl ? 'text-right' : ''}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('filterByCategory')}
          </label>
          {isLoading ? (
            <LoadingState type="text" />
          ) : (
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  id="category-all"
                  type="radio"
                  name="category"
                  value="all"
                  checked={!selectedCategory}
                  onChange={() => handleCategoryChange('all')}
                  className="w-4 h-4 text-brand-blue focus:ring-brand-blue"
                />
                <label
                  htmlFor="category-all"
                  className={`${isRtl ? 'mr-2' : 'ml-2'} text-gray-700`}
                >
                  {t('allCategories')}
                </label>
              </div>
              
              {safeCategories.map((category: Category) => (
                <div key={category.id} className="flex items-center">
                  <input
                    id={`category-${category.slug}`}
                    type="radio"
                    name="category"
                    value={category.slug}
                    checked={selectedCategory === category.slug}
                    onChange={() => handleCategoryChange(category.slug)}
                    className="w-4 h-4 text-brand-blue focus:ring-brand-blue"
                  />
                  <label
                    htmlFor={`category-${category.slug}`}
                    className={`${isRtl ? 'mr-2' : 'ml-2'} text-gray-700`}
                  >
                    {category.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Tag Filter */}
        <div className={isRtl ? 'text-right' : ''}>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {t('filterByTag')}
          </label>
          {isLoading ? (
            <LoadingState type="text" />
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <div className="col-span-2 flex items-center">
                <input
                  id="tag-all"
                  type="radio"
                  name="tag"
                  value="all"
                  checked={!selectedTag}
                  onChange={() => handleTagChange('all')}
                  className="w-4 h-4 text-brand-blue focus:ring-brand-blue"
                />
                <label
                  htmlFor="tag-all"
                  className={`${isRtl ? 'mr-2' : 'ml-2'} text-gray-700`}
                >
                  {t('allTags')}
                </label>
              </div>
              
              {safeTags.map((tag: Tag) => (
                <div key={tag.id} className="flex items-center">
                  <input
                    id={`tag-${tag.slug}`}
                    type="radio"
                    name="tag"
                    value={tag.slug}
                    checked={selectedTag === tag.slug}
                    onChange={() => handleTagChange(tag.slug)}
                    className="w-4 h-4 text-brand-blue focus:ring-brand-blue"
                  />
                  <label
                    htmlFor={`tag-${tag.slug}`}
                    className={`${isRtl ? 'mr-2' : 'ml-2'} text-gray-700 truncate`}
                  >
                    {tag.name}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Clear Filters */}
        <div className="flex items-end">
          <button
            onClick={handleClearFilters}
            className="text-sm text-brand-blue hover:underline hover:text-brand-blue-light transition-colors"
            type="button"
          >
            {t('clearFilters')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectFilters; 