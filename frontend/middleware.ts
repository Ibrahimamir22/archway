import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from './i18n'; // Import supported locales

// Remove debug console log for better performance
// console.log('Middleware initializing with locales:', locales, 'default:', defaultLocale);

// First try direct handling of root path
export function middleware(request: NextRequest) {
  // Handle the root path explicitly
  const pathname = request.nextUrl.pathname;
  
  if (pathname === '/' || pathname === '') {
    // Construct the new URL with the default locale
    const newUrl = new URL(`/${defaultLocale}`, request.url);
    // console.log(`Redirecting from ${pathname} to ${newUrl.pathname}`);
    
    // Cache the redirect to reduce future redirects
    const response = NextResponse.redirect(newUrl);
    response.headers.set('Cache-Control', 'public, max-age=3600');
    return response;
  }
  
  // Optimize navigation by checking if it's a prefetch request
  const isPrefetch = request.headers.get('purpose') === 'prefetch' || 
                    request.headers.get('sec-purpose') === 'prefetch';
  
  // Otherwise, use next-intl middleware
  const intlMiddleware = createMiddleware({
    locales,
    defaultLocale,
    localePrefix: 'always',
    localeDetection: true
  });
  
  // Handle the request through next-intl
  const response = intlMiddleware(request);
  
  // For prefetch requests, add appropriate cache headers
  if (isPrefetch && response) {
    response.headers.set('Cache-Control', 'public, max-age=60, stale-while-revalidate=30');
  }
  
  return response;
}

// Ensure the matcher includes the root path and all other paths
// But exclude specific static resources to prevent unnecessary middleware processing
export const config = {
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico|fonts|images|icons).*)' 
  ]
}; 