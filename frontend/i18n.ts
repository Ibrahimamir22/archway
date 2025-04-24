import {getRequestConfig} from 'next-intl/server';
import { notFound } from 'next/navigation';

// Can be imported from a shared config
export const locales = ['en', 'ar'];
export const defaultLocale = 'en';

export default getRequestConfig(async ({locale}) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    // Option 1: Log warning and use default (good for build)
    console.warn(`Invalid locale "${locale}" requested. Falling back to default locale "${defaultLocale}".`);
    // Option 2: Trigger a 404 (use if middleware isn't catching this)
    // notFound(); 
  }

  // Use the validated locale or fallback to defaultLocale if invalid
  const finalLocale = locales.includes(locale as any) ? locale : defaultLocale;

  let messages;
  try {
    messages = (await import(`./src/messages/${finalLocale}.json`)).default;
  } catch (error) {
    console.error(`Failed to load messages for locale: ${finalLocale}`, error);
    // If default fails, maybe throw or return empty messages
    if (finalLocale !== defaultLocale) {
        console.warn(`Attempting to load default locale messages (${defaultLocale}) as a last resort.`);
         try {
             messages = (await import(`./src/messages/${defaultLocale}.json`)).default;
         } catch (defaultError) {
            console.error(`FATAL: Failed to load default messages (${defaultLocale}).`, defaultError);
            messages = {}; // Assign empty messages on fatal error
         }
    } else {
        messages = {}; // Assign empty messages if default locale failed initially
    }
  }

  // Return the locale along with the messages
  return {
    locale: finalLocale, 
    messages
  };
}); 