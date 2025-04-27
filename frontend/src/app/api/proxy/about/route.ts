import { NextResponse } from 'next/server';

/**
 * Proxy API route handler that forwards requests to the Django backend
 */
export async function GET(request: Request) {
  try {
    // Get the URL from the request
    const { searchParams } = new URL(request.url);
    
    // Extract the path from the search params
    const path = searchParams.get('path') || '';
    
    // Get the locale from the search params
    const locale = searchParams.get('locale') || 'en';
    
    // Remove path and locale from the searchParams to create a clean query string
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('path');
    newParams.delete('locale');
    
    // Add locale as lang parameter for the Django API
    newParams.append('lang', locale);
    
    // Get the correct backend URL based on environment
    const isClient = typeof window !== 'undefined';
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000/api/v1';
    
    // Build the backend URL
    const backendUrl = `${apiBaseUrl}/about/${path}?${newParams.toString()}`;
    console.log('Proxying request to:', backendUrl);
    
    // Forward the request to the backend
    const response = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.error('Backend responded with error:', response.status, response.statusText);
      return NextResponse.json(
        { 
          success: false, 
          error: { message: `Backend API error: ${response.status} ${response.statusText}` } 
        },
        { status: response.status }
      );
    }
    
    // Get the data from the response
    const data = await response.json();
    
    // Return the data
    return NextResponse.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: { message: error instanceof Error ? error.message : 'Unknown proxy error' } 
      },
      { status: 500 }
    );
  }
} 