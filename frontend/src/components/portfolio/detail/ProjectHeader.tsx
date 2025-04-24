import { getTranslations } from 'next-intl/server';
import ProjectHeaderClient from './ProjectHeader.client';

interface ProjectTag {
  id: string;
  name: string;
  slug: string;
}

interface ProjectCategory {
  name: string;
  slug: string;
}

interface ProjectHeaderProps {
  title: string;
  slug: string;
  description: string;
  category: ProjectCategory | null;
  tags: ProjectTag[];
  locale?: string;
}

/**
 * Server component for project header
 * This delegates to the client component for interactive elements
 */
export default async function ProjectHeader({
  title,
  slug,
  description,
  category,
  tags = [],
  locale = 'en'
}: ProjectHeaderProps) {
  // Get translations on the server
  const t = await getTranslations();

  // The server component can pre-render all of the static content
  // We pass the data to the client component which handles the interactive elements
  return (
    <ProjectHeaderClient
      title={title}
      slug={slug}
      description={description}
      category={category}
      tags={tags}
      locale={locale}
    />
  );
} 