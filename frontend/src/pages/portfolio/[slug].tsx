import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Button from '@/components/common/Button';
import LoadingState from '@/components/common/LoadingState';
import { useProjectDetail, fixImageUrl } from '@/hooks/useProjects';
import axios from 'axios';

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

// Create full HTML of preload images to add to head
export const createImagePreloadTags = (images: {id: string, src: string}[]) => {
  return images
    .map(image => `<link rel="preload" href="${fixImageUrl(image.src)}" as="image" />`)
    .join('');
};

const ProjectDetailPage: NextPage<{ initialProject?: ProjectDetail }> = ({ initialProject }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isRtl = router.locale === 'ar';
  const { slug } = router.query;
  const [imageError, setImageError] = useState<Record<string, boolean>>({});
  
  // Use the useProjectDetail hook to fetch the project
  const { project: fetchedProject, loading } = useProjectDetail(
    typeof slug === 'string' ? slug : ''
  );
  
  // Use fetched project or fall back to initial data
  const project = fetchedProject || initialProject;
  
  // Simple error handler for images
  const handleImageError = (imageId: string) => {
    setImageError(prev => ({
      ...prev,
      [imageId]: true
    }));
  };

  // Get cover image
  const coverImage = project?.images?.find((img: {id: string, src: string, alt: string, isCover: boolean}) => img.isCover === true);
  
  // Simple and reliable image source getter
  const getImageSrc = (image: {id: string, src: string}) => {
    if (imageError[image.id]) {
      console.log(`Using fallback for image ${image.id}`);
      // Use a numeric fallback
      const imageIndex = (parseInt(image.id) || 1) % 5 + 1;
      return `/images/project-${imageIndex}.jpg`;
    }
    
    // Debug to see what URL is actually being used
    const fixedUrl = fixImageUrl(image.src);
    console.log(`Image ${image.id} using URL:`, fixedUrl);
    return fixedUrl;
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
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-500">{t('projectNotFound')}</h1>
        <p className="mt-4">{t('projectNotFoundDesc')}</p>
        <Link href="/portfolio">
          <Button variant="primary" className="mt-8">
            {t('returnToPortfolio')}
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <>
      <Head>
        <title>{project.title} | Archway Interior Design</title>
        <meta name="description" content={project.description} />
      </Head>
      
      <div className="container mx-auto px-4 py-12">
        {/* Project Header */}
        <div className={`mb-12 ${isRtl ? 'text-right' : ''}`}>
          <Link href="/portfolio" className="text-brand-blue hover:underline mb-4 inline-block">
            ← {t('backToPortfolio')}
          </Link>
          <h1 className="text-4xl font-heading font-bold mb-4">{project.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-sm">
              {project.category.name}
            </span>
            {project.tags.map((tag: {id: string, name: string, slug: string}) => (
              <span key={tag.id} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
                {tag.name}
              </span>
            ))}
          </div>
          
          <p className="text-lg text-gray-700">{project.description}</p>
        </div>
        
        {/* Project Details */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className={`col-span-2 ${isRtl ? 'text-right' : ''}`}>
            {/* Main Project Image */}
            <div className="relative h-[500px] w-full overflow-hidden rounded-lg mb-6 bg-gray-100">
              {coverImage ? (
                <img
                  src={getImageSrc(coverImage)}
                  alt={coverImage.alt || project.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={() => handleImageError(coverImage.id)}
                />
              ) : project.images && project.images.length > 0 ? (
                <img
                  src={getImageSrc(project.images[0])}
                  alt={project.images[0].alt || project.title}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={() => handleImageError(project.images[0].id)}
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
                    <span className="font-medium">{project.client}</span>
                  </div>
                )}
                
                {project.location && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('location')}:</span>
                    <span className="font-medium">{project.location}</span>
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
        {project.images && project.images.length > 1 ? (
          <div className={`${isRtl ? 'text-right' : ''}`}>
            <h2 className="text-2xl font-heading font-semibold mb-6">{t('projectGallery')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.images.slice(1).map((image: {id: string, src: string, alt: string, isCover: boolean}, index: number) => (
                <div key={image.id} className="relative h-64 rounded-lg overflow-hidden shadow-md bg-gray-100">
                  <img 
                    src={getImageSrc(image)}
                    alt={image.alt || `Project image ${index + 1}`}
                    className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={() => handleImageError(image.id)}
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
  
  try {
    // Fetch projects for static paths
    const projectsResponse = await axios.get(`${API_BASE_URL}/projects/?limit=100`);
    const projects = projectsResponse.data.results || [];
    
    // Extract slugs from projects
    const slugs = projects.map((project: any) => project.slug);
    
    // Create paths for all locales and slugs
    const paths = locales.flatMap(locale => 
      slugs.map((slug: string) => ({
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
    return {
      paths: [],
      fallback: true,
    };
  }
};

export const getStaticProps: GetStaticProps = async ({ params, locale = 'en' }) => {
  const API_BASE_URL = getApiBaseUrl();
  const slug = params?.slug as string;
  
  try {
    // Fetch project data from API
    const projectParams = new URLSearchParams();
    projectParams.append('lang', locale);
    
    const response = await axios.get(`${API_BASE_URL}/projects/${slug}/?${projectParams.toString()}`);
    const projectData = response.data;
    
    // Process images properly at build time
    const images = projectData.images || [];
    const safeImages = images.map((img: any, index: number) => {
      const imgSrc = img.image_url || img.image || `/images/project-${(index % 5) + 1}.jpg`;
      return {
        id: img.id || `image-${index + 1}`,
        src: fixImageUrl(imgSrc),
        alt: img.alt_text || 'Project image',
        isCover: img.is_cover
      };
    });
    
    const project: ProjectDetail = {
      id: projectData.id,
      title: projectData.title,
      slug: projectData.slug,
      description: projectData.description,
      category: {
        name: projectData.category.name,
        slug: projectData.category.slug
      },
      client: projectData.client,
      location: projectData.location,
      area: projectData.area,
      completedDate: projectData.completed_date,
      tags: projectData.tags,
      images: safeImages
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