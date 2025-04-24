import React from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { LoginForm } from '@/components/auth';

// Generate metadata for the page based on locale
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'common' });
  return {
    title: `${t('auth.login')} | ${t('appName')}`,
    description: t('auth.loginMetaDescription', { 
      default: 'Log in to your Archway Interior Design account to access your saved projects and more.' 
    }),
  };
}

// Server Component
export default async function LoginPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <LoginForm />
    </div>
  );
} 