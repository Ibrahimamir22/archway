import React from 'react';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'next-i18next';
import Head from 'next/head';
import { useRouter } from 'next/router';

const TermsPage: NextPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isRtl = router.locale === 'ar';
  
  return (
    <>
      <Head>
        <title>Terms and Privacy Policy | Archway Interior Design</title>
        <meta name="description" content="Terms of Service and Privacy Policy for Archway Interior Design." />
      </Head>
      
      <div className="container mx-auto px-4 py-12">
        <div className={`max-w-4xl mx-auto ${isRtl ? 'text-right' : ''}`}>
          <h1 className="text-4xl font-heading font-bold mb-8">Terms and Privacy Policy</h1>
          
          <div className="mb-12">
            <h2 className="text-2xl font-heading font-semibold mb-4">Terms of Service</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="mb-4">
                This is a placeholder for the Terms of Service. In the actual implementation, this would contain the full terms of service for Archway Interior Design.
              </p>
              <p className="mb-4">
                The terms would cover aspects such as:
              </p>
              <ul className="list-disc ps-6 mb-4">
                <li className="mb-2">User account responsibilities</li>
                <li className="mb-2">Acceptable use of the platform</li>
                <li className="mb-2">Intellectual property rights</li>
                <li className="mb-2">Limitation of liability</li>
                <li className="mb-2">Termination of service</li>
                <li className="mb-2">Governing law and jurisdiction</li>
              </ul>
              <p>
                Last updated: June 2023
              </p>
            </div>
          </div>
          
          <div>
            <h2 className="text-2xl font-heading font-semibold mb-4">Privacy Policy</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="mb-4">
                This is a placeholder for the Privacy Policy. In the actual implementation, this would contain the full privacy policy for Archway Interior Design.
              </p>
              <p className="mb-4">
                The privacy policy would cover aspects such as:
              </p>
              <ul className="list-disc ps-6 mb-4">
                <li className="mb-2">What personal information we collect</li>
                <li className="mb-2">How we use your personal information</li>
                <li className="mb-2">How we store and protect your data</li>
                <li className="mb-2">Your data protection rights</li>
                <li className="mb-2">Use of cookies</li>
                <li className="mb-2">Third-party services</li>
                <li className="mb-2">Changes to the privacy policy</li>
              </ul>
              <p>
                Last updated: June 2023
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default TermsPage; 