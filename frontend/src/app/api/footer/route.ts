/**
 * MOCK FOOTER API ENDPOINT
 * 
 * This file is currently NOT being used in the application!
 * It's kept here as a reference for future use if needed.
 * 
 * PURPOSE:
 * This mock API endpoint can provide footer data directly from the Next.js server
 * without requiring the Django backend to be implemented.
 * 
 * WHEN TO USE:
 * 1. During development when Django backend isn't ready
 * 2. For data that rarely changes and doesn't need backend admin
 * 3. For creating a standalone frontend without backend dependencies
 * 
 * HOW TO ENABLE THIS MOCK API:
 * To switch from direct backend calls to using this mock API:
 * 
 * 1. Uncomment this file
 * 2. Modify frontend/src/lib/api/core.ts to try the local endpoint first:
 *    ```
 *    export async function fetchRawFooterData(locale: string): Promise<any | null> {
 *      // First try the local Next.js mock API
 *      try {
 *        const localUrl = `/api/footer?lang=${locale}`;
 *        const response = await axios.get(localUrl, {timeout: 5000});
 *        if (response.status === 200 && response.data) {
 *          return response.data;
 *        }
 *      } catch (error) {
 *        console.log('Local API failed, trying backend');
 *      }
 *      
 *      // Continue with backend attempts as before...
 *      // rest of existing code...
 *    }
 *    ```
 * 
 * 3. Alternatively, implement the hybrid approach with environment variables:
 *    Add NEXT_PUBLIC_USE_MOCK_API=true to .env and modify core.ts accordingly
 * 
 * RELATED FILES:
 * - lib/api/core.ts - Contains fetchRawFooterData function
 * - lib/fixtures/footer/footerData.ts - Contains fallback data
 * - lib/utils/footerUtils.ts - Transforms data and provides fallbacks
 * - lib/hooks/footer/useFooter.ts - The hook that components use
 */

/*
import { NextResponse } from 'next/server';

/**
 * API handler for footer data (temporary mock implementation)
 * This serves as a placeholder until the Django backend is implemented
 */
/*
export async function GET(request: Request) {
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const lang = searchParams.get('lang') || 'en';
  
  // Mock data based on language
  const footerData = {
    settings: null,
    sections: [
      {
        id: "company",
        title: lang === 'en' ? "Company" : "الشركة",
        links: [
          { id: "about", text: lang === 'en' ? "About Us" : "من نحن", url: "/about", open_in_new_tab: false },
          { id: "services", text: lang === 'en' ? "Services" : "خدماتنا", url: "/services", open_in_new_tab: false },
          { id: "portfolio", text: lang === 'en' ? "Portfolio" : "معرض الأعمال", url: "/portfolio", open_in_new_tab: false }
        ]
      },
      {
        id: "resources",
        title: lang === 'en' ? "Resources" : "مصادر",
        links: [
          { id: "faq", text: lang === 'en' ? "FAQ" : "الأسئلة الشائعة", url: "/faq", open_in_new_tab: false },
          { id: "contact", text: lang === 'en' ? "Contact" : "اتصل بنا", url: "/contact", open_in_new_tab: false }
        ]
      }
    ],
    social_media: [
      { id: "facebook", name: "Facebook", url: "https://facebook.com", icon: "facebook" },
      { id: "instagram", name: "Instagram", url: "https://instagram.com", icon: "instagram" }
    ],
    bottom_links: [],
    company_name: "Archway Interior Design",
    description: lang === 'en' ? "We create stunning interior designs for modern homes and offices" : "نصمم تصاميم داخلية رائعة للمنازل والمكاتب الحديثة",
    copyright_text: lang === 'en' ? "© 2023 Archway Interior Design. All rights reserved." : "© 2023 آركواي للتصميم الداخلي. جميع الحقوق محفوظة.",
    show_newsletter: true,
    newsletter_text: lang === 'en' ? "Stay updated with our latest news and offers." : "ابق على اطلاع بأحدث أخبارنا وعروضنا.",
    contact_title: lang === 'en' ? "Get in touch" : "تواصل معنا",
    contact_info: [
      { type: "email", value: "info@archwayeg.com" },
      { type: "phone", value: "+20150000183" },
      { type: "address", value: lang === 'en' ? "VILLA 65, Ground floor, Near El Banafseg 5, NEW CAIRO, EGYPT, Cairo, Egypt" : "فيلا ٦٥، الدور الأرضي، بالقرب من البنفسج ٥، القاهرة الجديدة، مصر، القاهرة، مصر" }
    ]
  };

  // Return mock data
  return NextResponse.json(footerData);
}
*/ 