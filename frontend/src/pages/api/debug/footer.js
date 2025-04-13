import axios from 'axios';
import { getApiBaseUrl } from '../../../utils/urls';

export default async function handler(req, res) {
  try {
    const baseUrl = getApiBaseUrl();
    
    // Log environment variables
    console.log('API Base URL:', baseUrl);
    console.log('USE_DOCKER_NETWORK:', process.env.NEXT_PUBLIC_USE_DOCKER_NETWORK);
    
    // Make the request to the footer API
    const response = await axios.get(`${baseUrl}/footer/`);
    
    // Return the response
    res.status(200).json({
      baseUrl,
      useDockerNetwork: process.env.NEXT_PUBLIC_USE_DOCKER_NETWORK === 'true',
      footerEndpoints: response.data,
    });
  } catch (error) {
    console.error('Footer API debug error:', error);
    
    // Return detailed error info
    res.status(500).json({
      error: error.message,
      baseUrl: getApiBaseUrl(),
      useDockerNetwork: process.env.NEXT_PUBLIC_USE_DOCKER_NETWORK === 'true',
      stack: error.stack,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
      } : null,
    });
  }
} 