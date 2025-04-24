/**
 * Types for the contact form and related components
 */

/**
 * Contact form field data
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Form field validation errors
 */
export interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

/**
 * Form submission state
 */
export interface SubmitStatus {
  type: 'success' | 'error' | null;
  message: string;
}

/**
 * Form fields that can be focused
 */
export type FormFieldName = keyof ContactFormData;

/**
 * Result of a form submission attempt
 */
export interface ContactSubmitResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Contact information data model
 */
export interface ContactInfoData {
  address_en?: string;
  address_ar?: string;
  email?: string;
  phone?: string;
  facebook_url?: string;
  instagram_url?: string;
  map_url?: string;
  directions_url?: string;
  working_hours_en?: string;
  working_hours_ar?: string;
}

/**
 * Props for form field components
 */
export interface FormFieldProps {
  id: string;
  name: FormFieldName;
  value: string;
  label: string;
  error?: string;
  icon: React.ReactNode;
  isRequired?: boolean;
  isValid?: boolean;
  isRtl?: boolean;
  onFocus: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

/**
 * Props specific to the textarea field
 */
export interface TextareaFieldProps extends FormFieldProps {
  maxLength?: number;
  charsRemaining?: number;
  isNearLimit?: boolean;
  isAtLimit?: boolean;
} 