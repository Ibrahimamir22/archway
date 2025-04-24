import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "Archway Design | Interior Design Portfolio Platform",
  description: "Transforming spaces into exceptional experiences through innovative interior design.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link 
          rel="preload" 
          href="/fonts/critical.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous" 
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
