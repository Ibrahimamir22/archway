import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api';
import { defaultContactInfo } from './defaultData';

export async function GET() {
  const apiBaseUrl = getApiBaseUrl();
  // Make sure the trailing slash is included for Django
  const endpoint = `${apiBaseUrl}/contact-info/`;
  
  try {
    console.log(`Fetching contact info from: ${endpoint}`);
    const response = await fetch(endpoint, {
      headers: {
        'Accept': 'application/json',
      },
      // Disable caching to always get fresh data
      cache: 'no-store'
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch contact info: ${response.status}`);
      return NextResponse.json(defaultContactInfo);
    }
    
    const data = await response.json();
    console.log('Contact info data received:', data);
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    return NextResponse.json(defaultContactInfo);
  }
} 