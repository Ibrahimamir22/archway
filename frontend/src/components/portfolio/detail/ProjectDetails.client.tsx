'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';
import Button from '@/components/common/Button/index';
import { FaMapMarkerAlt, FaRulerCombined, FaCalendarAlt, FaUserTie } from 'react-icons/fa';

interface ProjectImage {
  id: string;
  src: string;
  alt: string;
  isCover?: boolean;
}

interface ProjectDetailsClientProps {
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
 * Client component for project details with interactive elements
 */
const ProjectDetailsClient: React.FC<ProjectDetailsClientProps> = ({
  title,
  slug,
  client,
  location,
  area,
  completedDate,
  images,
  locale = 'en'
}) => {
  const t = useTranslations('portfolio');

  const formatArea = (value?: number) => {
    if (!value) return '-';
    const unit = t('areaUnit', { default: 'm²' });
    return `${value} ${unit}`;
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('en-CA');
    } catch (e) {
      return dateString;
    }
  };

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
      <div className="md:col-span-2">
        <h2 className="text-3xl font-bold mb-6">{t('projectDetails')}</h2> 
        <div className="space-y-4 text-gray-700">
          {client && (
            <div className="flex items-center">
              <FaUserTie className="mr-3 text-brand-blue-light" size={20} />
              <span><strong>{t('client')}:</strong> {client}</span>
            </div>
          )}
          {location && (
            <div className="flex items-center">
              <FaMapMarkerAlt className="mr-3 text-brand-blue-light" size={20} />
              <span><strong>{t('location')}:</strong> {location}</span>
            </div>
          )}
          {area && (
            <div className="flex items-center">
              <FaRulerCombined className="mr-3 text-brand-blue-light" size={20} />
              <span><strong>{t('area')}:</strong> {formatArea(area)}</span>
            </div>
          )}
          {completedDate && (
            <div className="flex items-center">
              <FaCalendarAlt className="mr-3 text-brand-blue-light" size={20} />
              <span><strong>{t('completedDate')}:</strong> {formatDate(completedDate)}</span>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 p-8 rounded-lg shadow-sm text-center md:text-left">
        <h3 className="text-2xl font-bold mb-4">{t('interestedPrompt')}</h3>
        <p className="text-gray-600 mb-6">
          {t('contactPrompt')}
        </p>
        <Link href={`/${locale}/contact`}>
          <Button variant="primary" className="w-full md:w-auto">
            {t('getInTouch')}
          </Button>
        </Link>
      </div>
    </section>
  );
};

export default ProjectDetailsClient; 