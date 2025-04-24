import { NextRequest, NextResponse } from 'next/server';
import { getBackendBaseUrl } from '@/lib/api';

// SVG placeholder for when images fail to load
const FALLBACK_SVG = `
<svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
  <rect width="800" height="600" fill="#CCCCCC"/>
  <text x="400" y="300" font-family="Arial" font-size="24" fill="#333333" text-anchor="middle">Service Image</text>
</svg>
`;

/**
 * API route that acts as a proxy for images from the backend server
 * This solves cross-origin issues and backend:8000 hostname problems
 */
export async function GET(request: NextRequest) {
  try {
    // Get the image path from query params
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    // Ensure a path is provided
    if (!path) {
      console.error('Image proxy: Missing path parameter');
      return returnFallbackImage();
    }

    // Normalize the path
    let normalizedPath = path;
    
    console.log(`Image proxy received request for: ${path}`);
    
    // Remove double slashes
    normalizedPath = normalizedPath.replace(/\/\//g, '/');
    
    // If path is already a full URL, extract just the path portion
    if (normalizedPath.startsWith('http')) {
      try {
        const url = new URL(normalizedPath);
        normalizedPath = url.pathname + url.search;
        console.log(`Extracted path from URL: ${normalizedPath}`);
      } catch (e) {
        console.error(`Failed to parse URL: ${normalizedPath}`, e);
      }
    }
    
    // Ensure path starts with a slash if it doesn't already
    if (!normalizedPath.startsWith('/')) {
      normalizedPath = `/${normalizedPath}`;
    }

    // Construct the backend URL
    const backendBaseUrl = getBackendBaseUrl();
    console.log(`Using backend base URL: ${backendBaseUrl}`);
    
    // Build the final image URL
    const imageUrl = `${backendBaseUrl}${normalizedPath}`;
    console.log(`Fetching image from: ${imageUrl}`);

    // Fetch the image from the backend with a timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    try {
      const response = await fetch(imageUrl, { 
        signal: controller.signal,
        // Include headers that help with potential CORS issues
        headers: {
          'Accept': 'image/*',
          'User-Agent': 'Next.js Image Proxy'
        }
      });
      clearTimeout(timeoutId);

      // If the image wasn't found, return a fallback
      if (!response.ok) {
        console.error(`Failed to proxy image. Status: ${response.status}`);
        return returnFallbackImage();
      }

      // Get the image data and content type
      const imageData = await response.arrayBuffer();
      const contentType = response.headers.get('content-type') || 'image/jpeg';

      // Return the image with proper headers
      return new NextResponse(imageData, {
        headers: {
          'Content-Type': contentType,
          'Cache-Control': 'public, max-age=86400',
        }
      });
    } catch (fetchError) {
      clearTimeout(timeoutId);
      console.error('Image fetch error:', fetchError);
      return returnFallbackImage();
    }
  } catch (error) {
    console.error('Image proxy error:', error);
    return returnFallbackImage();
  }
}

/**
 * Returns a fallback SVG image when the requested image can't be loaded
 */
function returnFallbackImage() {
  return new NextResponse(FALLBACK_SVG, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=60', // Short cache for fallbacks
    }
  });
}

/**
 * Configure the runtime to use Node.js
 * This ensures we can use the full fetch API capabilities
 */
export const runtime = 'nodejs'; 