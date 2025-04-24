/** @type {import('next').NextConfig} */
// const { i18n } = require('./next-i18next.config'); // REMOVED: No longer using next-i18next
const path = require('path');
// const withNextIntl = require('next-intl/plugin')(); // <-- REMOVE old import
const withNextIntl = require('next-intl/plugin')(
  './i18n.ts' // <-- ADD explicit path to config
); 

const nextConfig = {
  // Core Next.js options
  // i18n, // REMOVED: Handled by next-intl middleware
  reactStrictMode: false, 
  swcMinify: true,
  output: 'standalone',
  poweredByHeader: false,
  
  // Explicitly set compiler options for JSX runtime
  compiler: {
    reactRemoveProperties: process.env.NODE_ENV === 'production',
    removeConsole: process.env.NODE_ENV === 'production',
    styledComponents: false,
  },
  
  // Performance improvements for development
  onDemandEntries: {
    // Keep pages in memory for longer during development
    maxInactiveAge: 60 * 60 * 1000, // 1 hour
    // Number of pages to keep in memory
    pagesBufferLength: 5,
  },
  
  // Cache optimization
  generateEtags: true,
  
  // Image optimization
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
    // Remove custom loader to use Next.js built-in loader
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Webpack optimization
  webpack: (config, { isServer, dev }) => {
    // Configure path aliases for cleaner imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src/'),
    };
    
    // Production optimizations
    if (!dev) {
      // Optimize chunk size
      config.optimization.mergeDuplicateChunks = true;
      config.optimization.splitChunks = {
        chunks: 'all',
        maxInitialRequests: 25,
        minSize: 20000,
        maxSize: 300000, // 300kb max chunk size for better loading
        cacheGroups: {
          default: false,
          vendors: false,
          framework: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'framework',
            priority: 40,
            enforce: true,
          },
          commons: {
            test: /[\\/]node_modules[\\/]/,
            name: 'commons',
            priority: 20,
            minChunks: 2,
          },
        },
      };
      
      // Reduce source map size in production
      if (!isServer) {
        config.devtool = 'source-map';
      }
    }
    
    // Add a plugin to disable automatic font preloading since it causes warnings
    if (!isServer) {
      config.plugins.push({
        apply: (compiler) => {
          compiler.hooks.compilation.tap('DisableFontPreload', (compilation) => {
            // Only proceed if the hook exists
            if (compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing) {
              compilation.hooks.htmlWebpackPluginBeforeHtmlProcessing.tap(
                'DisableFontPreload',
                (data) => {
                  if (data.html) {
                    // Remove preload links for fonts
                    data.html = data.html.replace(
                      /<link[^>]*rel="preload"[^>]*as="font"[^>]*>/g,
                      ''
                    );
                  }
                  return data;
                }
              );
            }
          });
        },
      });
    }
    
    return config;
  },
  
  // API routes configuration
  async rewrites() {
    return [
      // API proxying with better error handling
      {
        source: '/api/:path*',
        destination: process.env.NODE_ENV === 'development' 
          ? 'http://localhost:8000/api/:path*'  // Always use localhost in development 
          : (process.env.NEXT_PUBLIC_API_URL || 'http://backend:8000/api/:path*'),
      },
      // Improved media files handling
      {
        source: '/media/:path*',
        destination: process.env.NODE_ENV === 'development'
          ? 'http://localhost:8000/media/:path*'  // Always use localhost in development
          : (process.env.NEXT_PUBLIC_BACKEND_URL 
              ? process.env.NEXT_PUBLIC_BACKEND_URL.replace('/api/v1', '') + '/media/:path*' 
              : 'http://backend:8000/media/:path*'),
      },
      // These specific paths need to go to our own Next.js API routes
      {
        source: '/api/test-backend',
        destination: '/api/test-backend',
      },
      {
        source: '/api/contact-info',
        destination: '/api/contact-info',
      },
      {
        source: '/api/image-proxy',
        destination: '/api/image-proxy',
      }
    ];
  },
  
  // Error handling
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Disable automatic static optimization for specific pages
  // to prevent overly aggressive preloading of resources
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['next-intl'],
    adjustFontFallbacks: true,
    disableOptimizedLoading: true,
  }
};

module.exports = withNextIntl(nextConfig); 