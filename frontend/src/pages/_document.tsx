import { Html, Head, Main, NextScript } from 'next/document';
import { NextPage } from 'next';

// Use functional component pattern instead of class component
const MyDocument: NextPage = (props: any) => {
  // Get locale from context (safely)
  let locale = 'en';
  let dir = 'ltr';
  
  // Access NextJS data from props
  if (props?.__NEXT_DATA__?.locale) {
    locale = props.__NEXT_DATA__.locale;
    dir = locale === 'ar' ? 'rtl' : 'ltr';
  }
  
  return (
    <Html lang={locale} dir={dir}>
      <Head>
        {/* Performance optimizations */}
        {/* Preconnect to origins */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        
        {/* Preload critical assets */}
        <link rel="preload" href="/fonts/critical.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        
        {/* Critical CSS inline */}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root{--font-nunito:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;--font-cairo:"Cairo",ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;--font-playfair:"Playfair Display",ui-serif,Georgia,Cambria,"Times New Roman",Times,serif;--font-inter:"Inter",ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif}body{font-family:var(--font-nunito);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;text-rendering:optimizeLegibility}[dir=rtl]{font-family:var(--font-cairo)}.container-custom{width:100%;margin-right:auto;margin-left:auto;padding-right:1rem;padding-left:1rem}@media (min-width:640px){.container-custom{padding-right:1.5rem;padding-left:1.5rem}}@media (min-width:1024px){.container-custom{padding-right:2rem;padding-left:2rem}}
          `
        }} />
        
        {/* Optimized URL normalization script */}
        <script dangerouslySetInnerHTML={{
          __html: `
            // More efficient backend URL normalization
            (function() {
              if (typeof window !== 'undefined') {
                // Run only once using a more efficient selector
                const fixBackendUrls = () => {
                  const elements = document.querySelectorAll('link[rel="preload"][href*="backend:8000"], meta[content*="backend:8000"]');
                  elements.forEach(el => {
                    if (el.hasAttribute('href')) {
                      el.setAttribute('href', el.getAttribute('href').replace(/backend:8000/g, 'localhost:8000'));
                    } else if (el.hasAttribute('content')) {
                      el.setAttribute('content', el.getAttribute('content').replace(/backend:8000/g, 'localhost:8000'));
                    }
                  });
                };
                
                // Execute immediately
                fixBackendUrls();
                
                // Clean up the event listener after it runs once
                const onLoad = () => {
                  fixBackendUrls();
                  document.removeEventListener('DOMContentLoaded', onLoad);
                };
                document.addEventListener('DOMContentLoaded', onLoad);
              }
            })();
          `
        }} />
        
        {/* Google Fonts */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700&display=swap"
          rel="stylesheet"
        />
        
        {/* Preload critical service images immediately */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Immediate image preloading script - executed before any React code
              // This forces images to load from server before React even starts
              (function() {
                // Create elements at the top of the script in head
                var img = new Image();
                img.src = 'http://localhost:8000/media/services/IMG_1428.jpg';
                
                // Create a static visible element in head for immediate loading
                var hiddenDiv = document.createElement('div');
                hiddenDiv.style.position = 'absolute';
                hiddenDiv.style.top = '0';
                hiddenDiv.style.left = '0';
                hiddenDiv.style.width = '1px';
                hiddenDiv.style.height = '1px';
                hiddenDiv.style.overflow = 'hidden';
                hiddenDiv.appendChild(img);
                document.head.appendChild(hiddenDiv);
                
                // Add as explicit preload link too
                var link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = 'http://localhost:8000/media/services/IMG_1428.jpg';
                document.head.appendChild(link);
                
                // Second attempt when body is available
                document.addEventListener('DOMContentLoaded', function() {
                  // Create explicit image in body
                  var bodyImg = new Image();
                  bodyImg.src = 'http://localhost:8000/media/services/IMG_1428.jpg';
                  bodyImg.style.position = 'absolute';
                  bodyImg.style.opacity = '0';
                  bodyImg.style.width = '1px';
                  bodyImg.style.height = '1px';
                  document.body.appendChild(bodyImg);
                });
              })();
            `
          }}
        />
      </Head>
      <body className={`font-body ${locale === 'ar' ? 'font-cairo' : ''}`}>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};

export default MyDocument; 