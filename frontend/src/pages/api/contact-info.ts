import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

/**
 * Contact information API endpoint
 * Proxies requests to the backend and provides fallback data when backend is unavailable
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Default fallback contact info
  const fallbackData = {
    email: "info@archwaydesign.com",
    phone: "+20 123 456 7890",
    address: "Cairo, Egypt",
    social_media: [
      {
        name: "facebook",
        url: "https://facebook.com/archwaydesign"
      },
      {
        name: "instagram",
        url: "https://instagram.com/archwaydesign"
      },
      {
        name: "linkedin",
        url: "https://linkedin.com/company/archwaydesign"
      }
    ],
    working_hours: "Sunday-Thursday: 9:00 AM - 5:00 PM"
  };

  try {
    // Attempt to fetch from backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL 
      ? `${process.env.NEXT_PUBLIC_API_URL}/contact-info/` 
      : 'http://backend:8000/api/v1/contact-info/';
      
    console.log('Fetching contact info from:', backendUrl);
    
    const response = await axios.get(backendUrl, {
      timeout: 3000, // 3 second timeout
      params: req.query // Pass through any query parameters
    });
    
    // Return data from backend
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.warn('Error fetching contact info from backend, using fallback data:', error.message);
    
    // If the backend couldn't be reached or returns an error, use fallback data
    return res.status(200).json(fallbackData);
  }
} 