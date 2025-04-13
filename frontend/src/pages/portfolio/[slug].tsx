import React from 'react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import Link from 'next/link';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useRouter } from 'next/router';
import Button from '@/components/common/Button';
import LoadingState from '@/components/common/LoadingState';
import { useProjectDetail } from '@/hooks';
import axios from 'axios';
import { 
  getPlaceholderProject, 
  getPlaceholderSlugs, 
  PlaceholderProject 
} from '@/data/placeholders/projectPlaceholders';
import ProjectHeader from '@/components/portfolio/ProjectHeader';
import ProjectDetails from '@/components/portfolio/ProjectDetails';
import ProjectGallery from '@/components/portfolio/ProjectGallery';
import { getApiBaseUrl, normalizeImageUrl } from '@/hooks';

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

const ProjectDetailPage: NextPage<{ initialProject?: ProjectDetail }> = ({ initialProject }) => {
  const { t, i18n } = useTranslation('common');
  const router = useRouter();
  const { slug } = router.query;

  // Use the useProjectDetail hook to fetch the project
  const { project: fetchedProject, loading } = useProjectDetail(
    typeof slug === 'string' ? slug : ''
  );
  
  // Use fetched project or fall back to initial data
  const project = fetchedProject || initialProject;
  
  // Handle translation changes when locale changes
  React.useEffect(() => {
    if (router.locale && router.locale !== i18n.language) {
      i18n.changeLanguage(router.locale);
    }
  }, [router.locale, i18n]);
  
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
            <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('projectNotFound')}</h1>
            <p className="text-gray-600 mb-8">{t('projectNotFoundDesc')}</p>
            <Link href="/portfolio">
              <Button variant="primary">
                {t('backToPortfolio')}
              </Button>
            </Link>
          </div>
        </div>
      </>
    );
  }
  
  // Get cover image for preloading
  const coverImage = project.images.find(img => img.isCover === true);
  
  return (
    <>
      <Head>
        <title>{project.title} | Archway Interior Design</title>
        <meta name="description" content={project.description} />
        
        {/* Preload critical project images */}
        {coverImage && (
          <link 
            key={`preload-cover-${coverImage.id}`}
            rel="preload" 
            href={coverImage.src} 
            as="image"
            importance="high"
          />
        )}
      </Head>
      
      <div className="container mx-auto px-4 py-12">
        {/* Project Header */}
        <ProjectHeader 
          title={project.title}
          slug={project.slug}
          description={project.description}
          category={project.category}
          tags={project.tags}
        />
        
        {/* Project Details */}
        <ProjectDetails
          id={project.id}
          title={project.title}
          slug={project.slug}
          description={project.description}
          client={project.client}
          location={project.location}
          area={project.area}
          completedDate={project.completedDate}
          images={project.images}
        />
        
        {/* Project Gallery */}
        <ProjectGallery images={project.images} />
      </div>
    </>
  );
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
      // Increased revalidation time since placeholder data rarely changes
      revalidate: 3600 // 1 hour
    };
  }
  
  // If not a placeholder, proceed with normal API call
  try {
    // Fetch project data from API
    const projectParams = new URLSearchParams();
    projectParams.append('lang', locale);
    
    const response = await axios.get(`${API_BASE_URL}/projects/${slug}/?${projectParams.toString()}`);
    const projectData = response.data;
    
    // Process images properly at build time with normalized URLs
    const images = projectData.images || [];
    let safeImages = images.map((img: any, index: number) => {
      // Get image source with explicit fallback for missing sources
      let imgSrc = img.image_url || img.image;
      
      // Use fallback if image source is missing
      if (!imgSrc) {
        imgSrc = `/images/project-${(index % 5) + 1}.jpg`;
      }
      
      return {
        id: img.id || `image-${index + 1}`,
        src: normalizeImageUrl(imgSrc),
        alt: img.alt_text || `${projectData.title} image ${index + 1}`,
        isCover: img.is_cover
      };
    });
    
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
      revalidate: 300 // Revalidate the page every 5 minutes
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