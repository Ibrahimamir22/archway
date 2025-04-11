import React, { useState } from 'react';
import { NextPage } from 'next';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import FormInput from '@/components/common/FormInput';
import Button from '@/components/common/Button';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactPage: NextPage = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isRtl = router.locale === 'ar';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<ContactFormData>();
  
  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Simulate API call to backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In actual implementation, this would be a fetch call to the backend
      // const response = await fetch('/api/contact', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      
      setSubmitStatus('success');
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Regular expression for Egyptian phone numbers (e.g., +201XXXXXXXXX or 01XXXXXXXXX)
  const phoneRegex = /^(\+201|01)[0-9]{9}$/;
  
  return (
    <>
      <Head>
        <title>Contact Us | Archway Interior Design</title>
        <meta name="description" content="Get in touch with Archway Interior Design for your next project. We'd love to hear from you!" />
      </Head>
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
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
                
                <div className={`space-y-6 ${isRtl ? 'text-right' : ''}`}>
                  <div className="flex items-start">
                    <div className={`${isRtl ? 'order-2 me-4' : 'me-4'}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Address</p>
                      <p className="text-brand-light">123 Design Street, Cairo, Egypt</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className={`${isRtl ? 'order-2 me-4' : 'me-4'}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-brand-light">info@archwaydesign.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className={`${isRtl ? 'order-2 me-4' : 'me-4'}`}>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-brand-light">+20 123 456 7890</p>
                    </div>
                  </div>
                </div>
                
                <div className={`mt-12 ${isRtl ? 'text-right' : ''}`}>
                  <h3 className="text-xl font-medium mb-4">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a href="#" className="text-white hover:text-brand-accent transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                    </a>
                    <a href="#" className="text-white hover:text-brand-accent transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              {/* Contact Form */}
              <div className="p-8">
                <h2 className={`text-2xl font-heading font-semibold mb-6 ${isRtl ? 'text-right' : ''}`}>
                  {t('contact.title')}
                </h2>
                
                {submitStatus === 'success' ? (
                  <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg p-4 animate-fade-in">
                    <p className={`font-medium ${isRtl ? 'text-right' : ''}`}>{t('contact.success')}</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <input type="hidden" name="_csrf" value="{{csrfToken}}" />
                    
                    <FormInput
                      label={t('contact.name')}
                      type="text"
                      rtl={isRtl}
                      error={errors.name?.message}
                      {...register('name', { 
                        required: t('validation.required'),
                      })}
                    />
                    
                    <FormInput
                      label={t('contact.email')}
                      type="email"
                      rtl={isRtl}
                      error={errors.email?.message}
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
                      {...register('phone', { 
                        pattern: { 
                          value: phoneRegex, 
                          message: t('validation.invalidPhone')
                        }
                      })}
                    />
                    
                    <div className="mb-4">
                      <label htmlFor="message" className={`block mb-2 font-medium text-gray-700 ${isRtl ? 'text-right' : ''}`}>
                        {t('contact.message')}
                      </label>
                      <textarea
                        id="message"
                        rows={5}
                        className={`w-full px-4 py-2 border rounded focus:ring-2 focus:ring-brand-blue focus:border-brand-blue outline-none transition-colors
                          ${errors.message ? 'border-red-500' : 'border-gray-300'} 
                          ${isRtl ? 'text-right' : ''}`}
                        dir={isRtl ? 'rtl' : 'ltr'}
                        {...register('message', { required: t('validation.required') })}
                      />
                      {errors.message && (
                        <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>
                      )}
                    </div>
                    
                    <div className={isRtl ? 'text-right' : ''}>
                      <Button
                        type="submit"
                        variant="primary"
                        disabled={isSubmitting}
                        className={isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}
                      >
                        {isSubmitting ? (
                          <span className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t('contact.submit')}
                          </span>
                        ) : (
                          t('contact.submit')
                        )}
                      </Button>
                    </div>
                    
                    {submitStatus === 'error' && (
                      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mt-4 animate-fade-in">
                        <p className={`font-medium ${isRtl ? 'text-right' : ''}`}>{t('contact.error')}</p>
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