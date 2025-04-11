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