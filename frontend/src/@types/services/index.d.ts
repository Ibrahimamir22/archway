import { ServiceCategory } from '@/hooks/services/useServiceCategories';

/**
 * Represents a feature of a service
 */
export interface ServiceFeature {
  id: string;
  name: string;
  description: string;
  is_included: boolean;
  order: number;
}

/**
 * Represents a service offered by the company
 */
export interface Service {
  id: string;
  title: string;
  slug: string;
  short_description: string;
  description: string;
  category: ServiceCategory;
  icon: string;
  image?: string;
  image_url?: string;
  cover_image?: string;
  cover_image_url?: string;
  price?: number;
  price_unit?: string;
  duration?: string;
  is_featured: boolean;
  is_published: boolean;
  order: number;
  features?: ServiceFeature[];
}

/**
 * Options for fetching services
 */
export interface UseServicesOptions {
  category?: string;
  featured?: boolean;
  limit?: number;
}

/**
 * Response from services API
 */
export interface ServicesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Service[];
} 