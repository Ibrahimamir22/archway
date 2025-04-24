/**
 * Type definitions for portfolio projects
 */

export interface ProjectTag {
  id: string;
  name: string;
  slug: string;
}

export interface ProjectCategory {
  id?: string;
  name: string;
  slug: string;
}

export interface ProjectImage {
  id: string;
  src: string;
  alt: string;
  isCover?: boolean;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: ProjectCategory;
  client?: string;
  location?: string;
  area?: number;
  completedDate?: string;
  tags: ProjectTag[];
  images: ProjectImage[];
  image?: string; // For backward compatibility
} 