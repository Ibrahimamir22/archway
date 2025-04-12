'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import { 
  useFooter, 
  useNewsletterSubscription, 
  FooterSection as FooterSectionType 
} from '@/hooks/useFooter';
import LoadingState from './LoadingState';
import ErrorMessage from './ErrorMessage';

// Newsletter subscription form component
const NewsletterForm = () => {
  const { t } = useTranslation('common');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{text: string; isError: boolean} | null>(null);
  const { subscribeToNewsletter } = useNewsletterSubscription();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({
        text: t('footer.newsletter.emailRequired'),
        isError: true
      });
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({
        text: t('footer.newsletter.invalidEmail'),
        isError: true
      });
      return;
    }
    
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const result = await subscribeToNewsletter(email);
      
      if (result.success) {
        setMessage({
          text: t('footer.newsletter.successMessage'),
          isError: false
        });
        setEmail('');
      } else {
        setMessage({
          text: result.error || t('footer.newsletter.errorMessage'),
          isError: true
        });
      }
    } catch (error) {
      setMessage({
        text: t('footer.newsletter.errorMessage'),
        isError: true
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('footer.newsletter.placeholder') || "Enter your email"}
          className="px-4 py-2 bg-gray-800 text-white rounded focus:outline-none focus:ring-2 focus:ring-brand-blue"
          aria-label={t('footer.newsletter.placeholder') || "Email for newsletter"}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-brand-blue text-white rounded hover:bg-brand-blue-dark transition-colors disabled:opacity-50"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('common.submitting')}
            </span>
          ) : (
            t('footer.newsletter.subscribe') || "Subscribe"
          )}
        </button>
      </div>
      
      {message && (
        <p className={`mt-2 text-sm ${message.isError ? 'text-red-400' : 'text-green-400'}`}>
          {message.text}
        </p>
      )}
    </form>
  );
};

// Footer section component
const FooterSection = ({ section, isRtl }: { section: FooterSectionType; isRtl: boolean }) => {
  return (
    <div className={`col-span-1 ${isRtl ? 'text-right' : ''}`}>
      <h3 className="text-xl font-bold mb-4">{section.title}</h3>
      {section.links && section.links.length > 0 && (
        <ul className="space-y-2">
          {section.links.map((link) => (
            <li key={link.id}>
              {link.url.startsWith('/') || link.url.startsWith('#') ? (
                <Link 
                  href={link.url} 
                  className="text-gray-300 hover:text-white transition-colors"
                  target={link.open_in_new_tab ? '_blank' : undefined}
                  rel={link.open_in_new_tab ? 'noopener noreferrer' : undefined}
                >
                  {link.title}
                </Link>
              ) : (
                <a 
                  href={link.url} 
                  className="text-gray-300 hover:text-white transition-colors"
                  target={link.open_in_new_tab ? '_blank' : '_self'}
                  rel={link.open_in_new_tab ? 'noopener noreferrer' : undefined}
                >
                  {link.title}
                </a>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Social media icon component
const SocialIcon = ({ platform, url }: { platform: string; url: string }) => {
  // Get brand-specific color class based on platform
  const getBrandColorClass = (platform: string): string => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return 'group-hover:text-[#1877F2]'; // Facebook blue
      case 'twitter':
        return 'group-hover:text-[#1DA1F2]'; // Twitter blue
      case 'instagram':
        // Instagram has a gradient but we'll use a single color for simplicity
        return 'group-hover:text-[#E1306C]'; // Instagram pink/red
      case 'linkedin':
        return 'group-hover:text-[#0A66C2]'; // LinkedIn blue
      case 'youtube':
        return 'group-hover:text-[#FF0000]'; // YouTube red
      case 'pinterest':
        return 'group-hover:text-[#E60023]'; // Pinterest red
      case 'tiktok':
        return 'group-hover:text-[#69C9D0]'; // TikTok teal
      case 'behance':
        return 'group-hover:text-[#1769FF]'; // Behance blue
      case 'whatsapp':
        return 'group-hover:text-[#25D366]'; // WhatsApp green
      default:
        return 'group-hover:text-brand-blue'; // Default brand color
    }
  };
  
  // Icons mapping
  const getIcon = () => {
    switch (platform.toLowerCase()) {
      case 'facebook':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
          </svg>
        );
      case 'twitter':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
          </svg>
        );
      case 'instagram':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
          </svg>
        );
      case 'linkedin':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"></path>
          </svg>
        );
      case 'youtube':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"></path>
          </svg>
        );
      case 'pinterest':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"></path>
          </svg>
        );
      case 'behance':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M7.799 5.698c.589 0 1.12.051 1.606.156.482.102.894.273 1.241.507.344.235.612.546.804.938.188.387.281 1.871.281 1.443 0 .619-.141 1.137-.421 1.551-.284.414-.7.753-1.255 1.014.756.214 1.311.601 1.671 1.164.36.563.537 1.241.537 2.031 0 .619-.12 1.164-.358 1.637-.242.473-.57.863-.991 1.164-.419.3-.911.523-1.48.669-.567.143-1.179.217-1.835.217H1V5.698h6.799zm-.356 4.403c.481 0 .878-.114 1.192-.345.311-.228.463-.603.463-1.119 0-.286-.051-.522-.151-.707-.104-.185-.245-.322-.435-.415-.188-.093-.413-.155-.686-.18-.276-.026-.563-.041-.863-.041H3.682v2.807h3.761zm.221 4.89c.343 0 .643-.034.901-.103.26-.07.476-.176.654-.324.174-.145.313-.337.407-.568.095-.228.143-.508.143-.836 0-.66-.221-1.15-.664-1.458-.445-.309-1.023-.463-1.728-.463h-4.06v3.752h4.347zm11.426-9.113h-4.221v1.036h4.221v-1.036zm-5.247 6.526c.087.33.218.635.397.908.178.273.409.495.695.664.286.17.615.253.989.253.503 0 .937-.101 1.29-.305.357-.203.639-.504.853-.896h2.814c-.3.966-.839 1.722-1.611 2.253-.774.532-1.694.797-2.761.797-.854 0-1.613-.137-2.28-.415-.666-.277-1.222-.67-1.681-1.174a5.252 5.252 0 01-1.03-1.844c-.238-.716-.357-1.504-.357-2.363 0-.83.119-1.606.357-2.327.236-.721.586-1.349 1.03-1.878.444-.53 1-.946 1.667-1.241.667-.296 1.438-.445 2.314-.445.939 0 1.751.183 2.431.541.681.36 1.229.836 1.643 1.429.414.595.704 1.256.865 1.991.165.734.217 1.456.162 2.29.414z"></path>
          </svg>
        );
      case 'whatsapp':
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.36-.214-3.742.982.998-3.648-.235-.374a9.868 9.868 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"></path>
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"></path>
          </svg>
        );
    }
  };
  
  const brandColorClass = getBrandColorClass(platform);
  
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={platform}
      className="group"
    >
      <div className={`text-gray-300 hover:text-white ${brandColorClass} transition-colors duration-300 transform hover:scale-110`}>
        {getIcon()}
      </div>
    </a>
  );
};

