'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import SocialMediaLink from './SocialMediaLink';
import type { SocialMediaLink as SocialMediaLinkType } from '@/lib/hooks/footer/useFooter';

export interface CompanyInfoProps {
  settings: any;
  socialMedia: SocialMediaLinkType[];
  isRtl: boolean;
  fallbackName?: string;
  fallbackDescription?: string;
}

const CompanyInfo = ({ 
  settings, 
  socialMedia, 
  isRtl, 
  fallbackName, 
  fallbackDescription 
}: CompanyInfoProps): JSX.Element => {
  // Add translations
  const t = useTranslations('footer');
  
  // CRITICAL FIX: Always use direct translations for company info
  const translatedName = t('companyInfo.name');
  const translatedDescription = t('companyInfo.description');
  
  // Extract company info from nested structure or directly
  // Prioritize translations over props or settings
  const companyName = translatedName || fallbackName || settings?.company_info?.company_name || settings?.company_name || '';
  const description = translatedDescription || fallbackDescription || settings?.company_info?.description || settings?.description || '';
  const logoUrl = settings?.logo_url || '/images/Archway.png';  
  const logoAlt = settings?.logo_alt || (companyName ? `${companyName} logo` : 'Company Logo');
  
  // Default social media links if none provided
  const defaultSocialMedia: SocialMediaLinkType[] = [
    { id: 'facebook', platform: 'facebook', url: 'https://facebook.com/archway.egypt/' },
    { id: 'instagram', platform: 'instagram', url: 'https://instagram.com/archway.egypt' },
    { id: 'linkedin', platform: 'linkedin', url: 'https://linkedin.com/company/archway-innovations' }
  ];
  
  // Use provided social media links or default if empty
  const finalSocialMedia = socialMedia && socialMedia.length > 0 ? socialMedia : defaultSocialMedia;
  
  // Debug info 
  console.log('Company Info Data:', { 
    translatedName,
    translatedDescription,
    companyName,
    description,
    isRtl,
    locale: isRtl ? 'ar' : 'en'
  });
  
  return (
    <div className={`company-info ${isRtl ? 'text-right' : ''}`}>
      {logoUrl && (
        <div className="mb-4">
          <Link href="/" className="inline-block">
            <Image 
              src={logoUrl} 
              alt={logoAlt}
              width={150}
              height={40}
              className="h-auto w-auto max-h-10"
              priority
              quality={95}
            />
          </Link>
        </div>
      )}
      
      {(companyName || description) && (
        <div>
          {companyName && (
            <h3 className="text-lg font-semibold mb-4">{companyName}</h3>
          )}
          
          {description && (
            <p className="text-gray-400 mb-6">
              {description}
            </p>
          )}
        </div>
      )}
      
      {finalSocialMedia.length > 0 && (
        <div 
          className={`${(companyName || description) ? 'mt-6' : ''}`} 
          style={{ 
            display: 'flex', 
            flexDirection: isRtl ? 'row-reverse' : 'row',
            justifyContent: isRtl ? 'flex-end' : 'flex-start',
            gap: '1rem'
          }}
          aria-label={t('followUs')}
        >
          {finalSocialMedia.map((item, index) => (
            <div 
              key={item.id}
              style={{ 
                marginLeft: isRtl ? '0' : undefined,
                marginRight: isRtl ? undefined : '0'
              }}
            >
              <SocialMediaLink
                platform={item.platform}
                url={item.url}
                icon={item.icon}
                isRtl={isRtl}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyInfo; 