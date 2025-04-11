import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

/**
 * Test API route to verify backend connectivity
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Collect information about the environment
  const envInfo = {
    nodeEnv: process.env.NODE_ENV,
    hostname: req.headers.host,
    method: req.method,
    url: req.url,
    time: new Date().toISOString()
  };
  
  console.log('Test endpoint called with env:', envInfo);
  
  try {
    // Test backend connectivity directly from server
    const backendUrl = 'http://backend:8000/api/v1/contact-info/';
    console.log('Testing connection to backend at:', backendUrl);
    
    const response = await axios.get(backendUrl, {
      timeout: 5000 // 5 second timeout
    });
    
    // Return successful response with both environment info and backend response
    return res.status(200).json({
      success: true,
      envInfo,
      backendConnectivity: {
        status: response.status,
        data: response.data
      }
    });
  } catch (error: any) {
    console.error('Error connecting to backend:', error);
    
    return res.status(500).json({
      success: false,
      envInfo,
      error: {
        message: error.message,
        code: error.code,
        response: error.response ? {
          status: error.response.status,
          data: error.response.data
        } : null
      }
    });
  }
} 