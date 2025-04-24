import FAQCategoryClient from './FAQCategory.client';
import { FAQ } from '@/types/marketing/faq';

interface FAQCategoryProps {
  title: string;
  faqs: FAQ[];
  isRtl: boolean;
}

/**
 * Server component for FAQ category
 * Delegates rendering to client component for animations and interactivity
 * 
 * This follows the established pattern from other server component migrations:
 * - Server component handles data preparation
 * - Client component handles interactivity and animations
 */
export default function FAQCategory({ title, faqs, isRtl }: FAQCategoryProps) {
  // No FAQs to display
  if (!faqs || faqs.length === 0) {
    return null;
  }

  // Any server-side data preparation would happen here
  // For example, sorting FAQs by order or processing answer content
  
  // Pass the prepared data to the client component
  return (
    <FAQCategoryClient 
      title={title} 
      faqs={faqs} 
      isRtl={isRtl} 
    />
  );
} 