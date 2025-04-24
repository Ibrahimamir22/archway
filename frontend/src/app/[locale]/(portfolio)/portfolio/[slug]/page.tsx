import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';

import ProjectHeader from '@/components/portfolio/detail/ProjectHeader';
import ProjectDetails from '@/components/portfolio/detail/ProjectDetails';
import ProjectGallery from '@/components/portfolio/detail/ProjectGallery';
import ProjectDetailClientLogic from './ProjectDetailClientLogic'; // Client component - path relative to new location

import { getPlaceholderSlugs } from '@/lib/fixtures/portfolio/projects';

interface ProjectType {
  id: string;
  title: string;
  slug: string;
  description: string;
  category?: { name: string; slug: string } | null;
  client?: string;
  location?: string;
  area?: number;
  completedDate?: string;
  tags: Array<{ id: string; name: string; slug: string }>;
  images: Array<{ id: string; src: string; alt: string; isCover: boolean }>;
}

const getApiBaseUrl = () => {
    const url = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000/api/v1';
    return url.endsWith('/') ? url.slice(0, -1) : url;
}

async function getAllProjectSlugs(): Promise<string[]> {
  const API_BASE_URL = getApiBaseUrl();
  const placeholderSlugs = getPlaceholderSlugs();
  const fetchUrl = `${API_BASE_URL}/projects/?fields=slug&limit=200`;

  try {
    const res = await fetch(fetchUrl, { next: { revalidate: 3600 } });
    if (!res.ok) throw new Error(`Failed slugs fetch: ${res.status}`);
    const data = await res.json();
    const projects = data.results || [];
    const apiSlugs = projects.map((project: { slug: string }) => project.slug);
    return Array.from(new Set([...apiSlugs, ...placeholderSlugs]));
  } catch (error) {
    console.error(`Error in getAllProjectSlugs (${fetchUrl}):`, error);
    return placeholderSlugs;
  }
}

async function getProjectBySlug(slug: string, locale: string = 'en'): Promise<ProjectType | null> {
  const API_BASE_URL = getApiBaseUrl();
  const fetchUrl = `${API_BASE_URL}/projects/${slug}/?lang=${locale}`;

  try {
    const res = await fetch(fetchUrl, { next: { revalidate: 600 } });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed project fetch ${slug}: ${res.status}`);
    const project: ProjectType = await res.json();
    return project;
  } catch (error) {
    console.error(`Error in getProjectBySlug (${fetchUrl}):`, error);
    return null; 
  }
}

// Define page props including locale from the dynamic route
interface PageProps {
  params: { 
    slug: string;
    locale: string; 
  };
}

// Generate static paths including locale
export async function generateStaticParams() {
  const slugs = await getAllProjectSlugs();
  // Assuming locales are en and ar
  const locales = ['en', 'ar']; 
  
  return locales.flatMap((locale) => 
    slugs.map((slug) => ({ locale, slug }))
  );
}

// Generate dynamic metadata using locale
export async function generateMetadata(
  { params }: PageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const project: ProjectType | null = await getProjectBySlug(params.slug, params.locale);

  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} | Archway Interior Design`, 
    description: project.description,
  };
}

// The Page Server Component receives locale via params
export default async function PortfolioProjectDetailPage({ params }: PageProps) {
  const project: ProjectType | null = await getProjectBySlug(params.slug, params.locale);

  if (!project) {
    notFound(); 
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Pass locale down to client component */}
      <ProjectDetailClientLogic slug={params.slug} initialProjectData={project} locale={params.locale} />

      <ProjectHeader 
        title={project.title}
        slug={project.slug}
        description={project.description}
        category={project.category || null}
        tags={project.tags || []}
        locale={params.locale}
      />
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
        locale={params.locale}
      />
      <ProjectGallery images={project.images} />
    </div>
  );
} 