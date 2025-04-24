import React from 'react';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getApiBaseUrl } from '@/lib/api';
import axios from 'axios';
import ServiceDetailClient from './service-detail-client';
import { notFound } from 'next/navigation';

// Generate metadata based on service data and locale
export async function generateMetadata({ 
  params: { locale, slug } 
}: { 
  params: { locale: string, slug: string } 
}): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'common' });
  
  // Fetch service data for metadata
  try {
    const apiBaseUrl = getApiBaseUrl();
    const urlParams = new URLSearchParams();
    urlParams.append('lang', locale);
    
    const response = await axios.get(`${apiBaseUrl}/services/${slug}/?${urlParams.toString()}`);
    const service = response.data;
    
    if (!service || !service.id) {
      return {
        title: `${t('services.serviceNotFound')} | ${t('appName')}`,
        description: t('services.serviceNotFound'),
      };
    }
    
    return {
      title: `${service.title} | ${t('appName')}`,
      description: service.short_description || service.description.substring(0, 160),
    };
  } catch (error) {
    // If service not found, return default metadata
    console.error(`Error fetching metadata for service ${slug}:`, error);
    return {
      title: `${t('services.serviceNotFound')} | ${t('appName')}`,
      description: t('services.serviceNotFound'),
    };
  }
}

// Generate static paths for services
export async function generateStaticParams() {
  try {
    const apiBaseUrl = getApiBaseUrl();
    const response = await axios.get(`${apiBaseUrl}/services/?is_featured=true`);
    const services = response.data.results || [];
    
    return services.map((service: any) => ({
      slug: service.slug
    }));
  } catch (error) {
    console.error('Error generating service static paths:', error);
    return [];
  }
}

// Fetch service data for server-side rendering
async function getServiceData(slug: string, locale: string) {
  try {
    console.log(`Fetching service data for slug: ${slug}, locale: ${locale}`);
    const apiBaseUrl = getApiBaseUrl();
    const urlParams = new URLSearchParams();
    urlParams.append('lang', locale);
    
    console.log(`Using API base URL: ${apiBaseUrl}`);
    
    // Try the service API endpoint
    const serviceUrl = `${apiBaseUrl}/services/${slug}/?${urlParams.toString()}`;
    console.log(`Fetching service data from: ${serviceUrl}`);
    
    try {
      const response = await axios.get(serviceUrl);
      const service = response.data;
      
      if (!service || !service.id) {
        console.log(`No service found for slug: ${slug}`);
        return { notFound: true };
      }
      
      console.log(`Service found for slug: ${slug}, id: ${service.id}`);
      return { service };
    } catch (serviceError) {
      // If service not found, check if it might be a project
      if (axios.isAxiosError(serviceError) && serviceError.response?.status === 404) {
        console.log(`Service not found, checking if it's a project instead`);
        
        try {
          const projectUrl = `${apiBaseUrl}/projects/${slug}/?${urlParams.toString()}`;
          const projectResponse = await axios.get(projectUrl);
          const projectExists = projectResponse.data && projectResponse.data.id;
          
          if (projectExists) {
            console.log(`Slug "${slug}" exists as a project, redirecting...`);
            return { isRedirect: true, redirectPath: `/portfolio/${slug}` };
          }
        } catch (projectError) {
          // Not a project either, return not found
          console.log(`Not a project either, slug "${slug}" not found anywhere`);
          return { notFound: true };
        }
      }
      
      // If we get here, we couldn't find a service or project
      console.error(`Error fetching service data: ${serviceError}`);
      return { notFound: true };
    }
  } catch (error) {
    console.error(`Error in getServiceData for ${slug}:`, error);
    return { notFound: true };
  }
}

// Server component
export default async function ServiceDetailPage({ 
  params: { locale, slug } 
}: { 
  params: { locale: string, slug: string } 
}) {
  console.log(`Rendering ServiceDetailPage for slug: "${slug}", locale: "${locale}"`);
  
  const result = await getServiceData(slug, locale);
  
  // If no service was found or there was an error, display the 404 page
  if (result.notFound) {
    console.log(`Service not found for slug: "${slug}", showing 404`);
    return notFound();
  }
  
  // If it's a project redirect, use notFound to handle it
  if (result.isRedirect) {
    console.log(`Redirecting to project: ${result.redirectPath}`);
    return notFound();
  }
  
  // Ensure service exists and has all required properties
  // This check is critical to prevent runtime errors in the client component
  const service = result.service;
  if (!service || !service.id || !service.title) {
    console.error(`Invalid service data for slug: "${slug}"`);
    return notFound();
  }
  
  // Log what we're rendering for debugging
  console.log(`Rendering service detail for: "${service.title}" (ID: ${service.id})`);
  
  return (
    <ServiceDetailClient 
      service={service} 
      locale={locale}
    />
  );
} 