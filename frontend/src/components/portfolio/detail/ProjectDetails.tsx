import { getTranslations } from 'next-intl/server';
import ProjectDetailsClient from './ProjectDetails.client';

interface ProjectImage {
  id: string;
  src: string;
  alt: string;
  isCover?: boolean;
}

interface ProjectDetailsProps {
  id: string;
  title: string;
  slug: string;
  description: string;
  client?: string;
  location?: string;
  area?: number;
  completedDate?: string;
  images: ProjectImage[];
  locale?: string;
}

/**
 * Server component for project details
 * Delegates rendering to client component for interactivity
 */
export default async function ProjectDetails({
  id,
  title,
  slug,
  description,
  client,
  location,
  area,
  completedDate,
  images,
  locale = 'en'
}: ProjectDetailsProps) {
  // Server-side translations
  const t = await getTranslations('portfolio');
  
  // We delegate to the client component which handles interactivity
  return (
    <ProjectDetailsClient
      id={id}
      title={title}
      slug={slug}
      description={description}
      client={client}
      location={location}
      area={area}
      completedDate={completedDate}
      images={images}
      locale={locale}
    />
  );
} 