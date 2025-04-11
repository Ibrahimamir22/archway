import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

/**
 * API route for contact form submissions
 * This acts as a proxy to the backend API, bypassing CORS issues
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  try {
    console.log('Proxying contact form submission to backend');
    
    // Get the backend URL from environment variable or use default
    const backendUrl = process.env.BACKEND_API_URL || 'http://backend:8000/api/v1/contact/';
    console.log('Using backend URL:', backendUrl);
    
    // Log the request body for debugging
    console.log('Request body:', req.body);
    
    try {
      // Forward the request to the backend
      const response = await axios.post(backendUrl, req.body, {
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout and retry logic
        timeout: 8000,
        validateStatus: function (status) {
          return status >= 200 && status < 500; // Accept all non-500 responses
        }
      });
      
      console.log('Backend response:', response.status, response.data);
      
      // Return the backend response
      return res.status(response.status).json(response.data);
    } catch (error: any) {
      console.error('Error communicating with backend:', error);
      
      // Try direct server-to-server communication as a fallback
      try {
        console.log('Attempting fallback communication...');
        const fallbackUrl = 'http://backend:8000/api/v1/contact/';
        const fallbackResponse = await axios.post(fallbackUrl, req.body, {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 5000
        });
        
        console.log('Fallback response:', fallbackResponse.status, fallbackResponse.data);
        return res.status(fallbackResponse.status).json(fallbackResponse.data);
      } catch (fallbackError: any) {
        console.error('Fallback also failed:', fallbackError);
        return res.status(500).json({
          error: 'Failed to submit contact form after multiple attempts',
          details: error.message
        });
      }
    }
  } catch (e) {
    console.error('Unexpected error in API route:', e);
    return res.status(500).json({ error: 'Internal server error' });
  }
} 