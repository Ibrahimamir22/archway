import { NextResponse } from 'next/server';
import axios from 'axios';
import { getApiBaseUrl } from '@/lib/api';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received form submission:', body);
    
    // Server-side request to the backend
    const backendUrl = `${getApiBaseUrl()}/contact/`;
    console.log('Making server-side request to:', backendUrl);
    
    const response = await axios.post(backendUrl, body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Backend response:', response.status, response.data);
    
    // Return the success response to the client
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