import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
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

export default async function RootLayout({
  children,
  params: { locale },
}: RootLayoutProps) {
  // Validate locale
  if (!locales.includes(locale)) {
    notFound(); // Show 404 if locale is invalid
  }

  // Properly fetch messages using next-intl's server function
  const messages = await getMessages({ locale });

  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // Combine font variables and determine base body font class
  const fontVariables = `${inter.variable} ${playfair.variable} ${cairo.variable} ${tajawal.variable}`;
  const bodyFontClass = locale === 'ar' ? cairo.className : inter.className;

  return (
    <div className={`${bodyFontClass} min-h-screen flex flex-col ${fontVariables}`} dir={dir}>
      <Providers>
        {/* Use the messages fetched by getMessages */}
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