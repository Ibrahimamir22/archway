import { NextResponse } from 'next/server';

/**
 * API route for fetching available FAQ languages
 */
export async function GET() {
  try {
    // Create the endpoint URL for the languages endpoint
    // Use the API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const endpointUrl = `${apiUrl}/faqs/languages/`;
    
    console.log('Fetching FAQ languages from:', endpointUrl);
    
    // Make the request to the backend API
    const response = await fetch(endpointUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      // Add cache: 'no-store' to avoid caching this data since it could change
      cache: 'no-store',
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
    console.error('FAQ languages API route error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch FAQ languages' },
      { status: 500 }
    );
  }
} 