'use client';

import React from 'react';
import { useTranslation } from 'next-i18next';
import SocialIcon from './SocialIcon';
import NewsletterForm from './NewsletterForm';
import { CompanyInfoProps } from '@types/components/footer';

const CompanyInfo: React.FC<CompanyInfoProps> = ({ settings, socialMedia, isRtl }) => {
  const { t } = useTranslation('common');
  
  return (
    <div className={`col-span-1 md:col-span-1 ${isRtl ? 'text-right' : ''}`}>
      <h3 className="text-xl font-bold mb-4">{settings?.company_name || 'Archway Design'}</h3>
      {settings?.description && (
        <p className="text-gray-300 mb-4 leading-relaxed">{settings.description}</p>
      )}
      
      {socialMedia && socialMedia.length > 0 && (
        <div className={`mt-6 ${isRtl ? 'text-right' : ''}`}>
          <h4 className="text-lg font-medium mb-4">{t('footer.followUs')}</h4>
          <div className={`flex ${isRtl ? 'justify-end space-x-reverse' : ''} gap-5`}>
            {socialMedia.map((social) => (
              <React.Fragment key={social.id}>
                <SocialIcon 
                  platform={social.platform} 
                  url={social.url} 
                />
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
      
      {settings?.show_newsletter && (
        <div className="mt-8">
          <h4 className="text-lg font-medium mb-3">
            {settings.newsletter_text || t('footer.newsletter.title')}
          </h4>
          <NewsletterForm />
        </div>
      )}
    </div>
  );
};

export default CompanyInfo; 