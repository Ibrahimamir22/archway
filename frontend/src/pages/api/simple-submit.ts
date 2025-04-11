import type { NextApiRequest, NextApiResponse } from 'next';
import http from 'http';

/**
 * Ultra-simple form submission that uses Node.js built-in http module
 * This bypasses any dependency issues with axios or other libraries
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Log the request data
  console.log('Received submission data:', req.body);

  // Return success for testing purposes  
  // Uncomment this to test if the frontend can reach this endpoint
  // return res.status(200).json({ success: true, message: 'Endpoint reached successfully', data: req.body });
  
  // Create a promise-based wrapper for http request
  const makeRequest = () => {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(req.body);
      
      const options = {
        hostname: 'backend',
        port: 8000,
        path: '/api/v1/contact/',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData)
        }
      };
      
      console.log('Making request with options:', options);
      
      const httpReq = http.request(options, (httpRes) => {
        console.log(`STATUS: ${httpRes.statusCode}`);
        
        let responseData = '';
        
        httpRes.on('data', (chunk) => {
          responseData += chunk;
        });
        
        httpRes.on('end', () => {
          console.log('Response data:', responseData);
          try {
            const parsedData = JSON.parse(responseData);
            resolve({ status: httpRes.statusCode, data: parsedData });
          } catch (e) {
            resolve({ status: httpRes.statusCode, data: responseData });
          }
        });
      });
      
      httpReq.on('error', (e) => {
        console.error(`Problem with request: ${e.message}`);
        reject(e);
      });
      
      // Write data to request body
      httpReq.write(postData);
      httpReq.end();
    });
  };
  
  try {
    const result = await makeRequest();
    console.log('Backend response:', result);
    
    // @ts-ignore
    const statusCode = result.status >= 200 && result.status < 300 ? 200 : result.status;
    
    // @ts-ignore
    return res.status(statusCode).json({ 
      success: statusCode >= 200 && statusCode < 300,
      // @ts-ignore
      result: result.data
    });
  } catch (error) {
    console.error('Error submitting form:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to submit contact form',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
} 