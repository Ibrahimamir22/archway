'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { MdOutlineEmail, MdOutlinePhone, MdLocationOn } from 'react-icons/md';
import { useTranslations } from 'next-intl';

export interface ContactInfoProps {
  settings: any;
  isRtl: boolean;
  title: string;
}

const ContactInfo = ({ settings, isRtl, title }: ContactInfoProps): JSX.Element => {
  const params = useParams();
  const locale = params?.locale ? String(params.locale) : 'en';
  const t = useTranslations('footer');
  
  // Extract contact information from contact_info array if available
  let email = '';
  let phone = '';
  let address = '';
  
  // First try to get from contact_info array (the new structure)
  if (Array.isArray(settings?.contact_info) && settings.contact_info.length > 0) {
    // Find each type of contact info in the array
    const emailInfo = settings.contact_info.find((item: any) => item.type === 'email');
    const phoneInfo = settings.contact_info.find((item: any) => item.type === 'phone');
    const addressInfo = settings.contact_info.find((item: any) => item.type === 'address');
    
    // Extract values if items exist
    email = emailInfo?.value || '';
    phone = phoneInfo?.value || '';
    address = addressInfo?.value || '';
  } 
  
  // Fallback to direct properties if contact_info array is empty/missing
  if (!email && settings?.email) email = settings.email;
  if (!phone && settings?.phone) phone = settings.phone;
  if (!address && settings?.address) address = settings.address;
  
  // Fallback to translations if still empty
  if (!email) email = t('email');
  if (!phone) phone = t('phone');
  if (!address) address = t('address');
  
  console.log('Contact info extracted:', { email, phone, address });
  
  // If no contact info at all, don't render the component
  if (!email && !phone && !address) {
    console.warn('No contact info available, not rendering ContactInfo component');
    return <></>;
  }
  
  // Create Google Maps link from address
  const googleMapsLink = address 
    ? `https://www.google.com/maps/search/${encodeURIComponent(address)}`
    : '';
  
  return (
    <div className="contact-info" dir={isRtl ? 'rtl' : 'ltr'}>
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      
      <ul className="space-y-4" aria-label="Contact information">
        {email && (
          <li className="flex items-center">
            <span className="bg-blue-600/20 p-2 rounded-full inline-flex items-center justify-center" style={{
              marginInlineEnd: '12px', // This uses logical properties that respect RTL
            }}>
              <MdOutlineEmail 
                className="flex-shrink-0 text-blue-400" 
                aria-hidden="true"
                size={18}
              />
            </span>
            <a 
              href={`mailto:${email}`} 
              className="text-gray-300 hover:text-white transition-colors"
              aria-label={`${t('sendEmail')} ${email}`}
            >
              {email}
            </a>
          </li>
        )}
        
        {phone && (
          <li className="flex items-center">
            <span className="bg-green-600/20 p-2 rounded-full inline-flex items-center justify-center" style={{
              marginInlineEnd: '12px', // This uses logical properties that respect RTL
            }}>
              <MdOutlinePhone 
                className="flex-shrink-0 text-green-400" 
                aria-hidden="true"
                size={18}
              />
            </span>
            <a 
              href={`tel:${phone.replace(/\s/g, '')}`} 
              className="text-gray-300 hover:text-white transition-colors"
              aria-label={`${t('callUs')} ${phone}`}
              dir="ltr" // Keep phone numbers LTR
            >
              {phone}
            </a>
          </li>
        )}
        
        {address && (
          <li className="flex items-start">
            <span className="bg-red-600/20 p-2 rounded-full inline-flex items-center justify-center mt-1" style={{
              marginInlineEnd: '12px', // This uses logical properties that respect RTL
            }}>
              <MdLocationOn 
                className="flex-shrink-0 text-red-400" 
                aria-hidden="true"
                size={18}
              />
            </span>
            {googleMapsLink ? (
              <a 
                href={googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-300 hover:text-white transition-colors"
                aria-label={`${t('viewOnMap')}`}
              >
                {address}
              </a>
            ) : (
              <span className="text-gray-300">{address}</span>
            )}
          </li>
        )}
      </ul>
    </div>
  );
};

export default ContactInfo; 