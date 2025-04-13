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
      // @ts-ignore - These are valid Next.js Document components
      <Html lang={locale} dir={dir}>
        {/* @ts-ignore */}
        <Head>
          {/* Removed external Google Fonts link as fonts are already loaded via next/font in _app.tsx */}
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
        <body className={`font-body ${locale === 'ar' ? 'font-tajawal' : ''}`}>
          {/* @ts-ignore */}
          <Main />
          {/* @ts-ignore */}
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument; 