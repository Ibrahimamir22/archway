import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Button from '@/components/common/Button';
import LoadingState from '@/components/common/LoadingState';
import { useProjectDetail, fixImageUrl } from '@/hooks/useProjects';
import axios from 'axios';
import OptimizedImage from '@/components/common/OptimizedImage';
import { 
  getPlaceholderProject, 
  getPlaceholderSlugs, 
  PlaceholderProject 
} from '@/data/placeholders/projectPlaceholders';

interface ProjectDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: {
    name: string;
    slug: string;
  };
  client?: string;
  location?: string;
  area?: number;
  completedDate?: string;
  tags: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
  images: Array<{
    id: string;
    src: string;
    alt: string;
    isCover: boolean;
  }>;
}

// Update image preload function to use normalizedUrl
export const createImagePreloadTags = (images: {id: string, src: string}[]) => {
  return images
    .map(image => `<link rel="preload" href="${image.src}" as="image" />`)
    .join('');
};

const ProjectDetailPage: NextPage<{ initialProject?: ProjectDetail }> = ({ initialProject }) => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const isRtl = router.locale === 'ar';
  const { slug } = router.query;
  
  // Create a more robust error tracking state
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  
  // Log current language for debugging and force reload translations when locale changes
  useEffect(() => {
    console.log('Current language:', i18n.language);
    console.log('Router locale:', router.locale);
    console.log('isRtl:', isRtl);
    
    // Force refresh translations when locale changes
    if (router.locale && router.locale !== i18n.language) {
      i18n.changeLanguage(router.locale);
    }
  }, [router.locale, i18n, isRtl]);
  
  // Filter out images that failed to load
  const getFilteredImages = () => {
    if (!project?.images) return [];
    
    // Only show images that haven't explicitly failed
    return project.images.filter(img => !imageErrors[img.id]);
  };
  
  // Improved error handler for images
  const handleImageError = (imageId: string) => {
    console.log(`Image failed to load: ${imageId}`);
    // Use a direct object update instead of a function to satisfy TypeScript
    const newErrors = { ...imageErrors };
    newErrors[imageId] = true;
    setImageErrors(newErrors);
  };
  
  // Success handler for images
  const handleImageLoad = (imageId: string) => {
    // Use a direct object update instead of a function to satisfy TypeScript
    const newLoaded = { ...loadedImages };
    newLoaded[imageId] = true;
    setLoadedImages(newLoaded);
  };

  // Use the useProjectDetail hook to fetch the project
  const { project: fetchedProject, loading } = useProjectDetail(
    typeof slug === 'string' ? slug : ''
  );
  
  // Use fetched project or fall back to initial data
  const project = fetchedProject || initialProject;
  
  // Get cover image (first checking that it loaded successfully)
  const coverImage = project?.images?.find((img: {id: string, src: string, alt: string, isCover: boolean}) => 
    img.isCover === true && !imageErrors[img.id]
  );
  
  // If no valid cover, get first valid image
  const firstValidImage = project?.images?.find((img: {id: string}) => !imageErrors[img.id]);

  // Update the getImageSrc function to ensure it always returns valid image URLs
  const getImageSrc = (image: {id: string, src: string}) => {
    if (!image || !image.src) {
      return '/images/placeholder.jpg';
    }
    
    // Return the actual image source
    return image.src;
  };
  
  // If in fallback mode or still loading
  if (router.isFallback || (loading && !initialProject)) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingState type="card" />
      </div>
    );
  }
  
  // If no project data is available
  if (!project) {
    return (
      <>
        <Head>
          <title>{t('projectNotFound')} | Archway Interior Design</title>
          <meta name="description" content="Project not found" />
        </Head>
        
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('projectNotFound') || 'Project Not Found'}</h1>
            <p className="text-gray-600 mb-8">{t('projectNotFoundDesc') || 'The project you are looking for does not exist or may have been removed.'}</p>
            <Link href="/portfolio">
              <Button variant="primary">
                {t('backToPortfolio') || '← Back to Portfolio'}
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }
  
  // Get translated project title if available
  const projectTitle = t(`projects.${project.slug}`, { defaultValue: project.title });
  
  // Get translated project description
  const projectDescription = t(`descriptions.${project.slug}`, { defaultValue: project.description });
  
  // Function to get translated category name
  const getCategoryName = (category: {name: string, slug: string}) => {
    return t(`categories.${category.slug}`, { defaultValue: category.name });
  };
  
  // Function to get translated tag name
  const getTagName = (tag: {name: string, slug: string}) => {
    return t(`tags.${tag.slug}`, { defaultValue: tag.name });
  };
  
  // Function to get translated client name
  const getClientName = (client?: string) => {
    return client ? t(`clients.${client}`, { defaultValue: client }) : '';
  };
  
  // Function to get translated location
  const getLocationName = (location?: string) => {
    return location ? t(`locations.${location}`, { defaultValue: location }) : '';
  };
  
  // Add useEffect for preloading images when page first loads
  useEffect(() => {
    // Preload all project images to ensure they're in browser cache
    if (project?.images?.length) {
      console.log(`Preloading ${project.images.length} images for ${project.slug}`);
      
      // Create a hidden div for preloading
      const preloadDiv = document.createElement('div');
      preloadDiv.style.position = 'absolute';
      preloadDiv.style.width = '0';
      preloadDiv.style.height = '0';
      preloadDiv.style.overflow = 'hidden';
      preloadDiv.style.opacity = '0';
      document.body.appendChild(preloadDiv);
      
      // Preload all images
      project.images.forEach((image: {id: string, src: string}) => {
        if (image.src) {
          const imgEl = document.createElement('img');
          imgEl.src = image.src;
          imgEl.alt = "Preloading";
          preloadDiv.appendChild(imgEl);
          console.log(`Preloading: ${image.src}`);
        }
      });
      
      // Remove preload div after images have loaded
      return () => {
        if (document.body.contains(preloadDiv)) {
          document.body.removeChild(preloadDiv);
        }
      };
    }
  }, [project?.slug, project?.images]);
  
  return (
    <>
      <Head>
        <title>{projectTitle} | Archway Interior Design</title>
        <meta name="description" content={projectDescription} />
        
        {/* Preload critical project images */}
        {project.images && project.images.length > 0 && (
          <>
            {/* Only preload the cover image, other images will be handled by OptimizedImage */}
            {coverImage && (
              <link 
                key={`preload-cover-${coverImage.id}`}
                rel="preload" 
                href={coverImage.src} 
                as="image"
                importance="high"
              />
            )}
          </>
        )}
      </Head>
      
      <div className="container mx-auto px-4 py-12">
        {/* Project Header */}
        <div className={`mb-12 ${isRtl ? 'text-right' : ''}`}>
          <Link href="/portfolio" className="text-brand-blue hover:underline mb-4 inline-block">
            ← {t('backToPortfolio')}
          </Link>
          <h1 className="text-4xl font-heading font-bold mb-4">{projectTitle}</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-sm">
              {getCategoryName(project.category)}
            </span>
            {project.tags.map((tag: {id: string, name: string, slug: string}) => (
              <span key={tag.id} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {getTagName(tag)}
              </span>
            ))}
          </div>
          
          <p className="text-lg text-gray-700">{projectDescription}</p>
        </div>
        
        {/* Project Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className={`col-span-2 ${isRtl ? 'text-right' : ''}`}>
            {/* Main Project Image */}
            <div className="relative h-[500px] w-full overflow-hidden rounded-lg mb-6 bg-gray-100">
              {coverImage ? (
                <OptimizedImage
                  src={getImageSrc(coverImage)}
                  alt={coverImage.alt || project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                  priority={true}
                  onError={() => handleImageError(coverImage.id)}
                  onLoad={() => handleImageLoad(coverImage.id)}
                />
              ) : firstValidImage ? (
                <OptimizedImage
                  src={getImageSrc(firstValidImage)}
                  alt={firstValidImage.alt || project.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 50vw"
                  priority={true}
                  onError={() => handleImageError(firstValidImage.id)}
                  onLoad={() => handleImageLoad(firstValidImage.id)}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <p>{t('noImageAvailable')}</p>
                </div>
              )}
            </div>
          </div>
          
          <div className={`${isRtl ? 'text-right' : ''}`}>
            {/* Project Info */}
            <div className="bg-brand-light p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-xl font-semibold mb-4">{t('projectDetails')}</h3>
              
              <div className="space-y-3">
                {project.client && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('client')}:</span>
                    <span className="font-medium">{getClientName(project.client)}</span>
                  </div>
                )}
                
                {project.location && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('location')}:</span>
                    <span className="font-medium">{getLocationName(project.location)}</span>
                  </div>
                )}
                
                {project.area && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('area')}:</span>
                    <span className="font-medium">{project.area} {t('areaUnit')}</span>
                  </div>
                )}
                
                {project.completedDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('completed')}:</span>
                    <span className="font-medium">{project.completedDate}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="bg-brand-blue p-6 rounded-lg shadow-sm text-white">
              <h3 className="text-xl font-semibold mb-4">{t('interestedInThisStyle')}</h3>
              <p className="mb-6">{t('contactUsForSimilarProject')}</p>
              <Link href="/contact">
                <Button variant="secondary" fullWidth>
                  {t('getInTouch')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Project Gallery */}
        {getFilteredImages().length > 1 ? (
          <div className={`${isRtl ? 'text-right' : ''}`}>
            <h2 className="text-2xl font-heading font-semibold mb-6">{t('projectGallery')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredImages()
                .filter(image => !image.isCover) // Skip the cover image
                .map((image: {id: string, src: string, alt: string}, index: number) => (
                  <div key={image.id} className="relative h-64 rounded-lg overflow-hidden shadow-md bg-gray-100">
                    <OptimizedImage 
                      src={getImageSrc(image)}
                      alt={image.alt || `Project image ${index + 1}`}
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={() => handleImageError(image.id)}
                      onLoad={() => handleImageLoad(image.id)}
                    />
                  </div>
                ))}
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

// Smart detection of environment to handle both browser and container contexts
const getApiBaseUrl = () => {
  // Check if we're in a browser environment
  const isBrowser = typeof window !== 'undefined';
  
  // Get the configured API URL (from environment variables)
  const configuredUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (configuredUrl) {
    // If we're in a browser and the URL contains 'backend', replace with 'localhost'
    if (isBrowser && configuredUrl.includes('backend')) {
      return configuredUrl.replace('backend', 'localhost');
    }
    return configuredUrl;
  }
  
  // Default fallback - use backend for server-side, localhost for client-side
  return isBrowser 
    ? 'http://localhost:8000/api/v1' 
    : 'http://backend:8000/api/v1';
};

export const getStaticPaths: GetStaticPaths = async ({ locales = ['en'] }) => {
  const API_BASE_URL = getApiBaseUrl();
  
  // Get placeholder slugs from the centralized file
  const placeholderSlugs = getPlaceholderSlugs();
  
  try {
    // Fetch projects for static paths
    const projectsResponse = await axios.get(`${API_BASE_URL}/projects/?limit=100`);
    const projects = projectsResponse.data.results || [];
    
    // Extract slugs from projects
    const apiSlugs = projects.map((project: any) => project.slug);
    
    // Combine real and placeholder slugs, removing duplicates
    const allSlugs = [...new Set([...apiSlugs, ...placeholderSlugs])];
    
    // Create paths for all locales and slugs
    const paths = locales.flatMap(locale => 
      allSlugs.map((slug: string) => ({
        params: { slug },
        locale
      }))
    );
    
    return {
      paths,
      fallback: true,
    };
  } catch (error: any) {
    console.error('Error fetching project slugs:', error.message || 'Unknown error');
    
    // Even if API call fails, still generate paths for placeholders
    const fallbackPaths = locales.flatMap(locale => 
      placeholderSlugs.map(slug => ({
        params: { slug },
        locale
      }))
    );
    
    return {
      paths: fallbackPaths,
      fallback: true,
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params, locale = 'en' }) => {
  const API_BASE_URL = getApiBaseUrl();
  const slug = params?.slug as string;
  
  // Check if this is a placeholder project using the centralized getter
  const placeholderProject = getPlaceholderProject(slug);
  
  if (placeholderProject) {
    return {
      props: {
        initialProject: placeholderProject,
        ...(await serverSideTranslations(locale, ['common'])),
      },
      revalidate: 60
    };
  }
  
  // If not a placeholder, proceed with normal API call
  try {
    // Fetch project data from API
    const projectParams = new URLSearchParams();
    projectParams.append('lang', locale);
    
    const response = await axios.get(`${API_BASE_URL}/projects/${slug}/?${projectParams.toString()}`);
    const projectData = response.data;
    
    // Log the raw image data for debugging
    console.log(`[Server] Raw image data for ${slug}:`, 
      projectData.images?.map((img: any) => ({ 
        id: img.id, 
        url: img.image_url || img.image
      }))
    );
    
    // Helper function to normalize image URLs with strict validation
    const normalizeImageUrl = (url: string): string => {
      if (!url) {
        console.log('[Server] Empty image URL detected');
        return '/images/placeholder.jpg';
      }
      
      // Detect if URL contains a hash that might cause issues
      const hashPattern = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/;
      if (hashPattern.test(url)) {
        console.log(`[Server] URL with problematic hash detected: ${url}`);
      }
      
      // Clean URL for browser consumption
      if (url.includes('backend:8000')) {
        return url.replace(/backend:8000/g, 'localhost:8000');
      }
      
      // Handle absolute media paths
      if (url.startsWith('/media/')) {
        return `http://localhost:8000${url}`;
      }
      
      // Handle relative media paths
      if (url.startsWith('media/')) {
        return `http://localhost:8000/${url}`;
      }
      
      // Log any URLs that don't match known patterns
      if (!url.includes('http') && !url.includes('media')) {
        console.log(`[Server] Unusual image URL format: ${url}`);
        return '/images/placeholder.jpg';
      }
      
      return url;
    };
    
    // Process images properly at build time with normalized URLs
    const images = projectData.images || [];
    let safeImages = images.map((img: any, index: number) => {
      // Get image source with explicit fallback for missing sources
      let imgSrc = img.image_url || img.image;
      
      // Log if image source is missing
      if (!imgSrc) {
        console.log(`[Server] No source for image ${index} in project ${slug}, using fallback`);
        imgSrc = `/images/project-${(index % 5) + 1}.jpg`;
      } else {
        console.log(`[Server] Processing image for ${slug}: ${imgSrc}`);
      }
      
      return {
        id: img.id || `image-${index + 1}`,
        src: normalizeImageUrl(imgSrc),
        alt: img.alt_text || `${projectData.title} image ${index + 1}`,
        isCover: img.is_cover
      };
    });
    
    // Log normalized images for verification
    console.log(`[Server] Normalized images for ${slug}:`, 
      safeImages.map((img: {id: string, src: string}) => ({ id: img.id, src: img.src }))
    );
    
    const project: ProjectDetail = {
      id: projectData.id || slug,
      title: projectData.title || 'Project',
      slug: projectData.slug || slug,
      description: projectData.description || 'No description available',
      category: {
        name: projectData.category?.name || 'Uncategorized',
        slug: projectData.category?.slug || 'uncategorized'
      },
      client: projectData.client || undefined,
      location: projectData.location || undefined,
      area: projectData.area || undefined,
      completedDate: projectData.completed_date || undefined,
      tags: Array.isArray(projectData.tags) ? projectData.tags : [],
      images: safeImages || []
    };
    
    return {
      props: {
        initialProject: project,
        ...(await serverSideTranslations(locale, ['common'])),
      },
      revalidate: 60 // Revalidate the page every 60 seconds
    };
  } catch (error: any) {
    console.error(`Error fetching project details for ${slug}:`, error.message || 'Unknown error');
    
    // If API call fails, fall back to mock data
    const mockProject: ProjectDetail = {
      id: '1',
      title: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      slug,
      description: 'Project description unavailable',
      category: {
        name: 'Unknown',
        slug: 'unknown'
      },
      tags: [],
      images: []
    };
    
    return { 
      props: {
        initialProject: mockProject,
        ...(await serverSideTranslations(locale, ['common'])),
      },
      revalidate: 60
    };
  }
};

export default ProjectDetailPage;