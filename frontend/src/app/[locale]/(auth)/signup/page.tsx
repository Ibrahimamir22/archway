import React from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { SignupForm } from '@/components/auth';

// Generate metadata for the page based on locale
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'common' });
  return {
    title: `${t('auth.signup')} | ${t('appName')}`,
    description: t('auth.signupMetaDescription', { 
      default: 'Create an account with Archway Interior Design to save your favorite projects and more.' 
    }),
  };
}

// Server Component
export default async function SignupPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <SignupForm />
    </div>
  );
} 