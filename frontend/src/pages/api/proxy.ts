import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

/**
 * General API proxy route
 * This acts as a proxy to the backend API for any endpoint
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Extract the endpoint from the query
  const { endpoint } = req.query;
  
  // Construct the backend URL - ensure proper handling of trailing slashes
  const backendBaseUrl = process.env.BACKEND_API_URL || 'http://backend:8000/api/v1';
  let url = '';
  
  if (typeof endpoint === 'string') {
    // Make sure the endpoint has a trailing slash
    const endpointWithSlash = endpoint.endsWith('/') ? endpoint : `${endpoint}/`;
    url = `${backendBaseUrl}/${endpointWithSlash}`;
  } else {
    url = `${backendBaseUrl}/`;
  }
  
  console.log(`Proxying ${req.method} request to: ${url}`);
  
  try {
    // Forward the request to the backend
    const response = await axios({
      method: req.method,
      url,
      data: req.method !== 'GET' ? req.body : undefined,
      params: req.method === 'GET' ? req.query : undefined,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Return the backend response
    return res.status(response.status).json(response.data);
  } catch (error: any) {
    console.error('Error proxying request to backend:', error);
    
    // Provide detailed error information
    const errorResponse = {
      error: 'Failed to proxy request',
      details: error.message,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data
      } : null
    };
    
    // Return an appropriate error status
    return res.status(error.response?.status || 500).json(errorResponse);
  }
} 