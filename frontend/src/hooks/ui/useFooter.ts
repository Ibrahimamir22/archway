import { useQuery } from 'react-query';
import { useRouter } from 'next/router';
import api, { getApiBaseUrl } from '../../utils/api';

export interface SocialLink {
  id: string;
  platform: string;
  url: string;
  icon?: string;
}

export interface ContactInfo {
  id: string;
  type: string;
  value: string;
  label?: string;
  icon?: string;
}

export interface FooterSection {
  id: string;
  title: string;
  links: Array<{
    id: string;
    text: string;
    url: string;
  }>;
}

export interface FooterData {
  social_links: SocialLink[];
  contact_info: ContactInfo[];
  sections: FooterSection[];
  copyright_text: string;
  bottom_links: Array<{
    id: string;
    text: string;
    url: string;
  }>;
}

/**
 * Hook for fetching footer data
 */
export const useFooter = (prefetchedData?: FooterData) => {
  const router = useRouter();
  const { locale } = router;
  const API_BASE_URL = getApiBaseUrl();

  const fetchFooter = async () => {
    // Add language parameter
    const params = new URLSearchParams();
    params.append('lang', locale || 'en');
    
    try {
      // Use our api instance with automatic URL transformation
      const mainResponse = await api.get(`${API_BASE_URL}/footer/?${params.toString()}`);
      const endpoints = mainResponse.data;
      
      // Fetch data from each endpoint - URLs will be automatically transformed by axios interceptor
      const [sectionsRes, socialMediaRes, settingsRes] = await Promise.all([
        api.get(`${endpoints.sections}?${params.toString()}`),
        api.get(`${endpoints['social-media']}?${params.toString()}`),
        api.get(`${endpoints.settings}?${params.toString()}`),
      ]);
      
      // Transform the sections data to match our expected format
      const sections = sectionsRes.data.results.map(section => ({
        id: section.id,
        title: section.title,
        links: section.links.map(link => ({
          id: link.id,
          text: link.title,
          url: link.url
        }))
      }));
      
      // Transform social media data
      const social_links = socialMediaRes.data.results.map(social => ({
        id: social.id,
        platform: social.platform,
        url: social.url,
        icon: social.icon
      }));
      
      // Extract contact info from settings
      const settingsData = settingsRes.data;
      const contact_info = [];
      
      if (settingsData.email) {
        contact_info.push({
          id: 'email',
          type: 'email',
          value: settingsData.email,
          icon: 'email'
        });
      }
      
      if (settingsData.phone) {
        contact_info.push({
          id: 'phone',
          type: 'phone',
          value: settingsData.phone,
          icon: 'phone'
        });
      }
      
      if (settingsData.address_en || settingsData.address_ar) {
        contact_info.push({
          id: 'address',
          type: 'address',
          value: locale === 'ar' ? settingsData.address_ar : settingsData.address_en,
          icon: 'location'
        });
      }
      
      // Construct the complete footer data
      const footerData = {
        social_links,
        contact_info,
        sections,
        copyright_text: locale === 'ar' ? settingsData.copyright_text_ar : settingsData.copyright_text_en,
        bottom_links: [] // Currently no bottom links in the API
      };
      
      return footerData;
    } catch (error) {
      console.error('Error fetching footer data:', error);
      
      // Return default fallback data
      return {
        social_links: [
          { id: '1', platform: 'facebook', url: 'https://facebook.com', icon: 'facebook' },
          { id: '2', platform: 'twitter', url: 'https://twitter.com', icon: 'twitter' },
          { id: '3', platform: 'instagram', url: 'https://instagram.com', icon: 'instagram' }
        ],
        contact_info: [
          { id: '1', type: 'email', value: 'hello@archwaydesign.com', icon: 'email' },
          { id: '2', type: 'phone', value: '+20 123 456 7890', icon: 'phone' },
          { id: '3', type: 'address', value: 'Cairo, Egypt', icon: 'location' }
        ],
        sections: [
          {
            id: '1',
            title: locale === 'ar' ? 'روابط سريعة' : 'Quick Links',
            links: [
              { id: '1', text: locale === 'ar' ? 'الرئيسية' : 'Home', url: '/' },
              { id: '2', text: locale === 'ar' ? 'من نحن' : 'About', url: '/about' },
              { id: '3', text: locale === 'ar' ? 'معرض الأعمال' : 'Portfolio', url: '/portfolio' },
              { id: '4', text: locale === 'ar' ? 'الخدمات' : 'Services', url: '/services' },
              { id: '5', text: locale === 'ar' ? 'تواصل معنا' : 'Contact', url: '/contact' }
            ]
          },
          {
            id: '2',
            title: locale === 'ar' ? 'خدماتنا' : 'Our Services',
            links: [
              { id: '1', text: locale === 'ar' ? 'التصميم الداخلي' : 'Interior Design', url: '/services/interior-design' },
              { id: '2', text: locale === 'ar' ? 'تصميم المساحات التجارية' : 'Commercial Design', url: '/services/commercial-design' },
              { id: '3', text: locale === 'ar' ? 'تصميم المنازل' : 'Residential Design', url: '/services/residential-design' }
            ]
          }
        ],
        copyright_text: locale === 'ar' ? '© 2023 أركواي للتصميم الداخلي. جميع الحقوق محفوظة.' : '© 2023 Archway Interior Design. All rights reserved.',
        bottom_links: [
          { id: '1', text: locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy', url: '/privacy' },
          { id: '2', text: locale === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions', url: '/terms' }
        ]
      };
    }
  };

  const { data, error, status, refetch } = useQuery(
    ['footer', locale],
    fetchFooter,
    {
      retry: 2,
      refetchOnWindowFocus: false,
      staleTime: 600000, // 10 minutes
      initialData: prefetchedData
    }
  );

  const footerData = data || {} as FooterData;
  const loading = status === 'loading';
  const errorMessage = status === 'error' 
    ? locale === 'ar' 
      ? "فشل تحميل بيانات التذييل، يرجى المحاولة مرة أخرى" 
      : "Failed to load footer data, please try again"
    : null;

  return { 
    footerData, 
    loading, 
    error: errorMessage, 
    refetch
  };
};

/**
 * Helper hook for newsletter subscription
 */
export const useNewsletterSubscription = () => {
  const API_BASE_URL = getApiBaseUrl();
  
  const subscribeToNewsletter = async (email: string) => {
    try {
      const response = await api.post(`${API_BASE_URL}/newsletter/`, { email });
      return { success: true, data: response.data };
    } catch (error) {
      if (api.isAxiosError(error) && error.response) {
        return { 
          success: false, 
          error: error.response.data.detail || 'Failed to subscribe. Please try again.' 
        };
      }
      return { 
        success: false, 
        error: 'An unexpected error occurred. Please try again.' 
      };
    }
  };
  
  return { subscribeToNewsletter };
}; 