import { getTranslations } from 'next-intl/server';
import BusinessHoursClient from './BusinessHours.client';

interface BusinessHoursProps {
  title: string;
  hours: string;
  isRtl: boolean;
  isCopied: boolean;
  onCopy: () => void;
}

/**
 * Server component for business hours
 * Uses BusinessHoursClient for client-side functionality
 * 
 * This component follows the server/client pattern established in the project,
 * where server components delegate interactive elements to client components.
 */
export default function BusinessHours(props: BusinessHoursProps) {
  // Simply pass the props to the client component
  // This pattern ensures proper server/client separation
  // Any server-side data preparation would happen here
  return <BusinessHoursClient {...props} />;
} 