import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Project } from '@/hooks/useProjects';
import Modal from '@/components/common/Modal';
import Button from '@/components/common/Button';

interface ProjectCardProps {
  project: Project;
  onSaveToFavorites?: (projectId: string) => void;
  isAuthenticated?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onSaveToFavorites,
  isAuthenticated = false
}) => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isRtl = router.locale === 'ar';
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const handleSaveClick = () => {
    if (isAuthenticated && onSaveToFavorites) {
      onSaveToFavorites(project.id);
    } else {
      setShowAuthModal(true);
    }
  };
  
  const closeModal = () => {
    setShowAuthModal(false);
  };
  
  const navigateToSignup = () => {
    router.push('/signup');
  };
  
  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg">
        <Link href={`/portfolio/${project.slug}`}>
          <div className="relative h-48 w-full">
            <Image
              src={project.cover_image || '/images/placeholder.jpg'}
              alt={project.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        </Link>
        
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className={isRtl ? 'text-right' : ''}>
              <Link 
                href={`/portfolio/${project.slug}`}
                className="text-xl font-semibold text-gray-900 hover:text-brand-blue"
              >
                {project.title}
              </Link>
              <p className="text-sm text-gray-500 mt-1">{project.category.name}</p>
            </div>
            
            <button
              onClick={handleSaveClick}
              className="p-2 text-gray-400 hover:text-brand-accent transition-colors"
              aria-label={t('portfolio.saveToFavorites')}
              title={t('portfolio.saveToFavorites')}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </button>
          </div>
          
          <p className={`text-gray-600 mt-2 line-clamp-2 ${isRtl ? 'text-right' : ''}`}>
            {project.description}
          </p>
          
          <div className={`flex flex-wrap gap-2 mt-4 ${isRtl ? 'justify-end' : ''}`}>
            {project.tags.map(tag => (
              <span 
                key={tag.id} 
                className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
              >
                {tag.name}
              </span>
            ))}
          </div>
          
          <div className={`mt-4 ${isRtl ? 'text-right' : ''}`}>
            <Link 
              href={`/portfolio/${project.slug}`} 
              className="text-brand-blue-light font-medium hover:underline inline-flex items-center"
            >
              {isRtl ? (
                <>
                  {t('portfolio.viewDetails')} <span className="ms-1">←</span>
                </>
              ) : (
                <>
                  {t('portfolio.viewDetails')} <span className="ms-1">→</span>
                </>
              )}
            </Link>
          </div>
        </div>
      </div>
      
      {/* Auth modal */}
      <Modal
        isOpen={showAuthModal}
        onClose={closeModal}
        title={t('portfolio.saveToFavorites')}
        rtl={isRtl}
      >
        <div className={isRtl ? 'text-right' : ''}>
          <p className="mb-6">{t('portfolio.signupPrompt')}</p>
          <div className={`flex ${isRtl ? 'justify-start' : 'justify-end'}`}>
            <Button
              onClick={closeModal}
              variant="outline"
              className={isRtl ? 'ms-2' : 'me-2'}
            >
              {t('common.cancel')}
            </Button>
            <Button
              onClick={navigateToSignup}
              variant="primary"
            >
              {t('auth.signup')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProjectCard; 