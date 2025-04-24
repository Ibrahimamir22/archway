'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ServiceCategory } from '@/lib/hooks/services/types';

interface FilterOptions {
  category?: string;
  search?: string;
}

interface ServiceFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  initialFilters: FilterOptions;
  categories: ServiceCategory[];
  isLoading?: boolean;
  error?: any;
}

/**
 * Filters for services by category and search term
 */
const ServiceFilters: React.FC<ServiceFiltersProps> = ({
  onFilterChange,
  initialFilters = {},
  categories = [],
  isLoading = false,
  error = null
}) => {
  const t = useTranslations('services');
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const locale = params?.locale ? String(params.locale) : 'en';
  const isRtl = locale === 'ar';
  
  // State for filter values
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    initialFilters.category || searchParams?.get('category') || undefined
  );
  const [searchTerm, setSearchTerm] = useState<string>(
    initialFilters.search || searchParams?.get('search') || ''
  );
  
  // Safe arrays
  const safeCategories = Array.isArray(categories) ? categories : [];
  
  // Apply filters when they change
  useEffect(() => {
    const newFilters: FilterOptions = {};
    
    if (selectedCategory && selectedCategory !== 'all') {
      newFilters.category = selectedCategory;
    }
    
    if (searchTerm) {
      newFilters.search = searchTerm;
    }
    
    onFilterChange(newFilters);
    
    // Update URL query parameters
    const params = new URLSearchParams();
    if (newFilters.category) params.append('category', newFilters.category);
    if (newFilters.search) params.append('search', newFilters.search);
    
    const newQuery = params.toString();
    const path = `/${locale}/services${newQuery ? `?${newQuery}` : ''}`;
    
    // Use router.replace to update URL without full page reload
    router.replace(path, { scroll: false });
  }, [selectedCategory, searchTerm, onFilterChange, router, locale]);
  
  // Handle category change
  const handleCategoryChange = (categorySlug: string) => {
    setSelectedCategory(categorySlug === 'all' ? undefined : categorySlug);
  };
  
  // Handle search submit
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is already applied via the effect
  };
  
  // Clear all filters
  const clearFilters = () => {
    setSelectedCategory(undefined);
    setSearchTerm('');
  };
  
  return (
    <div className="mb-10">
      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder={t('searchServices', { default: "Search services..." })}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-transparent"
            dir={isRtl ? 'rtl' : 'ltr'}
          />
          <button
            type="submit"
            className="absolute top-0 right-0 h-full px-4 text-gray-500"
            disabled={isLoading}
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
              ></path>
            </svg>
          </button>
        </div>
      </form>
      
      {/* Category Filters */}
      <div className="mb-6">
        <h3 className={`text-lg font-medium mb-3 ${isRtl ? 'text-right' : ''}`}>
          {t('filterByCategory', { default: 'Filter by category' })}
        </h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleCategoryChange('all')}
            className={`px-4 py-2 rounded-md ${
              !selectedCategory
                ? 'bg-brand-blue text-white'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            {t('allServices')}
          </button>
          
          {safeCategories.map((category) => (
            <button
              key={category.id || category.slug}
              onClick={() => handleCategoryChange(category.slug)}
              className={`px-4 py-2 rounded-md ${
                selectedCategory === category.slug
                  ? 'bg-brand-blue text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>
      
      {/* Clear Filters */}
      {(selectedCategory || searchTerm) && (
        <button
          onClick={clearFilters}
          className="text-brand-blue hover:underline flex items-center"
        >
          <svg
            className="w-4 h-4 mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
          {t('clearFilters', { default: 'Clear filters' })}
        </button>
      )}
    </div>
  );
};

export default ServiceFilters; 