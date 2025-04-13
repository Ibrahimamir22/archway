/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');
const path = require('path');

const nextConfig = {
  i18n,
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: [
      'localhost', 
      'backend', 
      'images.unsplash.com', 
      'localhost:8000',
      '127.0.0.1:8000',
      process.env.NEXT_PUBLIC_API_HOST || 'localhost', // Dynamically allow the configured API host
    ],
    unoptimized: process.env.NODE_ENV === 'development', // Only disable optimization in development
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840], // Better responsive image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // Additional sizes for smaller images
    loader: 'custom',
    loaderFile: './src/utils/image-loader.js',
  },
  // Add webpack config for better module resolution
  webpack: (config, { isServer }) => {
    // Configure path aliases for cleaner imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src/'),
    };
    
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:8000/api/:path*',
      },
      // Add a rewrite for media files to prevent CORS issues
      {
        source: '/media/:path*',
        destination: 'http://backend:8000/media/:path*',
      },
    ];
  },
  typescript: {
    // Dangerously allow production builds to successfully complete even with TypeScript errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Dangerously allow production builds to successfully complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig; 