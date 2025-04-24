'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { getCategoryDisplayName } from '@/lib/utils/categoryDisplay';

interface ProjectTag {
  id: string;
  name: string;
  slug: string;
}

interface ProjectCategory {
  name: string;
  slug: string;
}

interface ProjectHeaderClientProps {
  title: string;
  slug: string;
  description: string;
  category: ProjectCategory | null;
  tags: ProjectTag[];
  locale?: string;
}

/**
 * Client component for project header with interactive elements
 */
const ProjectHeaderClient: React.FC<ProjectHeaderClientProps> = ({
  title,
  slug,
  description,
  category,
  tags = [],
  locale: propLocale
}) => {
  const params = useParams();
  const locale = propLocale || (params?.locale ? String(params.locale) : 'en');
  const t = useTranslations();

  const shouldDisplayCategory = category !== null && category !== undefined;

  return (
    <header className="mb-12 border-b pb-8">
      <nav className="text-sm text-gray-500 mb-4">
        <Link href={`/${locale}/`} className="hover:underline">
          {t('header.home', { default: 'Home' })}
        </Link>
        <span className="mx-2">/</span>
        <Link href={`/${locale}/portfolio`} className="hover:underline">{t('portfolio.title')}</Link>
      </nav>
      
      <h1 className="text-4xl md:text-5xl font-bold font-heading mb-4">{title}</h1>
      <p className="text-xl text-gray-600 mb-6">{description}</p>
      
      {(shouldDisplayCategory || (tags && tags.length > 0)) && (
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {shouldDisplayCategory ? (
            <Link href={`/${locale}/portfolio?category=${category.slug}`} className="bg-brand-blue-light/10 text-brand-blue-dark px-3 py-1 rounded-full text-xs font-medium hover:bg-brand-blue-light/20">
              {category.name}
            </Link>
          ) : null}
          
          {tags && tags.map((tag) => (
            <Link key={tag.id} href={`/${locale}/portfolio?tag=${tag.slug}`} className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-medium hover:bg-gray-200">
              {tag.name}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
};

export default ProjectHeaderClient; 