'use client';

import { useState, useEffect, useCallback } from 'react';
import FAQCategory from './FAQCategory';
import FAQSearch from './FAQSearch';
import { FAQ, FAQCategory as FAQCategoryType } from '@/types/marketing/faq';

interface FAQClientProps {
  faqs: FAQ[];
  categories: FAQCategoryType[];
  locale: string;
  isRtl: boolean;
  translations: {
    allCategories: string;
    searchPlaceholder: string;
    noResults: string;
    tryDifferentSearch: string;
    tryAgain: string;
    errorLoadingFAQs: string;
  };
}

/**
 * Client-side FAQ component that handles interactivity
 */
export default function FAQClient({ 
  faqs, 
  categories, 
  locale, 
  isRtl,
  translations 
}: FAQClientProps) {
  const [isClient, setIsClient] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  
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
      {translations.allCategories}
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
        placeholder={translations.searchPlaceholder}
        isRtl={isRtl}
      />
      
      {/* FAQ Categories */}
      <div className="space-y-14">
        {searchQuery.trim() !== '' && categoryFilteredFAQs.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-600 dark:text-gray-300">
              {translations.noResults}
            </h3>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              {translations.tryDifferentSearch}
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