import {getRequestConfig} from 'next-intl/server';
import { notFound } from 'next/navigation';

// Can be imported from a shared config
export const locales = ['en', 'ar'];
export const defaultLocale = 'en';

// Cache for messages to avoid repeated imports
const messagesCache: Record<string, any> = {};

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    // Use default locale silently without warnings that slow down the app
    locale = defaultLocale;
  }

  // Use the validated locale
  const finalLocale = locale;

  // Check if messages are already in cache
  if (messagesCache[finalLocale]) {
    return {
      locale: finalLocale,
      messages: messagesCache[finalLocale]
    };
  }

  // Load messages
  let messages;
  try {
    // Dynamic import with proper error handling
    messages = (await import(`./src/messages/${finalLocale}.json`)).default;
    
    // Cache the messages for future use
    messagesCache[finalLocale] = messages;
  } catch (error) {
    // Silent error handling in production, only log in development
    if (process.env.NODE_ENV !== 'production') {
      console.error(`Failed to load messages for locale: ${finalLocale}`, error);
    }
    
    // Fall back to default locale if needed
    if (finalLocale !== defaultLocale) {
      try {
        messages = (await import(`./src/messages/${defaultLocale}.json`)).default;
        messagesCache[defaultLocale] = messages;
      } catch (defaultError) {
        // Last resort: empty messages object
        messages = {};
      }
    } else {
      messages = {};
    }
  }

  // Return the locale along with the messages
  return {
    locale: finalLocale, 
    messages,
    // Add timeZone for better date/time handling
    timeZone: 'UTC',
    // Add default formats for better performance
    formats: {
      dateTime: {
        short: {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }
      }
    },
    // Set a default namespace to reduce lookup time
    defaultNamespace: 'common'
  };
}); 