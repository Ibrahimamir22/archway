import { redirect } from 'next/navigation';
import { defaultLocale } from '@/../i18n';

// This page will never be rendered - it immediately redirects
export default function RootPage() {
  // Redirect to the default locale
  redirect(`/${defaultLocale}`);
  
  // This is just for TypeScript - it will never be reached
  return null;
} 