// This barrel file exports all Footer-related components
import Footer, { FooterProps } from './Footer';
import NewsletterForm from './NewsletterForm';
import FooterSection from './FooterSection';
import SocialIcon from './SocialIcon';
import CompanyInfo from './CompanyInfo';
import ContactInfo from './ContactInfo';

// Re-export all components
export { 
  Footer,
  NewsletterForm,
  FooterSection,
  SocialIcon,
  CompanyInfo,
  ContactInfo
};

// Also export types
export type { FooterProps };

// Export Footer as default
export default Footer; 