// Company info component
const CompanyInfo = ({ 
  settings, 
  socialMedia, 
  isRtl 
}: { 
  settings: any; 
  socialMedia: any[]; 
  isRtl: boolean 
}) => {
  const { t } = useTranslation('common');
  
  return (
    <div className={`col-span-1 md:col-span-1 ${isRtl ? 'text-right' : ''}`}>
      <h3 className="text-xl font-bold mb-4">{settings?.company_name || 'Archway Design'}</h3>
      {settings?.description && (
        <p className="text-gray-300 mb-4 leading-relaxed">{settings.description}</p>
      )}
      
      {socialMedia && socialMedia.length > 0 && (
        <div className={`mt-6 ${isRtl ? 'text-right' : ''}`}>
          <h4 className="text-lg font-medium mb-4">{t('footer.followUs')}</h4>
          <div className={`flex ${isRtl ? 'justify-end space-x-reverse' : ''} gap-5`}>
            {socialMedia.map((social) => (
              <SocialIcon 
                key={social.id} 
                platform={social.platform} 
                url={social.url} 
              />
            ))}
          </div>
        </div>
      )}
      
      {settings?.show_newsletter && (
        <div className="mt-8">
          <h4 className="text-lg font-medium mb-3">
            {settings.newsletter_text || t('footer.newsletter.title')}
          </h4>
          <NewsletterForm />
        </div>
      )}
    </div>
  );
};

