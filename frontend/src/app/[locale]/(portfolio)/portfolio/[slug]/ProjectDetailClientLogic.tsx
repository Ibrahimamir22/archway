'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useServiceDetail } from '@/lib/hooks/services/useServiceDetail'; // Ensure path is correct

interface ProjectDetailClientLogicProps {
  slug: string;
  initialProjectData: any; 
  locale: string;
}

const ProjectDetailClientLogic: React.FC<ProjectDetailClientLogicProps> = ({ 
  slug,
  initialProjectData,
  locale
}) => {
  const router = useRouter();

  const { 
    data: serviceWithSameSlug, 
    isLoading: serviceLoading, 
    error: serviceError 
  } = useServiceDetail(slug, { 
    enabled: !initialProjectData, 
    lang: locale 
  });

  useEffect(() => {
    if (serviceWithSameSlug && !initialProjectData) {
      console.log(`Redirecting: Slug '${slug}' is a service.`);
      router.replace(`/${locale}/services/${slug}`); // Include locale in redirect
    }
  }, [serviceWithSameSlug, initialProjectData, slug, router, locale]);

  if (!initialProjectData && serviceLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  return null; 
};

export default ProjectDetailClientLogic; 