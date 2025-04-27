/**
 * About page type definitions
 */

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image?: string;
  image_url?: string;
  email?: string;
  linkedin?: string;
  department?: string;
  is_featured?: boolean;
  is_active?: boolean;
  order?: number;
}

export interface Testimonial {
  id: number;
  // Backend model fields
  quote?: string;
  client_name?: string;
  project?: string;
  is_featured?: boolean;
  
  // Mock API fields
  author?: string;
  content?: string;
  company?: string;
  featured?: boolean;
  
  // Shared fields that can be in either format
  image?: string;
  image_url?: string;
  rating?: number;
  role?: string;
  position?: string;
}

export interface CoreValue {
  id: number;
  title: string;
  description: string;
  icon: string;
  order?: number;
}

export interface CompanyHistory {
  id: number;
  year: number;
  title: string;
  description: string;
  month?: number;
  order?: number;
}

export interface CompanyStatistic {
  id: number;
  title: string;
  value: number;
  unit?: string;
  order?: number;
}

export interface ClientLogo {
  id: number;
  name: string;
  logo: string;
  logo_url?: string;
  url?: string;
  order?: number;
  is_active?: boolean;
}

export interface AboutPageData {
  main_content: {
    title: string;
    subtitle: string;
    mission_title: string;
    mission_description: string;
    vision_title: string;
    vision_description: string;
    team_section_title: string;
    values_section_title: string;
    testimonials_section_title: string;
    history_section_title: string;
  };
  team_members: TeamMember[];
  core_values: CoreValue[];
  testimonials: Testimonial[];
  company_history: CompanyHistory[];
  statistics: CompanyStatistic[];
  client_logos: ClientLogo[];
  metadata: {
    team_count: number;
    values_count: number;
    testimonials_count: number;
    history_count: number;
    statistics_count: number;
    logos_count: number;
    language: string;
  };
}

export interface TranslationFunction {
  (key: string): string;
}

// Shared props interfaces for components
export interface WithTranslation {
  t: TranslationFunction;
}

export interface WithRTL {
  isRtl: boolean;
}

export interface WithLocale {
  locale: string;
}

export interface BaseAboutProps extends WithTranslation, WithRTL {}

export interface AboutHeroProps extends BaseAboutProps {}

export interface MissionVisionProps extends BaseAboutProps {}

export interface CoreValuesProps extends BaseAboutProps {}

export interface TeamSectionProps extends BaseAboutProps, WithLocale {}

export interface TestimonialsSectionProps extends BaseAboutProps {}

export interface FAQTeaserProps extends BaseAboutProps, WithLocale {} 