import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { appWithTranslation } from 'next-i18next';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import { useState, useEffect } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
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

  // Add a router change start event handler to preload project images
  useEffect(() => {
    const handleRouteChangeStart = (url: string) => {
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
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <div dir={dir} className={`min-h-screen flex flex-col ${locale === 'ar' ? 'font-cairo' : 'font-body'}`}>
        <Navbar />
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        <Footer />
      </div>
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}

export default appWithTranslation(MyApp); 