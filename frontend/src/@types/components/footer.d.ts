/**
 * Type definitions for Footer components
 */

// SocialIcon Component
export interface SocialIconProps {
  platform: string;
  url: string;
}

// FooterSection Component
export interface FooterSectionProps {
  section: {
    id: string;
    title: string;
    links?: FooterLink[];
  };
  isRtl: boolean;
}

export interface FooterLink {
  id: string;
  text: string;
  url: string;
  open_in_new_tab?: boolean;
}

// CompanyInfo Component
export interface CompanyInfoProps {
  settings: {
    company_name?: string;
    description?: string;
    show_newsletter?: boolean;
    newsletter_text?: string;
  };
  socialMedia: Array<{
    id: string;
    platform: string;
    url: string;
  }>;
  isRtl: boolean;
}

// ContactInfo Component
export interface ContactInfoProps {
  settings: {
    address?: string;
    email?: string;
    phone?: string;
  };
  isRtl: boolean;
}

// NewsletterForm Component
export interface NewsletterFormProps {
  className?: string;
}

// Footer Component
export interface FooterProps {
  className?: string;
} 