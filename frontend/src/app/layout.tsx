import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Archway Design | Interior Design Portfolio Platform",
  description: "Transforming spaces into exceptional experiences through innovative interior design.",
};

// This script helps to eliminate the resource preload warnings by canceling unused preloads
const eliminateUnusedPreloads = `
  if (typeof window !== 'undefined') {
    window.addEventListener('load', () => {
      const resources = performance.getEntriesByType('resource');
      const unusedPreloads = resources.filter(r => 
        r.initiatorType === 'link' && 
        !r.name.includes('/_next/static/') && 
        !document.querySelector(\`img[src="\${r.name}"]\`) &&
        document.querySelectorAll(\`link[href="\${r.name}"]\`).length === 1
      );
      
      unusedPreloads.forEach(r => {
        const link = document.querySelector(\`link[href="\${r.name}"]\`);
        if (link && link.rel === 'preload') {
          link.remove();
        }
      });
    });
  }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Include the preload fix script as early as possible */}
        <script 
          src="/preload-fix.js"
          defer={false}
          async={false}
        />
        
        {/* Only preload critical fonts - do not preload all fonts */}
        <link 
          rel="preload" 
          href="/fonts/critical.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
          fetchPriority="high"
        />
        {/* Script to clean up unused preloads */}
        <script 
          dangerouslySetInnerHTML={{ __html: eliminateUnusedPreloads }} 
          async 
        />
        
        {/* CSS for when JavaScript is disabled */}
        <noscript>
          <link rel="stylesheet" href="/noscript.css" />
        </noscript>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
