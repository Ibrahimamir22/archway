import React from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ServicesClient from './services-client';
import { getApiBaseUrl } from '@/lib/api';
import axios from 'axios';

// Generate metadata based on locale
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const commonT = await getTranslations({ locale, namespace: 'common' });
  const servicesT = await getTranslations({ locale, namespace: 'services' });
  
  return {
    title: `${servicesT('pageTitle')} | ${commonT('appName')}`,
    description: servicesT('pageDescription'),
  };
}

// Fetch initial data for server-side rendering
async function getInitialData(locale: string) {
  try {
    const apiBaseUrl = getApiBaseUrl();
    
    // Setup params for localization
    const params = new URLSearchParams();
    params.append('lang', locale || 'en');
    
    // Fetch featured services and categories in parallel
    const [servicesResponse, categoriesResponse] = await Promise.all([
      axios.get(`${apiBaseUrl}/services/?${params.toString()}&is_featured=true`),
      axios.get(`${apiBaseUrl}/service-categories/?${params.toString()}`)
    ]);
    
    // Extract the services and categories data
    const initialServices = Array.isArray(servicesResponse.data?.results) 
      ? servicesResponse.data.results 
      : Array.isArray(servicesResponse.data) 
        ? servicesResponse.data 
        : [];
        
    const initialCategories = Array.isArray(categoriesResponse.data?.results) 
      ? categoriesResponse.data.results 
      : Array.isArray(categoriesResponse.data) 
        ? categoriesResponse.data 
        : [];
    
    return {
      initialServices,
      initialCategories
    };
  } catch (error) {
    console.error('Error fetching initial services data:', error);
    return {
      initialServices: [],
      initialCategories: []
    };
  }
}

// Server component
export default async function ServicesPage({ params: { locale }, searchParams }: { 
  params: { locale: string }, 
  searchParams?: { category?: string } 
}) {
  const { initialServices, initialCategories } = await getInitialData(locale);
  
  return (
    <ServicesClient 
      initialServices={initialServices} 
      initialCategories={initialCategories} 
      selectedCategory={searchParams?.category}
      locale={locale}
    />
  );
} 