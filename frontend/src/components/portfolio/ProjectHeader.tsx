import React from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';

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
  category: ProjectCategory;
  tags: ProjectTag[];
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({
  title,
  slug,
  description,
  category,
  tags
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isRtl = router.locale === 'ar';
  
  // Get translated project title
  const projectTitle = t(`projects.${slug}`, { defaultValue: title });
  
  // Get translated project description
  const projectDescription = t(`descriptions.${slug}`, { defaultValue: description });
  
  // Function to get translated category name
  const getCategoryName = (category: ProjectCategory) => {
    return t(`categories.${category.slug}`, { defaultValue: category.name });
  };
  
  // Function to get translated tag name
  const getTagName = (tag: ProjectTag) => {
    return t(`tags.${tag.slug}`, { defaultValue: tag.name });
  };

  return (
    <div className={`mb-12 ${isRtl ? 'text-right' : ''}`}>
      <Link href="/portfolio" className="text-brand-blue hover:underline mb-4 inline-block">
        ← {t('backToPortfolio')}
      </Link>
      <h1 className="text-4xl font-heading font-bold mb-4">{projectTitle}</h1>
      
      <div className="flex flex-wrap gap-2 mb-6">
        <span className="bg-brand-blue/10 text-brand-blue px-3 py-1 rounded-full text-sm">
          {getCategoryName(category)}
        </span>
        {tags.map((tag) => (
          <span key={tag.id} className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm">
            {getTagName(tag)}
          </span>
        ))}
      </div>
      
      <p className="text-lg text-gray-700">{projectDescription}</p>
    </div>
  );
};

export default ProjectHeader; 