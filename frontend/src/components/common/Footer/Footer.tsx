'use client';

import React from 'react';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { useFooter } from '../../../hooks/ui/useFooter';
import type { FooterSection as FooterSectionType } from '../../../hooks/ui/useFooter';
import LoadingState from '../LoadingState/index';

// Import components from the same directory
import FooterSection from './FooterSection';
import CompanyInfo from './CompanyInfo';
import ContactInfo from './ContactInfo';

export interface FooterProps {
  // Add props if needed in the future
}

const Footer = (props: FooterProps): JSX.Element => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale } = router;
  const isRtl = locale === 'ar';
  
  // Fetch footer data using the hook
  const { 
    footerData, 
    loading, 
    error,
    refetch
  } = useFooter();
  
  // Extract data from footerData
  const socialLinks = footerData?.social_links || [];
  const contactInfo = footerData?.contact_info || [];
  const sections = Array.isArray(footerData?.sections) ? footerData.sections : [];
  const copyrightText = footerData?.copyright_text;
  const bottomLinks = footerData?.bottom_links || [];
  
  // Show fallback content if data is loading or there's an error
  if (loading) {
    return (
      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="container-custom">
          <LoadingState type="text" className="text-white" />
          <div className="text-center mt-4">{t('common.loading')}</div>
        </div>
      </footer>
    );
  }
  
  if (error) {
    console.error('Error loading footer:', error);
    // Show basic footer in case of error
    return (
      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="container-custom">
          <div className="text-center py-4">
            <p className="text-red-400 mb-2">{t('common.errorLoading')}</p>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Archway</p>
          </div>
        </div>
      </footer>
    );
  }
  
  // Calculate the grid columns based on available sections
  const totalSections = (socialLinks.length > 0 ? 1 : 0) + (sections.length || 0) + (contactInfo.length > 0 ? 1 : 0);
  const gridCols = totalSections <= 2 ? 'grid-cols-1 md:grid-cols-2' :
                  totalSections === 3 ? 'grid-cols-1 md:grid-cols-3' :
                  'grid-cols-1 md:grid-cols-4';
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className={`grid ${gridCols} gap-8`}>
          {/* Company Info */}
          {socialLinks.length > 0 && (
            <CompanyInfo 
              settings={footerData} 
              socialMedia={socialLinks} 
              isRtl={isRtl} 
            />
          )}
          
          {/* Dynamic sections from database */}
          {Array.isArray(sections) && sections.map((section: FooterSectionType) => (
            <React.Fragment key={section.id}>
              <FooterSection 
                section={section} 
                isRtl={isRtl} 
              />
            </React.Fragment>
          ))}
          
          {/* Contact Info */}
          {contactInfo.length > 0 && (
            <ContactInfo 
              settings={footerData} 
              isRtl={isRtl} 
            />
          )}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>{copyrightText || `© ${new Date().getFullYear()} Archway Design. ${t('footer.allRightsReserved')}`}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 