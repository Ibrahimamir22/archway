import React from 'react';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

// --- Metadata ---
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'common' });
  const pageTitle = t('terms.pageTitle', { default: 'Terms and Privacy Policy' });

  return {
    title: `${pageTitle} | ${t('appName')}`,
    description: t('terms.metaDescription', { default: 'Terms of Service and Privacy Policy for Archway Interior Design.' }),
  };
}
// --- End Metadata ---

// --- Page Component (Server Component) ---
export default async function TermsPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('common'); 
  const isRtl = locale === 'ar';

  return (
    <div className="container mx-auto px-4 py-12">
      <div className={`max-w-4xl mx-auto ${isRtl ? 'text-right' : ''}`}>
        {/* Use translated title */}
        <h1 className="text-4xl font-heading font-bold mb-8">{t('terms.pageTitle', { default: 'Terms and Privacy Policy' })}</h1>
        
        <div className="mb-12">
          {/* Use translated section title */}
          <h2 className="text-2xl font-heading font-semibold mb-4">{t('terms.termsOfServiceTitle', { default: 'Terms of Service' })}</h2>
          <div className="bg-white p-6 rounded-lg shadow-md prose max-w-none">
            {/* Placeholder content - Consider fetching from CMS or using Markdown */}
            <p>
              This is a placeholder for the Terms of Service. In the actual implementation, this would contain the full terms of service for Archway Interior Design.
            </p>
            <p>
              The terms would cover aspects such as:
            </p>
            <ul>
              <li>User account responsibilities</li>
              <li>Acceptable use of the platform</li>
              <li>Intellectual property rights</li>
              <li>Limitation of liability</li>
              <li>Termination of service</li>
              <li>Governing law and jurisdiction</li>
            </ul>
            <p>
              Last updated: June 2023
            </p>
          </div>
        </div>
        
        <div>
          {/* Use translated section title */}
          <h2 className="text-2xl font-heading font-semibold mb-4">{t('terms.privacyPolicyTitle', { default: 'Privacy Policy' })}</h2>
          <div className="bg-white p-6 rounded-lg shadow-md prose max-w-none">
            {/* Placeholder content */}
            <p>
              This is a placeholder for the Privacy Policy. In the actual implementation, this would contain the full privacy policy for Archway Interior Design.
            </p>
            <p>
              The privacy policy would cover aspects such as:
            </p>
            <ul>
              <li>What personal information we collect</li>
              <li>How we use your personal information</li>
              <li>How we store and protect your data</li>
              <li>Your data protection rights</li>
              <li>Use of cookies</li>
              <li>Third-party services</li>
              <li>Changes to the privacy policy</li>
            </ul>
            <p>
              Last updated: June 2023
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Note: Add translation keys like 'terms.pageTitle', 'terms.metaDescription', 
// 'terms.termsOfServiceTitle', 'terms.privacyPolicyTitle' to your message files. 