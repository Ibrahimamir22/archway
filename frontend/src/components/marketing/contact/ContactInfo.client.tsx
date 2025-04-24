'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { MdLocationOn, MdEmail, MdPhone } from 'react-icons/md';
import { motion } from 'framer-motion';
import { 
  MapDisplay, 
  SocialLinks, 
  BusinessHours, 
  ContactItem 
} from './form';
import { ContactInfoData } from '@/types/marketing/contact';
import { useClipboard } from '@/lib/hooks/marketing/contact';

interface ContactInfoClientProps {
  contactInfo: ContactInfoData;
  isRtl: boolean;
  locale: string;
  errorText?: string;
  loadingText?: string;
  infoUnavailableText?: string;
}

/**
 * Client component for contact information with interactive elements
 */
const ContactInfoClient = React.memo(({
  contactInfo,
  isRtl,
  locale,
  errorText,
  loadingText,
  infoUnavailableText
}: ContactInfoClientProps) => {
  const t = useTranslations('contact');
  
  // Use our shared clipboard hook
  const { copiedField, copyToClipboard } = useClipboard({
    onError: (err) => console.error('Failed to copy contact info:', err),
  });
  
  // Get localized content
  const address = isRtl ? contactInfo.address_ar : contactInfo.address_en;
  const hours = isRtl ? contactInfo.working_hours_ar : contactInfo.working_hours_en;

  // Prepare social links in the expected format - memoized to avoid recreating on every render
  const socialLinks = useMemo(() => {
    const links = [];
    if (contactInfo.facebook_url) {
      links.push({ platform: 'facebook', url: contactInfo.facebook_url });
    }
    if (contactInfo.instagram_url) {
      links.push({ platform: 'instagram', url: contactInfo.instagram_url });
    }
    if (contactInfo.linkedin_url) {
      links.push({ platform: 'linkedin', url: contactInfo.linkedin_url });
    }
    if (contactInfo.twitter_url) {
      links.push({ platform: 'twitter', url: contactInfo.twitter_url });
    }
    if (contactInfo.youtube_url) {
      links.push({ platform: 'youtube', url: contactInfo.youtube_url });
    }
    return links;
  }, [contactInfo]);

  return (
    <div 
      className="h-full rounded-xl overflow-hidden bg-white/80 dark:bg-gray-800/90 backdrop-blur-sm shadow-lg border border-gray-100 dark:border-gray-700 transition-all hover:shadow-xl"
      data-testid="contact-info"
    >
      <div className="p-6 md:p-8">
        <h2 className="text-2xl font-heading font-bold mb-8 text-brand-blue dark:text-white">
          {t('contactInfo')}
        </h2>
        
        <div className="space-y-8">
          {/* Address with Map */}
          {address && (
            <div>
              <ContactItem
                title={t('addressLabel')}
                value={address}
                icon={<MdLocationOn className="w-6 h-6 text-brand-blue dark:text-brand-accent" aria-hidden="true" />}
                isRtl={isRtl}
                isCopied={copiedField === 'address'}
                onCopy={() => copyToClipboard(address, 'address')}
              />
              
              {contactInfo.map_url && (
                <div className="mt-4 ml-16 rtl:ml-0 rtl:mr-16">
                  <MapDisplay
                    address={address}
                    mapUrl={contactInfo.map_url}
                    directionsUrl={contactInfo.directions_url}
                    viewOnMapText={t('viewOnMap')}
                    getDirectionsText={t('getDirections') || 'Get Directions'}
                    isRtl={isRtl}
                  />
                </div>
              )}
            </div>
          )}
      
          {/* Email */}
          {contactInfo.email && (
            <ContactItem
              title={t('emailLabel')}
              value={contactInfo.email}
              icon={<MdEmail className="w-6 h-6 text-brand-blue dark:text-brand-accent" aria-hidden="true" />}
              isRtl={isRtl}
              isCopied={copiedField === 'email'}
              onCopy={() => copyToClipboard(contactInfo.email as string, 'email')}
              href={`mailto:${contactInfo.email}`}
              isLtr={true}
            />
          )}
      
          {/* Phone */}
          {contactInfo.phone && (
            <ContactItem
              title={t('phoneLabel')}
              value={contactInfo.phone}
              icon={<MdPhone className="w-6 h-6 text-brand-blue dark:text-brand-accent" aria-hidden="true" />}
              isRtl={isRtl}
              isCopied={copiedField === 'phone'}
              onCopy={() => copyToClipboard(contactInfo.phone as string, 'phone')}
              href={`tel:${contactInfo.phone?.replace(/\s+/g, '')}`}
              isLtr={true}
            />
          )}

          {/* Business Hours */}
          {hours && (
            <BusinessHours
              title={t('businessHours')}
              hours={hours}
              isRtl={isRtl}
              isCopied={copiedField === 'hours'}
              onCopy={() => copyToClipboard(hours, 'hours')}
            />
          )}
        </div>
      </div>
      
      {/* Social Media Links */}
      {socialLinks.length > 0 && (
        <SocialLinks
          title={t('followUs')}
          links={socialLinks}
          isRtl={isRtl}
        />
      )}
    </div>
  );
});

ContactInfoClient.displayName = 'ContactInfoClient';

export default ContactInfoClient; 