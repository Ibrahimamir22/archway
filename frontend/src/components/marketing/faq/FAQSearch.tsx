'use client';

import { useState, useRef } from 'react';
import { MdSearch, MdClose } from 'react-icons/md';

interface FAQSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  placeholder: string;
  isRtl: boolean;
}

/**
 * Search component for filtering FAQs
 */
export default function FAQSearch({ 
  searchQuery, 
  setSearchQuery, 
  placeholder,
  isRtl 
}: FAQSearchProps) {
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Clear search and focus input
  const handleClearSearch = () => {
    setSearchQuery('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`relative ${isFocused ? 'ring-2 ring-brand-blue/70 dark:ring-brand-accent/70 rounded-lg' : ''}`}>
      <div className={`absolute inset-y-0 ${isRtl ? 'right-0' : 'left-0'} flex items-center ${isRtl ? 'pr-4' : 'pl-4'}`}>
        <MdSearch className="h-5 w-5 text-gray-400 dark:text-gray-500" aria-hidden="true" />
      </div>
      
      <input
        ref={inputRef}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className={`block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 py-3.5 
        ${isRtl ? 'text-right pr-12 pl-4' : 'text-left pl-12 pr-4'}
        shadow-sm focus:border-brand-blue focus:ring-0 focus:outline-none dark:focus:border-brand-accent
        text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500`}
        placeholder={placeholder}
        dir={isRtl ? 'rtl' : 'ltr'}
      />
      
      {searchQuery && (
        <button
          type="button"
          className={`absolute inset-y-0 ${isRtl ? 'left-0' : 'right-0'} flex items-center ${isRtl ? 'pl-4' : 'pr-4'}`}
          onClick={handleClearSearch}
          aria-label="Clear search"
        >
          <MdClose className="h-5 w-5 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400" aria-hidden="true" />
        </button>
      )}
    </div>
  );
} 