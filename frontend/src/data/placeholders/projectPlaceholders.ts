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
}

/**
 * Generates an array of image objects for a project
 * @param slug - The project slug
 * @param category - The category slug (used in path)
 * @param options - Configuration options
 * @returns Array of image objects
 */
export const generateImageArray = (
  slug: string, 
  category: string,
  options: {
    useExistingImages?: boolean;
    startIndex?: number; 
    endIndex?: number;
    coverImageName?: string;
    fallbackPrefix?: string;
  } = {}
): ProjectImage[] => {
  const {
    useExistingImages = true,
    startIndex = 1,
    endIndex = 10,
    coverImageName = `${slug}.jpg`,
    fallbackPrefix = 'project'
  } = options;
  
  const images: ProjectImage[] = [];
  const title = slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  
  if (useExistingImages) {
    // Add cover image for projects with real images
    images.push({
      id: 'image-cover',
      src: `/images/projects/${category}/${slug}/${coverImageName}`,
      alt: title,
      isCover: true
    });
    
    // Add only images in the specified range
    for (let i = startIndex; i <= endIndex; i++) {
      const imageName = i < 10 ? `image-0${i}.jpg` : `image-${i}.jpg`;
      const imageUrl = `/images/projects/${category}/${slug}/${imageName}`;
      
      images.push({
        id: `image-${i}`,
        src: imageUrl,
        alt: `${title} - Image ${i}`,
        isCover: false
      });
    }
  } else {
    // Create fallback images for projects without real assets
    const fallbackCoverIndex = 1;
    
    // Add fallback cover image
    images.push({
      id: 'image-cover',
      src: `/images/${fallbackPrefix}-${fallbackCoverIndex}.jpg`,
      alt: title,
      isCover: true
    });
    
    // Add fallback images using sequential numbers
    for (let i = 1; i < endIndex; i++) {
      const fallbackIndex = (i + fallbackCoverIndex) % 5 + 1; // Cycle through 1-5
      
      images.push({
        id: `image-${i}`,
        src: `/images/${fallbackPrefix}-${fallbackIndex}.jpg`,
        alt: `${title} - ${i === 1 ? 'Living Room' : i === 2 ? 'Kitchen' : 'Room ' + i}`,
        isCover: false
      });
    }
  }
  
  return images;
};

/**
 * Get the cover image URL from an images array
 */
export const getCoverImageUrl = (images: ProjectImage[]): string => {
  const coverImage = images.find(img => img.isCover);
  return coverImage ? coverImage.src : images[0]?.src || '/images/placeholder.jpg';
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
    images: generateImageArray('madinaty-villa', 'residential', {
      startIndex: 1,
      endIndex: 43
    })
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
      { id: 'tag-4', name: 'Urban', slug: 'urban' },
      { id: 'tag-5', name: 'Compact', slug: 'compact' },
      { id: 'tag-6', name: 'Smart Home', slug: 'smart-home' }
    ],
    // Generate fallback images since these don't exist yet
    images: generateImageArray('urban-apartment', 'residential', { 
      useExistingImages: false,
      endIndex: 3,
      fallbackPrefix: 'project'
    })
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
      { id: 'tag-7', name: 'Office', slug: 'office' },
      { id: 'tag-8', name: 'Professional', slug: 'professional' },
      { id: 'tag-9', name: 'Corporate', slug: 'corporate' }
    ],
    // Generate fallback images since these don't exist yet
    images: generateImageArray('office-renovation', 'commercial', { 
      useExistingImages: false,
      endIndex: 3,
      fallbackPrefix: 'project'
    })
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
  const projects = Object.values(placeholderProjects).slice(0, limit);
  
  // Add image property dynamically when needed for backward compatibility
  return projects.map(project => ({
    ...project,
    image: getCoverImageUrl(project.images)
  }));
}; 