import React from 'react';
import { ScrollReveal } from '@/components/ui';
import { TranslationFunction } from '@/types/i18n';

interface MissionVisionProps {
  t: TranslationFunction;
  isRtl: boolean;
}

export const MissionVision: React.FC<MissionVisionProps> = ({ t, isRtl }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
      <ScrollReveal animation="slide-up" delay={0.1}>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="mb-4">
            <div className="w-12 h-12 bg-brand-blue/10 dark:bg-brand-blue/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-brand-blue dark:text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-heading font-semibold mb-4 text-brand-blue dark:text-white">{t('mission')}</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('missionText')}</p>
        </div>
      </ScrollReveal>
      
      <ScrollReveal animation="slide-up" delay={0.2}>
        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
          <div className="mb-4">
            <div className="w-12 h-12 bg-brand-accent/10 dark:bg-brand-accent/20 rounded-full flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-brand-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-heading font-semibold mb-4 text-brand-blue dark:text-white">{t('vision')}</h2>
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t('visionText')}</p>
        </div>
      </ScrollReveal>
    </div>
  );
}; 