import React from 'react';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Button from '@/components/common/Button/index';
import OptimizedImage from '@/components/common/OptimizedImage/index';
import { useProjectImages } from '@/hooks';
import DirectProjectImage from './DirectProjectImage';

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
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({
  title,
  slug,
  client,
  location,
  area,
  completedDate,
  images
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isRtl = router.locale === 'ar';
  
  const {
    handleImageError,
    handleImageLoad,
    getCoverImage,
    getFirstValidImage,
    getImageSrc
  } = useProjectImages();

  // Function to get translated client name
  const getClientName = (client?: string) => {
    return client ? t(`clients.${client}`, { defaultValue: client }) : '';
  };
  
  // Function to get translated location
  const getLocationName = (location?: string) => {
    return location ? t(`locations.${location}`, { defaultValue: location }) : '';
  };

  // Get cover or first valid image
  const coverImage = getCoverImage(images);
  const firstValidImage = getFirstValidImage(images);
  const displayImage = coverImage || firstValidImage;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
      <div className={`col-span-2 ${isRtl ? 'text-right' : ''}`}>
        {/* Main Project Image */}
        <div className="relative h-[500px] w-full overflow-hidden rounded-lg mb-6 bg-gray-100" suppressHydrationWarning>
          {displayImage ? (
            <div className="w-full h-full">
              <DirectProjectImage
                src={getImageSrc(displayImage)}
                alt={displayImage.alt || title}
                className="w-full h-full object-cover"
              />
            </div>
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
            {client && (
              <div className="flex justify-between">
                <span className="text-gray-600">{t('client')}:</span>
                <span className="font-medium">{getClientName(client)}</span>
              </div>
            )}
            
            {location && (
              <div className="flex justify-between">
                <span className="text-gray-600">{t('location')}:</span>
                <span className="font-medium">{getLocationName(location)}</span>
              </div>
            )}
            
            {area && (
              <div className="flex justify-between">
                <span className="text-gray-600">{t('area')}:</span>
                <span className="font-medium">{area} {t('areaUnit')}</span>
              </div>
            )}
            
            {completedDate && (
              <div className="flex justify-between">
                <span className="text-gray-600">{t('completed')}:</span>
                <span className="font-medium">{completedDate}</span>
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
  );
};

export default ProjectDetails; 