// Contact info component
const ContactInfo = ({ settings, isRtl }: { settings: any; isRtl: boolean }) => {
  const { t } = useTranslation('common');
  
  if (!settings) return null;
  
  // Function to generate Google Maps URL from address
  const getGoogleMapsUrl = (address: string) => {
    if (!address) return '#';
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };
  
  return (
    <div className={`col-span-1 ${isRtl ? 'text-right' : ''}`}>
      <h3 className="text-xl font-bold mb-4">{t('header.contact')}</h3>
      <ul className="space-y-4">
        {settings.address && (
          <a 
            href={getGoogleMapsUrl(settings.address)} 
            target="_blank" 
            rel="noopener noreferrer"
            className={`${isRtl ? 'flex-row-reverse' : 'flex'} flex items-start group p-2 -m-2 rounded-lg transition-all duration-300 cursor-pointer`}
            aria-label={`${t('footer.viewOnMap')}: ${settings.address}`}
          >
            <span className={`flex-shrink-0 mt-1 ${isRtl ? 'ms-3' : 'me-3'}`}>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:brightness-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </span>
            <div className="flex-1">
              <p className="font-medium text-gray-300 group-hover:text-white group-hover:brightness-110 transition-colors duration-300">{t('footer.address')}</p>
              <span className="text-gray-300 group-hover:text-white group-hover:brightness-110 group-hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] transition-all duration-300">
                {settings.address}
              </span>
            </div>
          </a>
        )}
        
        {settings.email && (
          <a 
            href={`mailto:${settings.email}`}
            className={`${isRtl ? 'flex-row-reverse' : 'flex'} flex items-start group p-2 -m-2 rounded-lg transition-all duration-300 cursor-pointer`}
            aria-label={`${t('footer.sendEmail')}: ${settings.email}`}
          >
            <span className={`flex-shrink-0 mt-1 ${isRtl ? 'ms-3' : 'me-3'}`}>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:brightness-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
              </svg>
            </span>
            <div className="flex-1">
              <p className="font-medium text-gray-300 group-hover:text-white group-hover:brightness-110 transition-colors duration-300">{t('footer.email')}</p>
              <span className="text-gray-300 group-hover:text-white group-hover:brightness-110 group-hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] transition-all duration-300">
                {settings.email}
              </span>
            </div>
          </a>
        )}
        
        {settings.phone && (
          <a 
            href={`tel:${settings.phone.replace(/\s+/g, '')}`}
            className={`${isRtl ? 'flex-row-reverse' : 'flex'} flex items-start group p-2 -m-2 rounded-lg transition-all duration-300 cursor-pointer`}
            aria-label={`${t('footer.callUs')}: ${settings.phone}`}
          >
            <span className={`flex-shrink-0 mt-1 ${isRtl ? 'ms-3' : 'me-3'}`}>
              <svg className="w-5 h-5 text-gray-300 group-hover:text-white group-hover:brightness-110 transition-all duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
              </svg>
            </span>
            <div className="flex-1">
              <p className="font-medium text-gray-300 group-hover:text-white group-hover:brightness-110 transition-colors duration-300">{t('footer.phone')}</p>
              <span className="text-gray-300 group-hover:text-white group-hover:brightness-110 group-hover:drop-shadow-[0_0_2px_rgba(255,255,255,0.3)] transition-all duration-300">
                {settings.phone}
              </span>
            </div>
          </a>
        )}
      </ul>
    </div>
  );
};

// Main Footer component
const Footer = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const { locale } = router;
  const isRtl = locale === 'ar';
  
  // Fetch footer data using the hook
  const { 
    settings, 
    sections, 
    socialMedia, 
    isLoading, 
    error 
  } = useFooter();
  
  // Show fallback content if data is loading or there's an error
  if (isLoading) {
    return (
      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="container-custom">
          <LoadingState type="text" className="text-white" />
          <div className="text-center mt-4">{t('common.loading')}</div>
        </div>
      </footer>
    );
  }
  
  if (error) {
    console.error('Error loading footer:', error);
    // Show basic footer in case of error
    return (
      <footer className="bg-gray-900 text-white pt-12 pb-6">
        <div className="container-custom">
          <div className="text-center py-4">
            <p className="text-red-400 mb-2">{t('common.errorLoading')}</p>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-6 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Archway</p>
          </div>
        </div>
      </footer>
    );
  }
  
  // Calculate the grid columns based on available sections
  const totalSections = (settings ? 1 : 0) + (sections?.length || 0) + 1; // +1 for contact info
  const gridCols = totalSections <= 2 ? 'grid-cols-1 md:grid-cols-2' :
                   totalSections === 3 ? 'grid-cols-1 md:grid-cols-3' :
                   'grid-cols-1 md:grid-cols-4';
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container-custom">
        <div className={`grid ${gridCols} gap-8`}>
          {/* Company Info */}
          {settings && (
            <CompanyInfo 
              settings={settings} 
              socialMedia={socialMedia} 
              isRtl={isRtl} 
            />
          )}
          
          {/* Dynamic sections from database */}
          {sections.map((section) => (
            <FooterSection 
              key={section.id} 
              section={section} 
              isRtl={isRtl} 
            />
          ))}
          
          {/* Contact Info */}
          {settings && (
            <ContactInfo 
              settings={settings} 
              isRtl={isRtl} 
            />
          )}
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
          <p>{settings?.copyright_text || `© ${new Date().getFullYear()} Archway Design. ${t('footer.allRightsReserved')}`}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 