/**
 * MOCK API ENDPOINT FOR FOOTER DATA
 * 
 * OVERVIEW:
 * This endpoint provides a local mock implementation of the footer API.
 * It's used in development and testing environments when the backend
 * may not be available or when you want to work in isolation.
 * 
 * WORKFLOW:
 * 1. Reads the locale from query parameters
 * 2. Loads translations from message files
 * 3. Constructs a response that matches the backend API structure
 * 4. Returns the mock data as JSON
 * 
 * DOCKER USAGE:
 * Works in Docker environments with no special configuration needed.
 * 
 * RELATED FILES:
 * - src/messages/*.json - Source of translations
 * - src/lib/api/footer.ts - Footer-specific fetcher that calls this endpoint
 * - src/lib/api/fetcher.ts - Generic hybrid fetching mechanism
 */

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

/**
 * Local mock API endpoint for footer data
 * Used for development and testing when backend is not available
 */
export async function GET(request: Request) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';
    
    // Load translations directly from message files
    // This ensures consistent translations between UI and API
    const messagesPath = path.join(process.cwd(), 'src', 'messages', `${lang}.json`);
    const messagesExist = fs.existsSync(messagesPath);
    
    // Fallback to English if requested language doesn't exist
    const finalLang = messagesExist ? lang : 'en';
    const finalPath = path.join(process.cwd(), 'src', 'messages', `${finalLang}.json`);
    
    // Read and parse the messages file
    const messagesContent = fs.readFileSync(finalPath, 'utf8');
    const messages = JSON.parse(messagesContent);
    
    // Get translated content from messages
    const footer = messages.footer || {};
    
    // Debug the loaded message data to ensure we have correct translations
    console.log(`[API/footer] Loaded message data for locale ${finalLang}:`, {
      hasFooter: !!footer,
      hasNewsletter: !!footer.newsletter,
      newsletterKeys: footer.newsletter ? Object.keys(footer.newsletter) : []
    });
    
    // Construct response using translations
    const footerData = {
      settings: null,
      sections: [
        {
          id: "company",
          title: footer.sections?.company?.title || (finalLang === 'en' ? "Company" : "الشركة"),
          links: [
            { 
              id: "about", 
              text: footer.sections?.company?.links?.about_us || (finalLang === 'en' ? "About Us" : "من نحن"), 
              url: "/about", 
              open_in_new_tab: false 
            },
            { 
              id: "services", 
              text: footer.sections?.company?.links?.services || (finalLang === 'en' ? "Services" : "خدماتنا"), 
              url: "/services", 
              open_in_new_tab: false 
            },
            { 
              id: "portfolio", 
              text: footer.sections?.company?.links?.portfolio || (finalLang === 'en' ? "Portfolio" : "معرض الأعمال"), 
              url: "/portfolio", 
              open_in_new_tab: false 
            }
          ]
        },
        {
          id: "resources",
          title: footer.sections?.resources?.title || (finalLang === 'en' ? "Resources" : "مصادر"),
          links: [
            { 
              id: "blog", 
              text: footer.sections?.resources?.links?.blog || (finalLang === 'en' ? "Blog" : "المدونة"), 
              url: "/blog", 
              open_in_new_tab: false 
            },
            { 
              id: "faq", 
              text: footer.sections?.resources?.links?.faq || (finalLang === 'en' ? "FAQ" : "الأسئلة الشائعة"), 
              url: "/faq", 
              open_in_new_tab: false 
            },
            { 
              id: "contact", 
              text: footer.sections?.resources?.links?.contact || (finalLang === 'en' ? "Contact" : "اتصل بنا"), 
              url: "/contact", 
              open_in_new_tab: false 
            }
          ]
        }
      ],
      social_links: [
        { id: "facebook", platform: "Facebook", url: "https://facebook.com/archway.egypt/", icon: "facebook" },
        { id: "instagram", platform: "Instagram", url: "https://instagram.com/archway.egypt", icon: "instagram" },
        { id: "linkedin", platform: "LinkedIn", url: "https://linkedin.com/company/archway-innovations", icon: "linkedin" }
      ],
      bottom_links: [
        { 
          id: "privacy", 
          text: footer.privacyPolicy || (finalLang === 'en' ? "Privacy Policy" : "سياسة الخصوصية"), 
          url: "/privacy", 
          open_in_new_tab: false 
        },
        { 
          id: "terms", 
          text: footer.termsOfService || (finalLang === 'en' ? "Terms of Service" : "شروط الخدمة"), 
          url: "/terms", 
          open_in_new_tab: false 
        }
      ],
      company_name: footer.companyInfo?.name || "Archway Innovations",
      description: footer.companyInfo?.description || (finalLang === 'en' 
        ? "We create stunning interior designs for modern homes and offices" 
        : "نصمم تصاميم داخلية مذهلة للمنازل والمكاتب الحديثة"),
      copyright_text: footer.copyright || (finalLang === 'en' 
        ? "© 2025 Archway Innovations. All rights reserved." 
        : "© 2025 آركواي للابتكارات. جميع الحقوق محفوظة."),
      show_newsletter: true,
      newsletter_text: footer.newsletter?.description || (finalLang === 'en' 
        ? "Stay updated with our latest news and offers." 
        : "ابق على اطلاع بأحدث أخبارنا وعروضنا."),
      newsletter_label: footer.newsletter?.title || (finalLang === 'en' 
        ? "Subscribe to Our Newsletter" 
        : "اشترك في نشرتنا الإخبارية"),
      contact_title: footer.contactUs || (finalLang === 'en' ? "Contact Us" : "اتصل بنا"),
      contact_info: [
        { id: "email", type: "email", value: "info@archwayeg.com", icon: "email" },
        { id: "phone", type: "phone", value: "+201150000183", icon: "phone" },
        { id: "address", type: "address", value: finalLang === 'en' 
          ? "VILLA 65, Ground floor, Near El Banafseg 5, NEW CAIRO, EGYPT, Cairo, Egypt" 
          : "فيلا ٦٥، الدور الأرضي، بالقرب من البنفسج ٥، القاهرة الجديدة، مصر، القاهرة، مصر", 
          icon: "location" 
        }
      ]
    };

    // Debug the constructed response
    console.log(`[API/footer] Constructed response for locale ${finalLang}:`, {
      newsletterLabel: footerData.newsletter_label,
      newsletterText: footerData.newsletter_text
    });

    // Return mock data
    return NextResponse.json(footerData);
  } catch (error) {
    console.error('Error in footer mock API:', error);
    
    // Return a properly formatted error response
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Internal server error',
        status: 'error'
      }, 
      { status: 500 }
    );
  }
} 