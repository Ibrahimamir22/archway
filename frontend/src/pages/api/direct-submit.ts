import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

/**
 * Direct submission API route
 * This handles the form submission directly from the server side
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  
  console.log('Received form submission:', req.body);
  
  try {
    // Server-side request to the backend
    const backendUrl = 'http://backend:8000/api/v1/contact/';
    console.log('Making server-side request to:', backendUrl);
    
    const response = await axios.post(backendUrl, req.body, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Backend response:', response.status, response.data);
    
    // Return the success response to the client
    return res.status(201).json({ 
      success: true,
      message: 'Your message has been sent successfully!' 
    });
  } catch (error: any) {
    console.error('Error submitting form to backend:', error);
    
    return res.status(500).json({ 
      success: false,
      error: 'Failed to submit contact form',
      details: error.message 
    });
  }
} 