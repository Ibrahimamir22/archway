import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

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

// Cache mechanism
let cachedData = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Contact information API endpoint with caching and fast fallback
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Check cache first
  const now = Date.now();
  if (cachedData && (now - cacheTime < CACHE_DURATION)) {
    console.log('Returning cached contact info');
    return res.status(200).json(cachedData);
  }

  try {
    // Use a shorter timeout to avoid long delays
    const backendUrl = process.env.NEXT_PUBLIC_API_URL 
      ? `${process.env.NEXT_PUBLIC_API_URL}/contact-info/` 
      : 'http://backend:8000/api/v1/contact-info/';
      
    console.log('Fetching contact info from:', backendUrl);
    
    const response = await axios.get(backendUrl, {
      timeout: 1500, // Shorter 1.5 second timeout for faster fallback
      params: req.query // Pass through any query parameters
    });
    
    // Update cache
    cachedData = response.data;
    cacheTime = now;
    
    // Return data from backend
    return res.status(200).json(response.data);
  } catch (error: any) {
    console.warn('Using fallback contact data:', error.message);
    
    // If we have stale cache, use it instead of fallback
    if (cachedData) {
      console.log('Using stale cached data');
      return res.status(200).json(cachedData);
    }
    
    // Use fallback data
    return res.status(200).json(fallbackData);
  }
} 