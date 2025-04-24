import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from "next/navigation";
import { locales } from "@/../i18n"; // Adjust path if needed
import { Inter, Playfair_Display, Cairo, Tajawal } from 'next/font/google'; // Import fonts
import '@/styles/globals.css'; // Import from the correct styles directory
import Navbar from "@/components/common/Navbar/index"; // Import the full-featured Navbar
import Footer from "@/components/common/Footer"; // Assuming Footer is ready
import Providers from '@/components/providers/Providers';

// --- Font Definitions (from _app.tsx) ---
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair',
});

const cairo = Cairo({
  subsets: ['arabic'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cairo',
});

const tajawal = Tajawal({
  subsets: ['arabic'],
  display: 'swap',
  weight: ['300', '400', '500', '700'],
  variable: '--font-tajawal',
});
// --- End Font Definitions ---

// Define the props for the layout
interface RootLayoutProps {
  children: React.ReactNode;
  params: {
    locale: string;
  };
}

// Define metadata - using static metadata instead of generateMetadata
export const metadata: Metadata = {
  title: 'Archway Interior Design',
  description: 'Premium interior design services',
};

export default function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  // Validate locale
  if (!locales.includes(locale)) {
    console.error(`Invalid locale detected in layout: ${locale}`);
    notFound(); // Show 404 if locale is invalid
  }

  // Explicitly load messages for the current locale from the URL param
  let messages;
  try {
    // Dynamically import the messages for the validated locale
    messages = require(`@/../src/messages/${locale}.json`);
    console.log(`Layout: Successfully loaded messages for explicit locale: ${locale}`);
  } catch (error) {
    console.error(`Layout: Failed to load messages for explicit locale: ${locale}`, error);
    // Fallback or error handling - maybe try default locale?
    try {
      messages = require(`@/../src/messages/${locales[0]}.json`); // Try default locale
      console.warn(`Layout: Falling back to default locale messages: ${locales[0]}`);
    } catch (fallbackError) {
      console.error(`Layout: Failed to load default messages either.`, fallbackError);
      // If even default fails, provide empty messages or throw
      messages = {}; 
    }
  }

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // Combine font variables and determine base body font class
  const fontVariables = `${inter.variable} ${playfair.variable} ${cairo.variable} ${tajawal.variable}`;
  const bodyFontClass = locale === 'ar' ? cairo.className : inter.className;

  return (
    <div className={`${bodyFontClass} min-h-screen flex flex-col ${fontVariables}`} dir={dir}>
      <Providers>
        {/* Pass the explicitly loaded messages */}
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="Africa/Cairo">
          <Navbar />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </NextIntlClientProvider>
      </Providers>
    </div>
  );
} 