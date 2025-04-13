import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { appWithTranslation } from 'next-i18next';
import dynamic from 'next/dynamic';
import { QueryClient, QueryClientProvider, DehydratedState } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useState, useEffect, useCallback } from 'react';
import { Hydrate } from 'react-query/hydration';
// Import only the fonts that work correctly
import { Inter, Playfair_Display, Cairo, Tajawal } from 'next/font/google';
import Head from 'next/head';

// Dynamically import components that aren't needed for initial paint
const Navbar = dynamic(() => import('@/components/common/Navbar/index'), { ssr: true });
const Footer = dynamic(() => import('@/components/common/Footer/index'), { ssr: true });

// Define fonts with subsets and weights
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

// Configure the QueryClient outside of the component
const defaultQueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 300000, // 5 minutes
      cacheTime: 600000,  // 10 minutes
    },
  },
});

// Separate component for DefaultSeo to avoid JSX runtime issues
const DefaultSeo = () => {
  return (
    <Head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      <meta charSet="UTF-8" />
      <title>Archway Interior Design</title>
    </Head>
  );
};

// Extend AppProps with custom properties
interface MyAppProps extends AppProps {
  pageProps: {
    dehydratedState?: DehydratedState;
    [key: string]: any;
  };
}

function MyApp({ Component, pageProps }: MyAppProps) {
  const router = useRouter();
  const { locale } = router;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  // Modern prefetching and language optimizations
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Use the modern router prefetch method
    const prefetchRoutes = async () => {
      // Preload the other language files
      const otherLocale = router.locale === 'en' ? 'ar' : 'en';
      
      // Main navigation routes in current language
      await Promise.all([
        router.prefetch('/portfolio', undefined, { locale: router.locale }),
        router.prefetch('/services', undefined, { locale: router.locale }),
        router.prefetch('/about', undefined, { locale: router.locale }),
        router.prefetch('/contact', undefined, { locale: router.locale })
      ]);
      
      // Preload same page in other language
      const currentPath = router.pathname;
      router.prefetch(currentPath, undefined, { locale: otherLocale });
      
      // Secondary routes if needed
      setTimeout(() => {
        router.prefetch('/404');
        router.prefetch('/_error');
      }, 2000);
    };
    
    prefetchRoutes();

    // Mounting status for memory leak prevention
    let isMounted = true;
    
    const handleRouteChangeStart = (url: string) => {
      // Skip if unmounted
      if (!isMounted) return;
      
      // Clear any loading timeouts
      if (typeof window !== 'undefined' && window.loadingTimeout) {
        clearTimeout(window.loadingTimeout);
        window.loadingTimeout = null;
      }
      
      // Check cached data before prefetching
      if (!defaultQueryClient.getQueryData(['footer', router.locale])) {
        defaultQueryClient.prefetchQuery(['footer', router.locale], async () => {
          try {
            // Use consistent API URL
            const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 
              (typeof window !== 'undefined' ? 'http://localhost:8000/api/v1' : 'http://backend:8000/api/v1');
            
            const params = new URLSearchParams();
            params.append('lang', router.locale || 'en');
            
            // Efficient dynamic import
            const axios = (await import('axios')).default;
            const response = await axios.get(`${API_BASE_URL}/footer/?${params.toString()}`);
            return response.data;
          } catch (error) {
            console.error('Error prefetching footer data:', error);
            // Return fallback data when API fails
            return {
              copyright: "© Archway Innovations",
              social_links: []
            };
          }
        });
      }
      
      // Only preload crucial portfolio details
      if (url.includes('/portfolio/') && !url.endsWith('/portfolio/')) {
        const slug = url.split('/portfolio/')[1]?.split(/[/?#]/)[0];
        if (!slug) return;
        
        // Check cache first
        const cachedData = defaultQueryClient.getQueryData(['projectDetail', slug, router.locale]) as any;
        
        if (cachedData?.images?.length) {
          // Preload only the first image to reduce load time
          const firstImage = cachedData.images[0];
          if (firstImage?.src) {
            const img = new Image();
            img.src = firstImage.src;
          }
        }
      }
    };
    
    router.events.on('routeChangeStart', handleRouteChangeStart);
    
    return () => {
      isMounted = false;
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [router]);

  // Combine font variables - excluding problematic nunitoSans
  const fontClasses = `${inter.variable} ${playfair.variable} ${cairo.variable} ${tajawal.variable}`;

  return (
    <QueryClientProvider client={defaultQueryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <DefaultSeo />
        <div dir={dir} className={`${fontClasses} min-h-screen flex flex-col ${locale === 'ar' ? 'font-cairo' : 'font-sans'}`}>
          <Navbar />
          <main className="flex-grow">
            <Component {...pageProps} />
          </main>
          <Footer />
        </div>
        {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
      </Hydrate>
    </QueryClientProvider>
  );
}

// Add this to the global Window interface
declare global {
  interface Window {
    loadingTimeout: NodeJS.Timeout | null;
  }
}

export default appWithTranslation(MyApp); 