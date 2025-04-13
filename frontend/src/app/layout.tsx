import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/common/Navbar/index";
import Footer from "@/components/common/Footer/index";

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
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body">
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
