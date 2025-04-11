import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import FormInput from '@/components/common/FormInput';
import Button from '@/components/common/Button';
import ErrorMessage from '@/components/common/ErrorMessage';

interface SignupFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber?: string;
  location?: string;
  gdprConsent: boolean;
}

const SignupForm: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isRtl = router.locale === 'ar';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    watch,
    formState: { errors } 
  } = useForm<SignupFormData>();
  
  const password = watch('password', '');
  
  // Regular expression for Egyptian phone numbers (e.g., +201XXXXXXXXX or 01XXXXXXXXX)
  const phoneRegex = /^(\+201|01)[0-9]{9}$/;
  
  const onSubmit = async (data: SignupFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    
    try {
      // Simulate API call to backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In actual implementation, this would be a fetch call to the backend
      // const response = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      
      router.push('/login');
    } catch (error) {
      setServerError(t('auth.signupError'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={`max-w-md mx-auto p-6 bg-white rounded-lg shadow-md ${isRtl ? 'text-right' : ''}`}>
      <h2 className="text-2xl font-heading font-semibold mb-6">{t('auth.signup')}</h2>
      
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <p className="font-medium">{serverError}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" name="_csrf" value="{{csrfToken}}" />
        
        <FormInput
          label={t('auth.fullName')}
          type="text"
          rtl={isRtl}
          error={errors.fullName?.message}
          {...register('fullName', { 
            required: t('validation.required'),
          })}
        />
        
        <FormInput
          label={t('auth.email')}
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
          label={t('auth.password')}
          type="password"
          rtl={isRtl}
          error={errors.password?.message}
          {...register('password', { 
            required: t('validation.required'),
            minLength: {
              value: 8,
              message: t('validation.passwordMinLength')
            }
          })}
        />
        
        <FormInput
          label={t('auth.confirmPassword')}
          type="password"
          rtl={isRtl}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword', { 
            required: t('validation.required'),
            validate: value => value === password || t('validation.passwordMatch')
          })}
        />
        
        <FormInput
          label={t('auth.phoneNumber')}
          type="tel"
          rtl={isRtl}
          error={errors.phoneNumber?.message}
          {...register('phoneNumber', { 
            pattern: { 
              value: phoneRegex, 
              message: t('validation.invalidPhone')
            }
          })}
        />
        
        <FormInput
          label={t('auth.location')}
          type="text"
          rtl={isRtl}
          error={errors.location?.message}
          {...register('location')}
        />
        
        <div className="flex items-start mb-6">
          <div className="flex items-center h-5">
            <input
              id="gdprConsent"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-brand-blue"
              {...register('gdprConsent', { required: t('validation.required') })}
            />
          </div>
          <div className={`${isRtl ? 'me-2 text-right' : 'ms-2'}`}>
            <label htmlFor="gdprConsent" className="text-sm text-gray-700">
              {t('auth.gdprConsent')}{' '}
              <Link href="/terms" className="text-brand-blue hover:underline">
                {t('auth.termsAndPrivacy')}
              </Link>
            </label>
            {errors.gdprConsent && (
              <ErrorMessage message={errors.gdprConsent.message as string} />
            )}
          </div>
        </div>
        
        <div>
          <Button
            type="submit"
            variant="primary"
            fullWidth
            disabled={isSubmitting}
            className={isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('auth.signup')}
              </span>
            ) : (
              t('auth.signup')
            )}
          </Button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link href="/login" className="text-brand-blue hover:underline">
              {t('auth.login')}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignupForm;