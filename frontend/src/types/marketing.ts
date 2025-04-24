export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department?: string;
  bio?: string;
  image: string;
  featured: boolean;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
  contactInfo?: {
    email?: string;
    phone?: string;
  };
}

export interface Testimonial {
  id: string;
  author: string;
  role?: string;
  company?: string;
  content: string;
  rating?: number;
  image?: string;
  industry?: string;
  featured: boolean;
  date?: string;
}

export interface MarketingSection {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  ctaText?: string;
  ctaUrl?: string;
  items?: Array<{
    id: string;
    title: string;
    description?: string;
    icon?: string;
    image?: string;
  }>;
  featured?: boolean;
  order?: number;
}

export interface CoreValue {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface MissionVisionStatement {
  title: string;
  content: string;
  type: 'mission' | 'vision';
  image?: string;
} 