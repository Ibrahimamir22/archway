import React from 'react';
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

const ProjectDetailPage: NextPage<{ project?: ProjectDetail }> = ({ project }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isRtl = router.locale === 'ar';
  
  // If fallback is true and the page is not yet generated
  if (router.isFallback) {
    return (
      <div className="container mx-auto px-4 py-12">
        <LoadingState type="text" />
      </div>
    );
  }
  
  // If project is missing (for any reason)
  if (!project) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold text-red-500">Project not found</h1>
        <p className="mt-4">The project you're looking for doesn't exist or has been removed.</p>
        <Link href="/portfolio">
          <Button variant="primary" className="mt-8">
            Return to Portfolio
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
            ← {t('common.backToPortfolio')}
          </Link>
          <h1 className="text-4xl font-heading font-bold mb-4">{project.title}</h1>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-sm">
              {project.category.name}
            </span>
            {project.tags.map(tag => (
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
            <div className="relative h-[500px] w-full overflow-hidden rounded-lg mb-6">
              <Image
                src={project.images[0]?.src || '/images/placeholder.jpg'}
                alt={project.images[0]?.alt || project.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
          
          <div className={`${isRtl ? 'text-right' : ''}`}>
            {/* Project Info */}
            <div className="bg-brand-light p-6 rounded-lg shadow-sm mb-6">
              <h3 className="text-xl font-semibold mb-4">{t('common.projectDetails')}</h3>
              
              <div className="space-y-3">
                {project.client && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('common.client')}:</span>
                    <span className="font-medium">{project.client}</span>
                  </div>
                )}
                
                {project.location && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('common.location')}:</span>
                    <span className="font-medium">{project.location}</span>
                  </div>
                )}
                
                {project.area && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('common.area')}:</span>
                    <span className="font-medium">{project.area} m²</span>
                  </div>
                )}
                
                {project.completedDate && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('common.completed')}:</span>
                    <span className="font-medium">{project.completedDate}</span>
                  </div>
                )}
              </div>
            </div>
            
            {/* Call to Action */}
            <div className="bg-brand-blue p-6 rounded-lg shadow-sm text-white">
              <h3 className="text-xl font-semibold mb-4">{t('common.interestedInThisStyle')}</h3>
              <p className="mb-6">{t('common.contactUsForSimilarProject')}</p>
              <Link href="/contact">
                <Button variant="secondary" fullWidth>
                  {t('common.getInTouch')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Project Gallery */}
        {project.images.length > 1 && (
          <div className={`${isRtl ? 'text-right' : ''}`}>
            <h2 className="text-2xl font-heading font-semibold mb-6">{t('common.projectGallery')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {project.images.slice(1).map((image) => (
                <div key={image.id} className="relative h-64 rounded-lg overflow-hidden shadow-md">
                  <Image 
                    src={image.src} 
                    alt={image.alt} 
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async ({ locales = ['en'] }) => {
  // This would normally fetch all project slugs from an API
  // For now, we'll return an empty array to generate all pages at request time
  return {
    paths: [],
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params, locale = 'en' }) => {
  try {
    // This would normally fetch the project data from an API
    // For now, we'll use a mock project based on the slug
    const slug = params?.slug as string;
    
    // Mock project data (in a real app, this would come from an API)
    const mockProject: ProjectDetail = {
      id: '1',
      title: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
      slug,
      description: 'This is a detailed description of the project. It would include information about the design concept, materials used, and the overall approach to the space.',
      category: {
        name: 'Residential',
        slug: 'residential'
      },
      client: 'John & Sarah Smith',
      location: 'Cairo, Egypt',
      area: 240,
      completedDate: 'June 2023',
      tags: [
        { id: '1', name: 'Modern', slug: 'modern' },
        { id: '2', name: 'Minimalist', slug: 'minimalist' }
      ],
      images: [
        { 
          id: '1', 
          src: 'https://images.unsplash.com/photo-1600607687644-c7ddd0d73f2c?q=80&w=2070&auto=format&fit=crop', 
          alt: 'Living Room', 
          isCover: true 
        },
        { 
          id: '2', 
          src: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=1974&auto=format&fit=crop', 
          alt: 'Kitchen', 
          isCover: false 
        },
        { 
          id: '3', 
          src: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1932&auto=format&fit=crop', 
          alt: 'Bedroom', 
          isCover: false 
        },
        { 
          id: '4', 
          src: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop', 
          alt: 'Bathroom', 
          isCover: false 
        }
      ]
    };
    
    return {
      props: {
        project: mockProject,
        ...(await serverSideTranslations(locale, ['common'])),
      },
      revalidate: 60 // Revalidate the page every 60 seconds
    };
  } catch (error) {
    console.error('Error fetching project:', error);
    return { 
      props: {
        ...(await serverSideTranslations(locale, ['common'])),
      },
      revalidate: 60
    };
  }
};

export default ProjectDetailPage; 