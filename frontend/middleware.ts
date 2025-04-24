import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n'; // Import supported locales

// Debug output for middleware
console.log('Middleware initializing with locales:', locales, 'default:', defaultLocale);

// First try direct handling of root path
export function middleware(request: NextRequest) {
  // Handle the root path explicitly
  const pathname = request.nextUrl.pathname;
  
  if (pathname === '/' || pathname === '') {
    // Construct the new URL with the default locale
    const newUrl = new URL(`/${defaultLocale}`, request.url);
    console.log(`Redirecting from ${pathname} to ${newUrl.pathname}`);
    return NextResponse.redirect(newUrl);
  }
  
  // Otherwise, use next-intl middleware
  return createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always',
    localeDetection: true
  })(request);
}

// Ensure the matcher includes the root path and all other paths
export const config = {
  matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico).*)']
}; 