/**
 * Project-related type definitions
 */

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: Category;
  client?: string;
  location?: string;
  area?: number;
  completed_date?: string;
  is_featured: boolean;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  tags: Tag[];
  cover_image?: string;
  cover_image_url?: string;
  image?: string;
  images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  image: string;
  image_url?: string;
  alt_text: string;
  is_cover: boolean;
  src?: string;
  alt?: string;
  isCover?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface UseProjectsOptions {
  category?: string;
  tag?: string;
  search?: string;
  featured?: boolean;
  is_published?: boolean;
  limit?: number;
}

export interface ProjectsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Project[];
} 