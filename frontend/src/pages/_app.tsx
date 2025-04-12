import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { appWithTranslation } from 'next-i18next';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { QueryClient, QueryClientProvider, DehydratedState } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useState, useEffect } from 'react';
import { Hydrate } from 'react-query/hydration';

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

  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        refetchOnWindowFocus: false,
        staleTime: 60000, // 1 minute
      },
    },
  }));

  // Add a router change start event handler to preload data
  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
      // Preload footer data for consistent experience across page transitions
      queryClient.prefetchQuery(['footer', router.locale], async () => {
        try {
          // Smart detection of environment to handle both browser and container contexts
          const isBrowser = typeof window !== 'undefined';
          const configuredUrl = process.env.NEXT_PUBLIC_API_URL;
          const API_BASE_URL = isBrowser && configuredUrl?.includes('backend')
            ? configuredUrl.replace('backend', 'localhost')
            : configuredUrl || (isBrowser ? 'http://localhost:8000/api/v1' : 'http://backend:8000/api/v1');
          
          const params = new URLSearchParams();
          params.append('lang', router.locale || 'en');
          
          // Dynamic import axios only when needed
          const { default: axios } = await import('axios');
          const response = await axios.get(`${API_BASE_URL}/footer/?${params.toString()}`);
          return response.data;
        } catch (error) {
          console.error('Error prefetching footer data:', error);
          return null;
        }
      });
      
      // Look for portfolio detail page navigation
      if (url.includes('/portfolio/') && !url.endsWith('/portfolio/')) {
        // Extract slug
        const slug = url.split('/portfolio/')[1].split('/')[0].split('?')[0];
        
        console.log(`Navigation to project detected: ${slug}`);
        
        // If we have the project data in cache, force preload its images
        const cachedData = queryClient.getQueryData(['projectDetail', slug, router.locale]) as any;
        
        if (cachedData && cachedData.images && Array.isArray(cachedData.images)) {
          console.log(`Found cached data for ${slug}, preloading ${cachedData.images.length} images`);
          
          // Force preload the images
          cachedData.images.forEach((image: any) => {
            if (image && image.src) {
              const img = new Image();
              img.src = image.src;
              console.log(`Pre-navigation preload: ${image.src}`);
            }
          });
        }
      }
    };
    
    router.events.on('routeChangeStart', handleRouteChangeStart);
    
    return () => {
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [router, queryClient]);

  return (
    <QueryClientProvider client={queryClient}>
      <Hydrate state={pageProps.dehydratedState}>
        <div dir={dir} className={`min-h-screen flex flex-col ${locale === 'ar' ? 'font-cairo' : 'font-body'}`}>
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

export default appWithTranslation(MyApp); 