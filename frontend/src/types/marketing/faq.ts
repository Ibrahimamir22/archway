/**
 * FAQ item with question and answer content
 */
export interface FAQ {
  id: string;
  question: string;
  answer: string; // Can contain HTML
  category: string; // Category ID
  order?: number;
  language?: string;
}

/**
 * FAQ category grouping related questions
 */
export interface FAQCategory {
  id: string;
  name: string; // Display name
  slug?: string;
  order?: number;
  is_active?: boolean;
}

/**
 * FAQ search state type
 */
export interface FAQSearchState {
  query: string;
  activeCategory: string | null;
}

/**
 * FAQ Language information
 */
export interface FAQLanguage {
  code: string;
  name: string;
}

/**
 * API response for fetched FAQs
 */
export interface FAQsResponse {
  faqs: FAQ[];
  categories: FAQCategory[];
}

/**
 * Hook return type for FAQ data
 */
export interface UseFAQsReturn {
  faqs: FAQ[];
  categories: FAQCategory[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Hook return type for FAQ language data
 */
export interface UseFAQLanguagesReturn {
  languages: FAQLanguage[];
  isLoading: boolean;
  error: string | null;
} 