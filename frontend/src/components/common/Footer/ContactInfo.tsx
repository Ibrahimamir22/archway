'use client';

import React from 'react';
import { useTranslation } from 'next-i18next';

export interface ContactInfoProps {
  settings: any;
  isRtl: boolean;
}

const ContactInfo = ({ settings, isRtl }: ContactInfoProps): JSX.Element => {
  const { t } = useTranslation('common');
  
  if (!settings) return null;
  
  // Function to generate Google Maps URL from address
  const getGoogleMapsUrl = (address: string) => {
    if (!address) return '#';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };
  
  return (
    <div className={`col-span-1 ${isRtl ? 'text-right' : ''}`}>
      <h3 className="text-xl font-bold mb-4">{t('header.contact')}</h3>
      <ul className="space-y-4">
        {settings.address && (
          <a 
            href={getGoogleMapsUrl(settings.address)} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`${isRtl ? 'flex-row-reverse' : 'flex'} flex items-start group p-2 -m-2 rounded-lg transition-all duration-300 cursor-pointer`}
            aria-label={`${t('footer.viewOnMap')}: ${settings.address}`}
          >
            <span className={`flex-shrink-0 mt-1 ${isRtl ? 'ms-3' : 'me-3'}`}>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:brightness-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </span>
            <div className="flex-1">
              <p className="font-medium text-gray-300 group-hover:text-white group-hover:brightness-110 transition-colors duration-300">{t('footer.address')}</p>
              <span className="text-gray-300 group-hover:text-white group-hover:brightness-110 group-hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] transition-all duration-300">
                {settings.address}
              </span>
            </div>
          </a>
        )}
        
        {settings.email && (
          <a 
            href={`mailto:${settings.email}`}
            className={`${isRtl ? 'flex-row-reverse' : 'flex'} flex items-start group p-2 -m-2 rounded-lg transition-all duration-300 cursor-pointer`}
            aria-label={`${t('footer.sendEmail')}: ${settings.email}`}
          >
            <span className={`flex-shrink-0 mt-1 ${isRtl ? 'ms-3' : 'me-3'}`}>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:brightness-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </span>
            <div className="flex-1">
              <p className="font-medium text-gray-300 group-hover:text-white group-hover:brightness-110 transition-colors duration-300">{t('footer.email')}</p>
              <span className="text-gray-300 group-hover:text-white group-hover:brightness-110 group-hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] transition-all duration-300">
                {settings.email}
              </span>
            </div>
          </a>
        )}
        
        {settings.phone && (
          <a 
            href={`tel:${settings.phone.replace(/\s+/g, '')}`}
            className={`${isRtl ? 'flex-row-reverse' : 'flex'} flex items-start group p-2 -m-2 rounded-lg transition-all duration-300 cursor-pointer`}
            aria-label={`${t('footer.callUs')}: ${settings.phone}`}
          >
            <span className={`flex-shrink-0 mt-1 ${isRtl ? 'ms-3' : 'me-3'}`}>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:brightness-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </span>
            <div className="flex-1">
              <p className="font-medium text-gray-300 group-hover:text-white group-hover:brightness-110 transition-colors duration-300">{t('footer.phone')}</p>
              <span className="text-gray-300 group-hover:text-white group-hover:brightness-110 group-hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] transition-all duration-300">
                {settings.phone}
              </span>
            </div>
          </a>
        )}
      </ul>
    </div>
  );
};

export default ContactInfo; 