import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import FormInput from '@/components/common/FormInput';
import Button from '@/components/common/Button';

interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm: React.FC = () => {
  const { t } = useTranslation('common');
  const router = useRouter();
  const isRtl = router.locale === 'ar';
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormData>();
  
  const onSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    setServerError(null);
    
    try {
      // Simulate API call to backend
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In actual implementation, this would be a fetch call to the backend
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      
      router.push('/');
    } catch (error) {
      setServerError(t('auth.loginError'));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className={`max-w-md mx-auto p-6 bg-white rounded-lg shadow-md ${isRtl ? 'text-right' : ''}`}>
      <h2 className="text-2xl font-heading font-semibold mb-6">{t('auth.login')}</h2>
      
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
          <p className="font-medium">{serverError}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <input type="hidden" name="_csrf" value="{{csrfToken}}" />
        
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
            required: t('validation.required')
          })}
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="rememberMe"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-brand-blue"
                {...register('rememberMe')}
              />
            </div>
            <div className={`${isRtl ? 'me-2' : 'ms-2'}`}>
              <label htmlFor="rememberMe" className="text-sm text-gray-700">
                {t('auth.rememberMe')}
              </label>
            </div>
          </div>
          <Link href="/forgot-password" className="text-sm text-brand-blue hover:underline">
            {t('auth.forgotPassword')}
          </Link>
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
                {t('auth.login')}
              </span>
            ) : (
              t('auth.login')
            )}
          </Button>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            {t('auth.noAccount')}{' '}
            <Link href="/signup" className="text-brand-blue hover:underline">
              {t('auth.signup')}
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default LoginForm; 