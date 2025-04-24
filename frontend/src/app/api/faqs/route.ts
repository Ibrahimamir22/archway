import { NextRequest, NextResponse } from 'next/server';

/**
 * Proxy API route for FAQ requests
 * Gets around CORS issues and provides a clean API endpoint for the frontend
 */
export async function GET(request: NextRequest) {
  try {
    // Get query parameters from the request
    const searchParams = request.nextUrl.searchParams;
    const language = searchParams.get('language') || 'en';
    
    // Use the API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // Determine which endpoint to call based on the parameters
    let endpointUrl = `${apiUrl}/faqs/`;
    
    // If looking for categories, use the categories endpoint
    if (searchParams.has('categories')) {
      endpointUrl = `${apiUrl}/categories/`;
    }
    
    // If looking for grouped FAQs, use the by-category endpoint
    if (searchParams.has('by-category')) {
      endpointUrl = `${apiUrl}/faqs/by-category/`;
    }
    
    // Add language filter if provided
    if (language) {
      endpointUrl += `?language=${language}`;
    }
    
    console.log('Fetching from:', endpointUrl);
    
    // Make the request to the backend API
    const response = await fetch(endpointUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // If the response is not OK, throw an error
    if (!response.ok) {
      throw new Error(`Backend API error: ${response.status}`);
    }
    
    // Get the data from the response
    const data = await response.json();
    
    // Return the data as JSON
    return NextResponse.json(data);
  } catch (error) {
    console.error('FAQ API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQ data' },
      { status: 500 }
    );
  }
} 