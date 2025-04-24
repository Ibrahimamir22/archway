'use client';

import { useRef, useId } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { MdEmail, MdPerson, MdSubject, MdMessage } from 'react-icons/md';
import { motion, AnimatePresence } from 'framer-motion';
import { useContactForm } from '@/lib/hooks/marketing/contact';
import { 
  FormField, 
  TextareaField, 
  SubmitButton,
  StatusMessage,
  PrivacyNote
} from './form';

/**
 * ContactForm component with enhanced UX, validation and accessibility
 */
export default function ContactForm() {
  const t = useTranslations('contact');
  const v = useTranslations('validation');
  const params = useParams();
  const locale = Array.isArray(params.locale) ? params.locale[0] : params.locale as string;
  const isRtl = locale === 'ar';
  
  const formRef = useRef<HTMLFormElement>(null);
  const nameId = useId();
  const emailId = useId();
  const subjectId = useId();
  const messageId = useId();
  const formHeadingId = useId();
  
  // Initialize the form hook with translations
  const {
    formData,
    focused,
    errors,
    touched,
    isSubmitting,
    isPending,
    submitStatus,
    handleFocus,
    handleBlur,
    handleChange,
    handleKeyDown,
    handleSubmit,
    isFieldValid,
    hasContent,
    shouldShowError,
    messageCharsRemaining,
    isMessageNearLimit,
    isMessageAtLimit
  } = useContactForm({
    messageMaxLength: 500,
    translations: {
      required: v('required'),
      invalidEmail: v('invalidEmail'),
      messageTooLong: t('messageTooLong') || 'Message is too long'
    }
  });

  return (
    <motion.div
      className="h-full flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.form 
        ref={formRef}
        onSubmit={handleSubmit}
        className="h-full flex flex-col rounded-xl overflow-hidden bg-gray-800/90 backdrop-blur-sm shadow-lg border border-gray-700 transition-all hover:shadow-xl"
        aria-labelledby={formHeadingId}
      dir={isRtl ? 'rtl' : 'ltr'}
        noValidate
    >
        <div className="p-6 md:p-8 flex-grow">
          <h2 id={formHeadingId} className="text-2xl font-heading font-bold mb-8 text-white">{t('sendMessage')}</h2>
        
        <AnimatePresence>
          {submitStatus.type && (
            <StatusMessage status={submitStatus} />
          )}
        </AnimatePresence>
        
          <div className="space-y-5 md:space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
            {/* Name Field */}
            <FormField 
              id={nameId}
              name="name"
              value={formData.name}
              label={t('nameLabel')}
              error={shouldShowError('name') ? errors.name : undefined}
                icon={<MdPerson className="w-5 h-5" aria-hidden="true" />}
              isValid={isFieldValid('name')}
              isRtl={isRtl}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
                required
                autoComplete="name"
            />
            
            {/* Email Field */}
            <FormField 
              id={emailId}
              name="email"
              value={formData.email}
              label={t('emailLabel')}
              error={shouldShowError('email') ? errors.email : undefined}
                icon={<MdEmail className="w-5 h-5" aria-hidden="true" />}
              isValid={isFieldValid('email')}
              isRtl={isRtl}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
                required
                autoComplete="email"
                inputMode="email"
                type="email"
            />
          </div>
          
          {/* Subject Field */}
          <FormField 
            id={subjectId}
            name="subject"
            value={formData.subject}
            label={t('subjectLabel')}
            error={shouldShowError('subject') ? errors.subject : undefined}
              icon={<MdSubject className="w-5 h-5" aria-hidden="true" />}
            isValid={isFieldValid('subject')}
            isRtl={isRtl}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
              required
              autoComplete="off"
          />
          
          {/* Message Field */}
          <TextareaField 
            id={messageId}
            name="message"
            value={formData.message}
            label={t('messageLabel')}
            error={shouldShowError('message') ? errors.message : undefined}
              icon={<MdMessage className="w-5 h-5" aria-hidden="true" />}
            maxLength={500}
            charsRemaining={messageCharsRemaining}
            isNearLimit={isMessageNearLimit}
            isAtLimit={isMessageAtLimit}
            isValid={isFieldValid('message')}
            isRtl={isRtl}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onChange={handleChange}
              required
          />
        </div>
      </div>
      
        <div className="px-6 md:px-8 pb-6 md:pb-8 pt-2">
        <SubmitButton 
          isSubmitting={isSubmitting}
          isPending={isPending}
          isRtl={isRtl}
          sendText={t('send')}
          sendingText={t('sending')}
        />
        
        {/* Privacy note */}
        <PrivacyNote text={t('privacyNote')} />
      </div>
    </motion.form>
    </motion.div>
  );
} 