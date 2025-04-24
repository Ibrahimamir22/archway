'use client';

// This barrel file exports all Footer-related components
import Footer from './Footer';
import NewsletterForm from './NewsletterForm';
import FooterSection from './FooterSection';
import SocialMediaLink from './SocialMediaLink';
import CompanyInfo from './CompanyInfo';
import ContactInfo from './ContactInfo';

// Re-export all components
export { 
  Footer,
  NewsletterForm,
  FooterSection,
  SocialMediaLink as SocialIcon,
  CompanyInfo,
  ContactInfo,
  SocialMediaLink
};

// Also export types
export type { FooterProps };

// Export Footer as default
export default Footer; 