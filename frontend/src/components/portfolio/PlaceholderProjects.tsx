import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import OptimizedImage from '../common/OptimizedImage/index';
import { 
  getPlaceholderProjectsWithLimit,
  getCoverImageUrl 
} from '@/data/placeholders/projectPlaceholders';

interface PlaceholderProjectsProps {
  count?: number;
}

/**
 * Component that renders placeholder project cards when no real projects are available
 */
const PlaceholderProjects: React.FC<PlaceholderProjectsProps> = ({ count = 3 }) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isRtl = router.locale === 'ar';

  // Get translated project title
  const getProjectTitle = (slug: string) => {
    return t(`projects.${slug}`, { defaultValue: slug.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') });
  };
  
  // Get translated project description
  const getProjectDescription = (slug: string) => {
    return t(`descriptions.${slug}`, { defaultValue: "Project description unavailable" });
  };
  
  // Get translated category name
  const getCategoryName = (slug: string) => {
    return t(`categories.${slug}`, { defaultValue: slug });
  };

  // Use only the requested number of placeholders, from the central store
  const projectsToShow = getPlaceholderProjectsWithLimit(count);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {projectsToShow.map((project) => (
        <div 
          key={project.id}
          className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg"
        >
          <Link href={`/portfolio/${project.slug}`}>
            <div className="relative h-48 w-full bg-gray-200">
              <OptimizedImage
                src={getCoverImageUrl(project.images)}
                alt={getProjectTitle(project.slug)}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          </Link>
          
          <div className="p-6">
            <div className={`${isRtl ? 'text-right' : ''}`}>
              <Link 
                href={`/portfolio/${project.slug}`}
                className="text-xl font-bold text-gray-900 hover:text-brand-blue transition-colors"
              >
                {getProjectTitle(project.slug)}
              </Link>
              <p className="text-sm text-gray-500 mt-1">{getCategoryName(project.category.slug)}</p>
            </div>
            
            <p className={`text-gray-600 mt-2 line-clamp-2 ${isRtl ? 'text-right' : ''}`}>
              {getProjectDescription(project.slug)}
            </p>
            
            <div className={`mt-4 ${isRtl ? 'text-right' : ''}`}>
              <Link 
                href={`/portfolio/${project.slug}`}
                className="text-brand-blue-light font-medium hover:underline inline-flex items-center"
              >
                {isRtl ? (
                  <>
                    {t('portfolio.sampleProjectLabel')} <span className="ms-1">←</span>
                  </>
                ) : (
                  <>
                    {t('portfolio.sampleProjectLabel')} <span className="ms-1">→</span>
                  </>
                )}
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PlaceholderProjects; 