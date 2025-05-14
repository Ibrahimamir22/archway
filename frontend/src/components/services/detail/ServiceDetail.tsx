import ServiceDetailClient from './ServiceDetail.client';
import { Service } from '@/lib/hooks/services/types';

interface ServiceDetailProps {
  service: Service;
  className?: string;
  locale?: string;
}

/**
 * Server component for service detail
 * Delegates rendering to the client component for interactive elements
 */
export default function ServiceDetail({
  service,
  className = '',
  locale = 'en'
}: ServiceDetailProps) {
  // Delegate to the client component for rendering and interactivity
  return (
    <ServiceDetailClient
      service={service}
      className={className}
      locale={locale}
    />
  );
} 