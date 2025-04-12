import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    const { locale } = this.props.__NEXT_DATA__;
    const dir = locale === 'ar' ? 'rtl' : 'ltr';
    
    return (
      <Html lang={locale} dir={dir}>
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
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument; 