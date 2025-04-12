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
          <link 
            href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Nunito+Sans:wght@300;400;500;600;700&family=Noto+Serif+Arabic:wght@400;500;600;700&family=Noto+Sans+Arabic:wght@300;400;500;600;700&family=Tajawal:wght@300;400;500;700&family=Cairo:wght@300;400;500;600;700&display=swap" 
            rel="stylesheet" 
          />
          {/* Early URL normalization script */}
          <script dangerouslySetInnerHTML={{
            __html: `
              // This script runs very early to normalize backend URLs
              (function() {
                // Normalize image URLs in meta tags and preloaded resources
                function fixBackendUrls() {
                  // Find all link elements with rel=preload
                  const preloads = document.querySelectorAll('link[rel="preload"]');
                  preloads.forEach(link => {
                    const href = link.getAttribute('href');
                    if (href && href.includes('backend:8000')) {
                      link.setAttribute('href', href.replace(/backend:8000/g, 'localhost:8000'));
                    }
                  });
                  
                  // Fix image sources that might be in meta tags
                  const metas = document.querySelectorAll('meta');
                  metas.forEach(meta => {
                    const content = meta.getAttribute('content');
                    if (content && content.includes('backend:8000')) {
                      meta.setAttribute('content', content.replace(/backend:8000/g, 'localhost:8000'));
                    }
                  });
                }

                // Run immediately
                fixBackendUrls();
                
                // Also run when DOM is loaded
                document.addEventListener('DOMContentLoaded', fixBackendUrls);
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