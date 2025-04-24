'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Project } from '@/lib/hooks';
import Modal from '@/components/common/Modal/index';
import Button from '@/components/common/Button/index';
import { getCategoryDisplayName } from '@/lib/utils/categoryDisplay';

interface ProjectCardContentProps {
  project: Project;
  onSaveToFavorites?: (projectId: string) => void;
  isAuthenticated?: boolean;
}

const ProjectCardContent: React.FC<ProjectCardContentProps> = ({
  project,
  onSaveToFavorites,
  isAuthenticated = false
}) => {
  const params = useParams();
  const locale = params?.locale ? String(params.locale) : 'en';
  const isRtl = locale === 'ar';
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  const tPortfolio = useTranslations('portfolio');
  const tCommon = useTranslations('common');
  const tAuth = useTranslations('auth');
  const tRoot = useTranslations();
  
  const getProjectTitle = () => {
    return project.title;
  };
  
  const getProjectDescription = () => {
    return project.description;
  };
  
  const getCategoryName = () => {
    if (!project.category) {
      return tRoot('common.noCategory', undefined, { default: 'Uncategorized' });
    }
    
    return project.category.name;
  };
  
  // Check if category name matches project title to avoid redundancy
  const shouldDisplayCategory = () => {
    if (!project.category) return false;
    const projectTitle = project.title.toLowerCase();
    const categoryName = project.category.name.toLowerCase();
    return projectTitle !== categoryName;
  };
  
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
  
  return (
    <>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div className={isRtl ? 'text-right' : ''}>
            <Link 
              href={`/${locale}/portfolio/${project.slug}`}
              className="text-xl font-semibold text-gray-900 hover:text-brand-blue"
            >
              {getProjectTitle()}
            </Link>
            {shouldDisplayCategory() && <p className="text-sm text-gray-500 mt-1">{getCategoryName()}</p>}
          </div>
          
          <button
            onClick={handleSaveClick}
            className="p-2 text-gray-400 hover:text-brand-accent transition-colors"
            aria-label={tPortfolio('saveToFavorites')}
            title={tPortfolio('saveToFavorites')}
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
        
        <p className={`text-gray-600 mt-2 h-[3rem] line-clamp-2 overflow-hidden ${isRtl ? 'text-right' : ''}`}>
          {getProjectDescription()}
        </p>
        
        <div className={`flex flex-wrap gap-2 mt-4 ${isRtl ? 'justify-end' : ''}`}>
          {project.tags && project.tags.map(tag => (
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
            href={`/${locale}/portfolio/${project.slug}`}
            className="text-brand-blue-light font-medium hover:underline inline-flex items-center"
          >
            {isRtl ? (
              <>
                {tPortfolio('viewDetails')} <span className="ms-1">←</span>
              </>
            ) : (
              <>
                {tPortfolio('viewDetails')} <span className="ms-1">→</span>
              </>
            )}
          </Link>
        </div>
      </div>
      
      <Modal
        isOpen={showAuthModal}
        onClose={closeModal}
        title={tPortfolio('saveToFavorites')}
        rtl={isRtl}
      >
        <div className={isRtl ? 'text-right' : ''}>
          <p className="mb-6">{tPortfolio('signupPrompt', { default: 'Please sign up to save projects to your favorites'})}</p>
          <div className={`flex ${isRtl ? 'justify-start' : 'justify-end'}`}>
            <Button
              onClick={closeModal}
              variant="outline"
              className={isRtl ? 'ms-2' : 'me-2'}
            >
              {tCommon('cancel')}
            </Button>
            <Button
              onClick={() => window.location.href = `/${locale}/signup`}
              variant="primary"
            >
              {tAuth('signup')}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProjectCardContent; 