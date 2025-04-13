import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { appWithTranslation } from 'next-i18next';
import Navbar from '@/components/common/Navbar/index';
import Footer from '@/components/common/Footer/index';
import { QueryClient, QueryClientProvider, DehydratedState } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useState, useEffect } from 'react';
import { Hydrate } from 'react-query/hydration';
// Import only the fonts that work correctly
import { Inter, Playfair_Display, Cairo, Tajawal } from 'next/font/google';

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

  // Create a static QueryClient instance to prevent rerenders
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 1,  // Reduce retries to speed up
        refetchOnWindowFocus: false,
        staleTime: 300000, // 5 minutes instead of 1
        cacheTime: 600000,  // 10 minutes
      },
    },
  }));

  // Improved route change handler with caching
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Prefetch common routes to reduce navigation delay
      router.prefetch('/portfolio');
      router.prefetch('/services');
      router.prefetch('/about');
      router.prefetch('/contact');
    }

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
      if (!queryClient.getQueryData(['footer', router.locale])) {
        queryClient.prefetchQuery(['footer', router.locale], async () => {
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
        const cachedData = queryClient.getQueryData(['projectDetail', slug, router.locale]) as any;
        
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
  }, [router, queryClient]);

  // Fix title element array warning
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const fixTitleElement = () => {
      const titleElement = document.querySelector('title');
      if (titleElement && Array.isArray(titleElement.childNodes) && titleElement.childNodes.length > 1) {
        const titleText = titleElement.textContent;
        titleElement.textContent = titleText;
      }
    };
    
    const handleRouteChangeComplete = () => {
      fixTitleElement();
    };
    
    fixTitleElement();
    router.events.on('routeChangeComplete', handleRouteChangeComplete);
    
    return () => {
      router.events.off('routeChangeComplete', handleRouteChangeComplete);
    };
  }, [router]);

  // Combine font variables - excluding problematic nunitoSans
  const fontClasses = `${inter.variable} ${playfair.variable} ${cairo.variable} ${tajawal.variable}`;

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
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