import { getTranslations } from 'next-intl/server';
import { getContactInfo } from '@/lib/api/contact';
import ContactInfoClient from './ContactInfo.client';
import { notFound } from 'next/navigation';
import { ContactInfoData } from '@/types/marketing/contact';

interface ContactInfoProps {
  locale?: string;
}

/**
 * Server component for contact information
 * Fetches data on the server and delegates to client component for interactivity
 * 
 * This follows the pattern established in our server component migration:
 * - Server component handles data fetching
 * - Client component handles interactivity
 */
export default async function ContactInfo({ locale = 'en' }: ContactInfoProps) {
  // Get translations for the current locale
  const t = await getTranslations('contact');
  const isRtl = locale === 'ar';
  
  try {
    // Fetch contact info on the server
    const contactInfo: ContactInfoData = await getContactInfo();
    
    if (!contactInfo) {
      return notFound();
    }
    
    // Prepare map URLs on the server if we have an address
    // This was previously done in the client component/API but is more efficient on the server
    if (contactInfo.address_en && !contactInfo.map_url) {
      const encodedAddress = encodeURIComponent(contactInfo.address_en);
      contactInfo.map_url = `https://www.google.com/maps/search/${encodedAddress}`;
      contactInfo.directions_url = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}`;
    }
    
    // Pass data and translations to the client component
    return (
      <ContactInfoClient
        contactInfo={contactInfo}
        isRtl={isRtl}
        locale={locale}
        infoUnavailableText={t('infoUnavailable')}
        loadingText={t('loadingContactInfo')}
      />
    );
  } catch (error) {
    console.error('Error rendering contact info:', error);
    return (
      <div className="p-6 rounded-xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400">
        {t('errorLoadingContactInfo')}
      </div>
    );
  }
} 