import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api';
import { validateContactForm } from './validation';

export async function POST(request: Request) {
  try {
    // Get locale from Accept-Language header
    const acceptLanguage = request.headers.get('Accept-Language') || 'en';
    const locale = acceptLanguage.includes('ar') ? 'ar' : 'en';
    
    // Parse the request body
    const data = await request.json();
    
    // Validate the form data
    const validation = validateContactForm(data);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, errors: validation.errors },
        { status: 400 }
      );
    }

    // Log the request
    console.log('Contact form submission:', data);

    // Forward the request to the backend API with the correct endpoint
    const apiUrl = `${getApiBaseUrl()}/contact/messages/`;
    
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': locale
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Error submitting contact form:', errorData);
      return NextResponse.json(
        { 
          success: false, 
          message: 'Failed to submit contact form. Please try again later.',
          locale
        },
        { status: response.status }
      );
    }

    // Get the response data from the backend which should include localized messages
    let responseData;
    try {
      responseData = await response.json();
    } catch (e) {
      responseData = {};
    }

    // Return success response with locale information
    return NextResponse.json({
      success: true,
      message: responseData.message || (locale === 'ar' ? 'تم إرسال رسالتك بنجاح!' : 'Your message has been sent successfully!'),
      locale
    });
    
  } catch (error) {
    console.error('Contact form submission error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'An unexpected error occurred. Please try again later.' 
      },
      { status: 500 }
    );
  }
} 