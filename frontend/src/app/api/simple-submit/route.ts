import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received form submission:', body);
    
    // Build the backend URL
    const backendUrl = `${getApiBaseUrl()}/contact/`;
    console.log('Making server-side request to:', backendUrl);
    
    // Use fetch API to make the request
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log('Backend response:', response.status, responseData);
    
    // Return the success response
    return NextResponse.json({ 
      success: true,
      message: 'Your message has been sent successfully!' 
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error submitting form to backend:', error);
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to submit contact form',
      details: error.message 
    }, { status: 500 });
  }
} 