'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import FAQCategory from './FAQCategory';
import FAQSearch from './FAQSearch';
import { useFAQs, useFAQPrefetch } from '@/lib/hooks/marketing/faq';

interface FAQProps {
  locale: string;
}

/**
 * Main FAQ component that displays categorized questions with search functionality
 */
export default function FAQ({ locale }: FAQProps) {
  const t = useTranslations('faq');
  const isRtl = locale === 'ar';
  
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  
  // Use custom hooks to fetch FAQs and handle prefetching
  const { faqs, categories, isLoading, error } = useFAQs(locale);
  const { prefetchCategory, prefetchAllCategories } = useFAQPrefetch(locale);
  
  // Detect client-side rendering to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Handle initial active category
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);
  
  // Handle category prefetching on hover
  useEffect(() => {
    if (!hoveredCategory || !isClient) return;
    
    if (hoveredCategory === 'all') {
      prefetchAllCategories();
    } else {
      prefetchCategory(hoveredCategory);
    }
  }, [hoveredCategory, prefetchCategory, prefetchAllCategories, isClient]);
  
  // Filter FAQs by search query
  const filteredFAQs = searchQuery.trim() === ''
    ? faqs
    : faqs.filter(faq => 
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      );
  
  // Filter FAQs by category
  const categoryFilteredFAQs = activeCategory === 'all'
    ? filteredFAQs
    : filteredFAQs.filter(faq => faq.category === activeCategory);
  
  // Handler for category button hover
  const handleCategoryHover = useCallback((categoryId: string) => {
    setHoveredCategory(categoryId);
  }, []);
  
  // Handler for category button click
  const handleCategoryClick = useCallback((categoryId: string) => {
    setActiveCategory(categoryId);
    setHoveredCategory(null);
  }, []);
  
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-8">
        {/* Category tabs skeleton */}
        <div className="flex space-x-4 overflow-x-auto pb-2">
          {[1, 2, 3, 4].map((_, index) => (
            <div key={index} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg w-32"></div>
          ))}
        </div>
        
        {/* Search skeleton */}
        <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg w-full"></div>
        
        {/* FAQs skeleton */}
        {[1, 2, 3, 4, 5].map((_, index) => (
          <div key={index} className="space-y-3">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
            <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  // Only show error state if there's an error AND no data is available
  if (error && faqs.length === 0 && categories.length === 0) {
    return (
      <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-6 text-center">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          {t('tryAgain')}
        </button>
      </div>
    );
  }

  // Prepare tabs for rendering
  let tabs = [
    <button
      key="all"
      onClick={() => handleCategoryClick('all')}
      onMouseEnter={() => handleCategoryHover('all')}
      onMouseLeave={() => setHoveredCategory(null)}
      className={`px-5 py-2.5 rounded-lg whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/70 dark:focus:ring-brand-accent/70 ${
        activeCategory === 'all'
          ? 'bg-brand-blue text-white dark:bg-brand-accent hover:bg-brand-blue/90 dark:hover:bg-brand-accent/90 shadow-md'
          : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
      }`}
    >
      {t('allCategories')}
    </button>,
    ...categories.map(category => (
      <button
        key={category.id}
        onClick={() => handleCategoryClick(category.id)}
        onMouseEnter={() => handleCategoryHover(category.id)}
        onMouseLeave={() => setHoveredCategory(null)}
        className={`px-5 py-2.5 rounded-lg whitespace-nowrap font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-blue/70 dark:focus:ring-brand-accent/70 ${
          activeCategory === category.id
            ? 'bg-brand-blue text-white dark:bg-brand-accent hover:bg-brand-blue/90 dark:hover:bg-brand-accent/90 shadow-md'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
      >
        {category.name}
      </button>
    ))
  ];
  
  // For RTL, reverse the tab order so "All Categories" appears on the right
  if (isRtl) {
    tabs = tabs.reverse();
  }

  // To prevent hydration mismatch, render a simplified version on server
  if (!isClient) {
    return (
      <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="flex gap-3 overflow-x-auto py-2 pb-4">
          {/* Empty tabs for server render */}
        </div>
        <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-lg w-full"></div>
        <div className="space-y-14"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Category tabs */}
      <div className="flex gap-3 overflow-x-auto py-2 pb-4">
        {tabs}
      </div>
      
      {/* Search bar */}
      <FAQSearch 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        placeholder={t('searchPlaceholder')}
        isRtl={isRtl}
      />
      
      {/* FAQ Categories */}
      <div className="space-y-14">
        {searchQuery.trim() !== '' && categoryFilteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
              {t('noResults')}
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {t('tryDifferentSearch')}
            </p>
          </div>
        ) : (
          <>
            {activeCategory === 'all' ? (
              // Group by category when "All" is selected
              categories.map(category => {
                const categoryFAQs = filteredFAQs.filter(faq => faq.category === category.id);
                if (categoryFAQs.length === 0) return null;
                
                return (
                  <FAQCategory 
                    key={category.id}
                    title={category.name}
                    faqs={categoryFAQs}
                    isRtl={isRtl}
                  />
                );
              })
            ) : (
              // Show only the selected category
              <FAQCategory 
                title={categories.find(c => c.id === activeCategory)?.name || ''}
                faqs={categoryFilteredFAQs}
                isRtl={isRtl}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
} 