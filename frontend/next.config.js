/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');

const nextConfig = {
  i18n,
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['localhost', 'backend', 'images.unsplash.com', 'localhost:8000', 'backend:8000'],
    unoptimized: true, // Disable Next.js image optimization to troubleshoot
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:8000/api/:path*',
      },
    ];
  },
};

module.exports = nextConfig; 