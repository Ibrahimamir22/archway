import React from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import HomeClient from '@/components/home/HomeClient';
import { getApiBaseUrl } from '@/lib/api/urls';
import axios from 'axios';

// Generate metadata
export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'home' });
  return {
    title: t('metaTitle'),
    description: t('metaDescription'),
  };
}

// Fetch initial data
async function getHomePageData(locale: string) {
  try {
    const apiBaseUrl = getApiBaseUrl();
    
    // Setup params for localization
    const params = new URLSearchParams();
    params.append('lang', locale);
    
    console.log(`Fetching featured data for home page, locale: ${locale}`);
    console.log(`API base URL: ${apiBaseUrl}`);
    
    // Construct featured services URL with explicit is_published parameter
    const servicesUrl = `${apiBaseUrl}/services/?${params.toString()}&is_featured=true&is_published=true&limit=3`;
    console.log(`Services URL: ${servicesUrl}`);
    
    // Fetch featured projects and services in parallel
    const [projectsResponse, servicesResponse] = await Promise.all([
      axios.get(`${apiBaseUrl}/projects/?${params.toString()}&is_featured=true&is_published=true&limit=3`),
      axios.get(servicesUrl)
    ]);
    
    // Extract data and log for debugging
    const initialProjects = Array.isArray(projectsResponse.data?.results) 
      ? projectsResponse.data.results 
      : [];
    
    const initialServices = Array.isArray(servicesResponse.data?.results) 
      ? servicesResponse.data.results 
      : [];
    
    console.log(`Found ${initialProjects.length} featured projects`);
    console.log(`Found ${initialServices.length} featured services`);
    
    if (initialServices.length === 0) {
      console.log('Services API response:', servicesResponse.data);
    }
    
    return {
      initialProjects,
      initialServices
    };
  } catch (error) {
    console.error('Error fetching home page data:', error);
    return {
      initialProjects: [],
      initialServices: []
    };
  }
}

// Server component
export default async function HomePage({ params: { locale } }: { params: { locale: string } }) {
  const { initialProjects, initialServices } = await getHomePageData(locale);
  
  return (
    <HomeClient 
      initialProjects={initialProjects}
      initialServices={initialServices}
      locale={locale}
    />
  );
}