import Document, { Html, Head, Main, NextScript, DocumentContext, DocumentInitialProps } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    // Get locale from context (safely)
    let locale = 'en';
    let dir = 'ltr';
    
    // @ts-ignore - This is a valid property in Next.js Document but TypeScript doesn't recognize it
    if (this.props?.__NEXT_DATA__?.locale) {
      // @ts-ignore
      locale = this.props.__NEXT_DATA__.locale;
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
        </Head>
        <body className={`font-body ${locale === 'ar' ? 'font-cairo' : ''}`}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument; 