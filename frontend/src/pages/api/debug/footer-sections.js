import axios from 'axios';
import { getApiBaseUrl } from '../../../utils/urls';

export default async function handler(req, res) {
  try {
    const baseUrl = getApiBaseUrl();
    
    // First get the footer endpoints
    const footerResponse = await axios.get(`${baseUrl}/footer/`);
    const sectionsUrl = footerResponse.data.sections;
    
    // Make the request to the sections API
    const sectionsResponse = await axios.get(sectionsUrl);
    
    // Return the response
    res.status(200).json({
      baseUrl,
      sectionsUrl,
      sections: sectionsResponse.data,
    });
  } catch (error) {
    console.error('Footer sections API debug error:', error);
    
    // Return detailed error info
    res.status(500).json({
      error: error.message,
      stack: error.stack,
      response: error.response ? {
        status: error.response.status,
        data: error.response.data,
      } : null,
    });
  }
} 