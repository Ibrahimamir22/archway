import '../app/globals.css';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { appWithTranslation } from 'next-i18next';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { locale } = router;
  const dir = locale === 'ar' ? 'rtl' : 'ltr';

  return (
    <div dir={dir} className={`min-h-screen flex flex-col ${locale === 'ar' ? 'font-cairo' : 'font-body'}`}>
      <Navbar />
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer />
    </div>
  );
}

export default appWithTranslation(MyApp); 