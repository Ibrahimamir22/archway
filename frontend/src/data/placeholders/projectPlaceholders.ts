/**
 * Project placeholder data and utilities for the portfolio.
 * This centralizes all placeholder data for projects to improve maintainability.
 */

// Project-related interfaces
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

export interface PlaceholderProject {
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
  image?: string; // For simpler card display
}

/**
 * Generates an array of image objects for a project
 * @param slug - The project slug
 * @param category - The category slug (used in path)
 * @param startIndex - Starting image index
 * @param endIndex - Ending image index
 * @param coverImageName - Name of the cover image file
 * @returns Array of image objects
 */
export const generateImageArray = (
  slug: string, 
  category: string, 
  startIndex: number = 1,
  endIndex: number = 43,  // Set a reasonable limit based on what you know exists
  coverImageName: string = `${slug}.jpg`
): ProjectImage[] => {
  const images: ProjectImage[] = [];
  
  // Add cover image
  images.push({
    id: 'image-cover',
    src: `/images/projects/${category}/${slug}/${coverImageName}`,
    alt: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
    isCover: true
  });
  
  // Add only images in the specified range
  for (let i = startIndex; i <= endIndex; i++) {
    const imageName = i < 10 ? `image-0${i}.jpg` : `image-${i}.jpg`;
    const imageUrl = `/images/projects/${category}/${slug}/${imageName}`;
    
    images.push({
      id: `image-${i}`,
      src: imageUrl,
      alt: `${slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} - Image ${i}`,
      isCover: false
    });
  }
  
  return images;
};

/**
 * Placeholder projects data
 */
export const placeholderProjects: Record<string, PlaceholderProject> = {
  'madinaty-villa': {
    id: 'placeholder-1',
    title: 'Madinaty Villa',
    slug: 'madinaty-villa',
    description: 'Luxurious villa design in Madinaty featuring elegant interiors, open living spaces, and premium finishes that blend comfort with sophisticated aesthetics.',
    category: { name: 'Residential', slug: 'residential' },
    client: 'Private Client',
    location: 'Madinaty, Cairo',
    area: 450,
    completedDate: '2023',
    tags: [
      { id: 'tag-1', name: 'Villa', slug: 'villa' },
      { id: 'tag-2', name: 'Luxury', slug: 'luxury' },
      { id: 'tag-3', name: 'Modern', slug: 'modern' }
    ],
    // Generate images with known range
    images: generateImageArray('madinaty-villa', 'residential', 1, 43),
    // Add single image for card display
    image: '/images/projects/residential/madinaty-villa/madinaty-villa.jpg'
  },
  'urban-apartment': {
    id: 'placeholder-2',
    title: 'Urban Apartment',
    slug: 'urban-apartment',
    description: 'Compact apartment design maximizing space and functionality in urban settings with smart storage solutions and multifunctional furniture.',
    category: { name: 'Residential', slug: 'residential' },
    client: 'Modern Living Co.',
    location: 'Downtown Cairo',
    area: 120,
    completedDate: '2023',
    tags: [
      { id: 'tag-3', name: 'Urban', slug: 'urban' },
      { id: 'tag-4', name: 'Compact', slug: 'compact' },
      { id: 'tag-5', name: 'Smart Home', slug: 'smart-home' }
    ],
    // Use fallback images since these don't exist yet
    images: [
      {
        id: 'image-1', 
        src: '/images/project-2.jpg', 
        alt: 'Urban Apartment', 
        isCover: true 
      },
      {
        id: 'image-2', 
        src: '/images/project-3.jpg', 
        alt: 'Urban Apartment Living Room'
      },
      {
        id: 'image-3', 
        src: '/images/project-4.jpg', 
        alt: 'Urban Apartment Kitchen'
      }
    ],
    image: '/images/project-2.jpg'
  },
  'office-renovation': {
    id: 'placeholder-3',
    title: 'Office Renovation',
    slug: 'office-renovation',
    description: 'Professional workspace designed for productivity and collaboration with ergonomic solutions, optimal lighting, and flexible meeting areas.',
    category: { name: 'Commercial', slug: 'commercial' },
    client: 'Corporate Solutions Inc.',
    location: 'New Cairo',
    area: 300,
    completedDate: '2023',
    tags: [
      { id: 'tag-5', name: 'Office', slug: 'office' },
      { id: 'tag-6', name: 'Professional', slug: 'professional' },
      { id: 'tag-7', name: 'Corporate', slug: 'corporate' }
    ],
    // Use fallback images since these don't exist yet
    images: [
      {
        id: 'image-1', 
        src: '/images/project-3.jpg', 
        alt: 'Office Renovation', 
        isCover: true 
      },
      {
        id: 'image-2', 
        src: '/images/project-4.jpg', 
        alt: 'Office Renovation Meeting Room'
      },
      {
        id: 'image-3', 
        src: '/images/project-5.jpg', 
        alt: 'Office Renovation Workspace'
      }
    ],
    image: '/images/project-3.jpg'
  }
};

/**
 * Get an array of placeholder project slugs
 */
export const getPlaceholderSlugs = (): string[] => {
  return Object.keys(placeholderProjects);
};

/**
 * Get a placeholder project by slug
 */
export const getPlaceholderProject = (slug: string): PlaceholderProject | undefined => {
  return placeholderProjects[slug];
};

/**
 * Get all placeholder projects as an array
 */
export const getAllPlaceholderProjects = (): PlaceholderProject[] => {
  return Object.values(placeholderProjects);
};

/**
 * Get a specified number of placeholder projects
 */
export const getPlaceholderProjectsWithLimit = (limit: number = 3): PlaceholderProject[] => {
  return Object.values(placeholderProjects).slice(0, limit);
}; 