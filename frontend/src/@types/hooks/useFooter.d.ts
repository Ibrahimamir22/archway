/**
 * Type definitions for the useFooter hook
 */

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
}

export interface ContactInfo {
  address?: string;
  email?: string;
  phone?: string;
}

export interface FooterSection {
  id: string;
  title: string;
  links: Array<{
    id: string;
    text: string;
    url: string;
    open_in_new_tab?: boolean;
  }>;
}

export interface FooterData {
  company_name?: string;
  description?: string;
  show_newsletter?: boolean;
  newsletter_text?: string;
  social_links: SocialLink[];
  contact_info: ContactInfo;
  sections: FooterSection[];
  copyright_text?: string;
  bottom_links?: Array<{
    id: string;
    text: string;
    url: string;
  }>;
}

export interface UseFooterResult {
  footerData: FooterData | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export interface NewsletterSubscriptionResult {
  success: boolean;
  error?: string;
} 