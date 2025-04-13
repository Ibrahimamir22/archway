import React, { useState, useEffect } from 'react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import Link from 'next/link';
import FormInput from '@/components/common/FormInput/index';
import Button from '@/components/common/Button/index';

// Replace the API_BASE_URL with a more direct approach
const API_BASE_URL = typeof window !== 'undefined'
  ? '/api/proxy' // Use Next.js API route to proxy the request
  : 'http://backend:8000/api/v1';

// For debugging
console.log('Using API base URL:', API_BASE_URL);

// This is needed for proper Docker networking - when inside a container, we need to use the container name
const FRONTEND_API_BASE_URL = typeof window !== 'undefined' ? 
  (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1') : 
  'http://backend:8000/api/v1';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

interface ContactInfo {
  address_en: string;
  address_ar: string;
  email: string;
  phone: string;
  facebook_url: string;
  instagram_url: string;
}

const ContactPage: NextPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isRtl = router.locale === 'ar';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | 'rate-limit' | null>(null);
  const [csrfToken, setCsrfToken] = useState<string>('');
  const [contactInfo, setContactInfo] = useState<ContactInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
    reset,
    watch
  } = useForm<ContactFormData>({
    mode: 'onChange' // Enable real-time validation
  });
  
  // Get CSRF token on mount
  useEffect(() => {
    const getCsrfToken = async () => {
      try {
        // In production, this would use a dedicated endpoint to get a CSRF token
        // For now, we'll simulate it
        const token = Math.random().toString(36).substring(2, 15);
        setCsrfToken(token);
      } catch (error) {
        console.error('Error fetching CSRF token:', error);
      }
    };
    
    getCsrfToken();
  }, []);
  
  // Fetch contact info
  useEffect(() => {
    const fetchContactInfo = async () => {
      setLoading(true);
      setErrorMessage('');
      
      // Use hardcoded contact info as default
      const hardcodedInfo = {
        address_en: 'Villa 65, Ground Floor Near El Banafseg 5 New Cairo Cairo, Egypt',
        address_ar: 'فيلا 65، الدور الأرضي بالقرب من البنفسج 5 القاهرة الجديدة القاهرة، مصر',
        email: 'info@archwaydesign.com',
        phone: '+20 11 50000183',
        facebook_url: 'https://facebook.com/archwaydesign',
        instagram_url: 'https://instagram.com/archwaydesign'
      };
      
      try {
        // Use our Next.js API route instead of direct connection
        console.log('Fetching contact info via API route');
        const response = await fetch('/api/test-backend');
        
        if (response.ok) {
          const data = await response.json();
          console.log('Contact API route response:', data);
          
          if (data.success && data.backendConnectivity && data.backendConnectivity.data) {
            // Use the data that came from the backend
            setContactInfo(data.backendConnectivity.data);
            setLoading(false);
            return;
          }
        }
        
        // If we get here, API fetch failed or returned invalid data
        throw new Error('API fetch failed or returned invalid data');
        
      } catch (error) {
        console.log('Using hardcoded contact info fallback due to:', error);
        // Always fallback to hardcoded data
        setContactInfo(hardcodedInfo);
      } finally {
        setLoading(false);
      }
    };
    
    fetchContactInfo();
  }, [router.locale]);
  
  // Replace the existing onSubmit function with this simpler version that uses our server-side API endpoint
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    console.log('Form submission started with data:', data);
    
    try {
      // Use our ultra-simplified API endpoint to avoid any issues
      const response = await fetch('/api/simple-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone || '',
          message: data.message
        })
      });
      
      console.log('Server response status:', response.status);
      const responseText = await response.text();
      console.log('Raw response text:', responseText);
      
      // Try to parse as JSON if possible
      let responseData;
      try {
        responseData = JSON.parse(responseText);
        console.log('Parsed response data:', responseData);
      } catch (e) {
        console.log('Response is not valid JSON');
      }
      
      if (response.ok) {
        console.log('Form submission successful');
        setSubmitStatus('success');
        reset();
      } else {
        console.error('Form submission failed with status:', response.status);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Add another option to let users try an alternative method
  const handleAlternativeSubmit = async () => {
    try {
      // Get current form values
      const formValues = watch();
      setIsSubmitting(true);
      
      console.log('Trying alternative submission with:', formValues);
      
      // Try using axios instead
      const result = await axios.post(
        `${window.location.protocol}//${window.location.hostname}:8000/api/v1/contact/`,
        {
          name: formValues.name,
          email: formValues.email,
          phone: formValues.phone || "",
          message: formValues.message
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Alternative submission response:', result);
      
      if (result.status === 201 || result.status === 200) {
        setSubmitStatus('success');
        reset();
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Alternative submission failed:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Regular expression for Egyptian phone numbers (e.g., +201XXXXXXXXX or 01XXXXXXXXX)
  const phoneRegex = /^(\+201|01)[0-9]{9}$/;
  
  // Watch values for real-time validation feedback
  const watchedValues = watch();
  
  const renderContactInfo = () => {
    if (loading) {
      return (
        <div className="space-y-6 animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-1/2"></div>
          <div className="h-6 bg-gray-200 rounded w-2/3"></div>
        </div>
      );
    }
    
    if (!contactInfo) {
      return (
        <div className="text-center py-8">
          <p className="text-gray-500">{errorMessage || t('contact.infoUnavailable')}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Refresh
          </button>
        </div>
      );
    }
    
    const address = isRtl ? contactInfo.address_ar : contactInfo.address_en;
    
    // Format address for Google Maps query
    const formattedAddress = encodeURIComponent(address.replace(/\r\n|\n/g, ' '));
    const googleMapsUrl = `https://maps.google.com/?q=${formattedAddress}`;
    
    return (
      <div className="space-y-6">
        <div className="flex items-start">
          <div className={`${isRtl ? 'order-2 ms-4' : 'me-4'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
          </div>
          <div>
            <p className="font-medium">Address</p>
            <a 
              href={googleMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-brand-light hover:text-brand-accent transition-colors"
              aria-label="View location on Google Maps"
            >
              {address.split('\r\n').map((line, i) => (
                <React.Fragment key={i}>
                  {line}
                  {i < address.split('\r\n').length - 1 && <br />}
                </React.Fragment>
              ))}
            </a>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className={`${isRtl ? 'order-2 ms-4' : 'me-4'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div>
            <p className="font-medium">Email</p>
            <a 
              href={`mailto:${contactInfo.email}`} 
              className="text-brand-light hover:text-brand-accent transition-colors"
              aria-label="Send email"
            >
              {contactInfo.email}
            </a>
          </div>
        </div>
        
        <div className="flex items-start">
          <div className={`${isRtl ? 'order-2 ms-4' : 'me-4'}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
            </svg>
          </div>
          <div>
            <p className="font-medium">Phone</p>
            <a 
              href={`tel:${contactInfo.phone.replace(/\s+/g, '')}`} 
              className="text-brand-light hover:text-brand-accent transition-colors"
              aria-label="Call phone number"
            >
              {contactInfo.phone}
            </a>
          </div>
        </div>
        
        <div className={`mt-12`}>
          <h3 className={`text-xl font-medium mb-4 ${isRtl ? 'text-right' : ''}`}>Follow Us</h3>
          <div className={`flex ${isRtl ? 'space-x-reverse' : ''} space-x-4`}>
            {contactInfo.facebook_url && (
              <a href={contactInfo.facebook_url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-500 transition-colors" aria-label="Facebook">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
            )}
            {contactInfo.instagram_url && (
              <a href={contactInfo.instagram_url} target="_blank" rel="noopener noreferrer" className="text-white hover:text-pink-500 transition-colors" aria-label="Instagram">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <>
      <Head>
        <title>{t('contact.title')} | Archway Interior Design</title>
        <meta name="description" content="Get in touch with Archway Interior Design for your next project. We'd love to hear from you!" />
      </Head>
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className={`text-center mb-16 ${isRtl ? 'rtl' : ''}`}>
          <h1 className="text-4xl font-heading font-bold mb-4">{t('contact.title')}</h1>
          <p className="text-xl text-gray-600">{t('contact.subtitle')}</p>
          <div className="w-24 h-1 bg-brand-accent mx-auto mt-8"></div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Contact Info */}
              <div className="bg-brand-blue text-white p-8">
                <h2 className={`text-2xl font-heading font-semibold mb-6 ${isRtl ? 'text-right' : ''}`}>
                  Archway Design
                </h2>
                
                <div className={`${isRtl ? 'text-right' : ''}`}>
                  {renderContactInfo()}
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="p-8">
                <h2 className={`text-2xl font-heading font-semibold mb-6 ${isRtl ? 'text-right' : ''}`}>
                  {t('contact.title')}
                </h2>
                
                {submitStatus === 'success' ? (
                  <div className="text-center py-8">
                    <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 mb-6" role="alert">
                      <p className={`font-medium ${isRtl ? 'text-right' : ''}`}>{t('contact.success')}</p>
                    </div>
                    
                    <Link href="/" locale={router.locale}>
                      <Button variant="primary" className="mt-4" aria-label={t('contact.backToHome')}>
                        {t('contact.backToHome')}
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
                    <input type="hidden" name="_csrf" value={csrfToken} />
                    
                    <FormInput
                      label={t('contact.name')}
                      type="text"
                      rtl={isRtl}
                      error={errors.name?.message}
                      aria-label={t('contact.name')}
                      aria-invalid={errors.name ? "true" : "false"}
                      aria-required="true"
                      {...register('name', { 
                        required: t('validation.required'),
                      })}
                    />
                    
                    <FormInput
                      label={t('contact.email')}
                      type="email"
                      rtl={isRtl}
                      error={errors.email?.message}
                      aria-label={t('contact.email')}
                      aria-invalid={errors.email ? "true" : "false"}
                      aria-required="true"
                      {...register('email', { 
                        required: t('validation.required'),
                        pattern: { 
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, 
                          message: t('validation.invalidEmail')
                        }
                      })}
                    />
                    
                    <FormInput
                      label={t('contact.phone')}
                      type="tel"
                      rtl={isRtl}
                      error={errors.phone?.message}
                      aria-label={t('contact.phone')}
                      aria-invalid={errors.phone ? "true" : "false"}
                      {...register('phone', { 
                        pattern: { 
                          value: phoneRegex, 
                          message: t('validation.invalidPhone')
                        }
                      })}
                    />
                    
                    <div className="mb-4">
                      <label htmlFor="message" className={`block mb-2 font-medium text-gray-700 ${isRtl ? 'text-right' : ''}`}>
                        {t('contact.message')} <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors
                          ${errors.message ? 'border-red-500' : 'border-gray-300'} 
                          ${isRtl ? 'text-right' : ''}`}
                        dir={isRtl ? 'rtl' : 'ltr'}
                        aria-label={t('contact.message')}
                        aria-invalid={errors.message ? "true" : "false"}
                        aria-required="true"
                        {...register('message', { required: t('validation.required') })}
                      />
                      {errors.message && (
                        <p className={`text-red-600 text-sm mt-1 ${isRtl ? 'text-right' : ''}`} role="alert">
                          {errors.message.message}
                        </p>
                      )}
                    </div>
                    
                    <div className={isRtl ? 'text-right' : ''}>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                        className={isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}
                        aria-label={t('contact.submit')}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <svg className={`animate-spin ${isRtl ? 'ml-2 -mr-1' : '-ml-1 mr-2'} h-4 w-4 text-white`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('contact.sending')}
                          </span>
                        ) : (
                          t('contact.submit')
                        )}
                      </Button>
                      
                      {submitStatus === 'error' && (
                        <div className="mt-4">
                          <button 
                            type="button"
                            onClick={handleAlternativeSubmit}
                            className="mt-2 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition"
                            disabled={isSubmitting}
                          >
                            Try Alternative Method
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {submitStatus === 'error' && (
                      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mt-4 animate-fade-in" role="alert">
                        <p className={`font-medium ${isRtl ? 'text-right' : ''}`}>{t('contact.error')}</p>
                      </div>
                    )}
                    
                    {submitStatus === 'rate-limit' && (
                      <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg p-4 mt-4 animate-fade-in" role="alert">
                        <p className={`font-medium ${isRtl ? 'text-right' : ''}`}>{t('contact.rateLimitError')}</p>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}

export default ContactPage; 