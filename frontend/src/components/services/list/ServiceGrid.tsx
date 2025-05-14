'use server';

import { getServices } from '@/lib/api/services';
import ServiceGridLoader from './ServiceGridLoader';
import ServiceGridClient from './ServiceGridClient';
import { Service } from '@/lib/hooks/services/types';

interface ServiceGridProps {
  initialServices?: Service[];
  category?: string;
  featured?: boolean;
  limit?: number;
  lang?: string;
  hasNextPage?: boolean;
}

/**
 * Server component for service grid that handles data fetching
 * and passes data to client components for interactivity
 */
export default async function ServiceGrid({
  initialServices,
  category,
  featured = false,
  limit = 12,
  lang = 'en',
  hasNextPage: initialHasNextPage
}: ServiceGridProps) {
  // If initial services are provided, use them directly
  if (initialServices) {
    // Use the loader for pagination if hasNextPage is provided
    if (initialHasNextPage !== undefined) {
      return (
        <ServiceGridLoader
          initialServices={initialServices}
          hasNextPage={initialHasNextPage}
          category={category}
          featured={featured}
          limit={limit}
          lang={lang}
        />
      );
    }
    
    // Otherwise just render the initial services without pagination
    return (
      <ServiceGridClient
        services={initialServices}
        locale={lang}
      />
    );
  }

  try {
    // Fetch services server-side
    const result = await getServices({
      category,
      featured,
      limit,
      lang
    });

    // Use the loader for pagination
    return (
      <ServiceGridLoader
        initialServices={result.services}
        hasNextPage={result.hasNextPage}
        category={category}
        featured={featured}
        limit={limit}
        lang={lang}
      />
    );
  } catch (error) {
    // Handle error gracefully
    console.error('Error fetching services in server component:', error);
    
    // Return client component with error state
    return (
      <ServiceGridClient
        services={[]}
        error="Failed to load services. Please try again later."
        locale={lang}
      />
    );
  }
} 