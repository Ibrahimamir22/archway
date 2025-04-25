/**
 * Translations Type Definitions
 * 
 * This file provides TypeScript type definitions for translations, 
 * ensuring type safety when accessing translation keys.
 */

// Define the structure of your translations to match your JSON files
export interface Translations {
  header: {
    home: string;
    portfolio: string;
    services: string;
    about: string;
    contact: string;
    getQuote: string;
  };
  
  footer: {
    copyright: string;
    privacyPolicy: string;
    termsOfService: string;
    quickLinks: string;
    consultancy: string;
    renovation: string;
    address: string;
    email: string;
    phone: string;
    followUs: string;
    loading: string;
    allRightsReserved: string;
    viewOnMap: string;
    sendEmail: string;
    callUs: string;
    errorLoading: string;
    retry: string;
    contactUs: string;
    newsletter: {
      title: string;
      description: string;
      placeholder: string;
      subscribe: string;
      subscribing: string;
      emailRequired: string;
      emptyEmail: string;
      invalidEmail: string;
      successMessage: string;
      errorMessage: string;
      thankYou: string;
    };
    companyInfo: {
      name: string;
      description: string;
    };
    sections: {
      resources: {
        title: string;
        links: {
          blog: string;
          faq: string;
          contact: string;
        };
      };
      company: {
        title: string;
        links: {
          about_us: string;
          services: string;
          portfolio: string;
        };
      };
    };
  };
  
  about: {
    pageTitle: string;
    pageDescription: string;
    aboutUs: string;
    title: string;
    subtitle: string;
    mission: string;
    missionText: string;
    vision: string;
    visionText: string;
    team: string;
    teamMember1Name: string;
    teamMember1Role: string;
    teamMember1Bio: string;
    teamMember2Name: string;
    teamMember2Role: string;
    teamMember2Bio: string;
    teamMember3Name: string;
    teamMember3Role: string;
    teamMember3Bio: string;
    testimonials: string;
    testimonial1Client: string;
    testimonial1Project: string;
    testimonial1Quote: string;
    testimonial2Client: string;
    testimonial2Project: string;
    testimonial2Quote: string;
    testimonial3Client: string;
    testimonial3Project: string;
    testimonial3Quote: string;
    values: string;
    frequentlyAsked: string;
    cannotFind: string;
    viewFaq: string;
    loadingValues: string;
    loadingTeam: string;
    loadingTestimonials: string;
    errorLoadingValues: string;
    errorLoadingTeam: string;
    errorLoadingTestimonials: string;
    noCoreValuesFound: string;
    noTeamMembersFound: string;
    noTestimonialsFound: string;
    ourJourney: string;
    journeyDescription: string;
    loadingHistory: string;
    errorLoadingHistory: string;
    noHistoryFound: string;
    era: {
      beginnings: string;
      growth: string;
      expansion: string;
      current: string;
      beginning: string;
      innovation: string;
      today: string;
    };
    stats: string;
    loadingStats: string;
    errorLoadingStats: string;
    noStatsFound: string;
    stat: {
      client_satisfaction: string;
      completed_projects: string;
      happy_clients: string;
      happy_clients_desc: string;
      team_members: string;
      years_experience: string;
    };
    clients: string;
    ourClients: string;
    trustedPartners: string;
    clientsDescription: string;
    partnersDescription: string;
    loadingLogos: string;
    errorLoadingLogos: string;
    noLogosFound: string;
    noCategoryLogosFound: string;
    allCategories: string;
    category: {
      hospitality: string;
      residential: string;
      corporate: string;
      retail: string;
      education: string;
      healthcare: string;
    };
    history: string;
    testimonials: string;
    testimonialsDescription: string;
    retry: string;
  };
  
  // Continue with other sections from your translations...
  // This is just a starting point - you should complete this
  // based on your complete translation structure
}

// Augment the next-intl module to use our translations type
declare module 'next-intl' {
  export function useTranslations(namespace?: string): 
    <K extends keyof Translations>(key: K) => string;
}

// Use this type for getTranslations from next-intl/server
declare module 'next-intl/server' {
  export function getTranslations<K extends keyof Translations>(
    options: { locale: string; namespace?: string }
  ): Promise<(key: string) => string>;
} 