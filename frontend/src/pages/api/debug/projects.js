import api, { getApiBaseUrl } from '../../../utils/api';

export default async function handler(req, res) {
  try {
    const baseUrl = getApiBaseUrl();
    
    // Make request to projects API using our custom api instance
    const response = await api.get(`${baseUrl}/projects/`);
    
    // Return the response with debugging info
    res.status(200).json({
      success: true,
      baseUrl,
      isBrowser: typeof window !== 'undefined',
      nodeEnv: process.env.NODE_ENV,
      projects: response.data,
    });
  } catch (error) {
    console.error('Projects API debug error:', error);
    
    // Return detailed error info
    res.status(500).json({
      success: false,
      error: error.message,
      baseUrl: getApiBaseUrl(),
      isBrowser: typeof window !== 'undefined',
      stack: error.stack,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
      } : null,
    });
  }
} 