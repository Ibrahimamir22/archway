/**
 * About page type definitions
 */

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  image: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  clientName: string;
  project: string;
}

export interface CoreValue {
  id: number;
  title: string;
  text: string;
  icon: React.ReactNode;
}

export interface AboutPageData {
  title: string;
  subtitle: string;
  mission: string;
  missionText: string;
  vision: string;
  visionText: string;
  teamHeading: string;
  testimonialHeading: string;
  teamMembers: TeamMember[];
  testimonials: Testimonial[];
  coreValues: CoreValue[];
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