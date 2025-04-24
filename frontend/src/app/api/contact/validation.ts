import { ContactFormData, ContactFormErrors } from "@/types/marketing/contact";

/**
 * Validates contact form data
 * @param data Form data to validate
 * @returns Object containing validation results
 */
export function validateContactForm(data: Partial<ContactFormData>) {
  const errors: ContactFormErrors = {};
  let isValid = true;

  // Check required fields
  if (!data.name || data.name.trim() === '') {
    errors.name = 'Name is required';
    isValid = false;
  }

  if (!data.email || data.email.trim() === '') {
    errors.email = 'Email is required';
    isValid = false;
  } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.email = 'Invalid email format';
    isValid = false;
  }

  if (!data.subject || data.subject.trim() === '') {
    errors.subject = 'Subject is required';
    isValid = false;
  }

  if (!data.message || data.message.trim() === '') {
    errors.message = 'Message is required';
    isValid = false;
  }

  return { isValid, errors };
} 