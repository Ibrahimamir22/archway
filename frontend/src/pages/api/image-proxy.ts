import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

// In-memory cache to avoid duplicate requests
const imageCache = new Map<string, {
  data: Buffer,
  contentType: string,
  timestamp: number
}>();

// Cache expiration time (24 hours in milliseconds)
const CACHE_TTL = 24 * 60 * 60 * 1000;

/**
 * API route that proxies image requests to the backend
 * This helps resolve the "backend:8000" hostname issues in browser contexts
 * and provides caching to improve performance
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get the image path from the query
  const { path } = req.query;

  if (!path || typeof path !== 'string') {
    return res.status(400).json({ error: 'Image path is required' });
  }

  // Optional preload flag
  const preload = req.query.preload === 'true';
  
  try {
    // Determine backend URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://backend:8000';
    
    // Clean the path to ensure it starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    
    // Make the request to the backend
    const imageUrl = `${backendUrl}${cleanPath}`;
    const cacheKey = imageUrl;
    
    // If we're just preloading, no need to return the actual image
    if (preload) {
      // Check if already cached
      if (imageCache.has(cacheKey)) {
        return res.status(204).end(); // No content, just cached
      }
      
      // Fetch but don't wait
      fetchAndCacheImage(cacheKey, imageUrl)
        .catch(err => console.error('Background preload failed:', err));
      
      return res.status(202).json({ status: 'preloading' });
    }
    
    // Check cache first
    const cachedImage = imageCache.get(cacheKey);
    if (cachedImage && (Date.now() - cachedImage.timestamp) < CACHE_TTL) {
      // Return cached image
      res.setHeader('Content-Type', cachedImage.contentType);
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).send(cachedImage.data);
    }
    
    // Not cached or cache expired, fetch from backend
    console.log(`Proxying image request to: ${imageUrl}`);
    const imageData = await fetchAndCacheImage(cacheKey, imageUrl);
    
    // Set appropriate headers
    res.setHeader('Content-Type', imageData.contentType);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    res.setHeader('X-Cache', 'MISS');
    
    // Return the image data
    return res.status(200).send(imageData.data);
  } catch (error) {
    console.error('Error proxying image:', error);
    
    // Return a fallback transparent pixel if available
    if (imageCache.has('fallback')) {
      const fallback = imageCache.get('fallback')!;
      res.setHeader('Content-Type', fallback.contentType);
      res.setHeader('X-Error', 'true');
      return res.status(200).send(fallback.data);
    }
    
    return res.status(500).json({ error: 'Failed to proxy image' });
  }
}

// Helper function to fetch and cache image
async function fetchAndCacheImage(cacheKey: string, imageUrl: string) {
  try {
    // Get the image from the backend with axios
    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });
    
    // Cache the image
    const imageData = {
      data: Buffer.from(response.data),
      contentType: response.headers['content-type'] || 'image/jpeg',
      timestamp: Date.now()
    };
    
    imageCache.set(cacheKey, imageData);
    return imageData;
  } catch (error) {
    // If we failed to get the image, check if we have a fallback
    if (imageCache.has('fallback')) {
      return imageCache.get('fallback')!;
    }
    
    // Create a transparent pixel as fallback
    const transparentPixel = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
    const fallback = {
      data: transparentPixel,
      contentType: 'image/gif',
      timestamp: Date.now()
    };
    
    // Cache the fallback
    imageCache.set('fallback', fallback);
    throw error;
  }
} 