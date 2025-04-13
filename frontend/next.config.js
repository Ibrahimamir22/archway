/** @type {import('next').NextConfig} */
const { i18n } = require('./next-i18next.config');
const path = require('path');

const nextConfig = {
  // Force Pages Router, disable App Router completely
  experimental: {
    appDir: false,
    // Speed up compilation
    legacyBrowsers: false,
    // Enable browser optimizations
    optimizeFonts: true,
    // Reduce page refresh delays in development
    concurrentFeatures: true,
    // Speed up image processing
    scrollRestoration: true,
    // Improve memory usage
    esmExternals: true,
    // Improve bundle size
    optimizePackageImports: ['react-icons', 'framer-motion'],
  },
  appDir: false, // Explicitly disable app router
  i18n,
  reactStrictMode: false, // Disable strict mode in production for better performance
  swcMinify: true,
  output: 'standalone',
  poweredByHeader: false,
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
    // Add optimization settings
    formats: ['image/webp'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Add webpack config for better module resolution
  webpack: (config, { isServer, dev }) => {
    // Configure path aliases for cleaner imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src/'),
    };
    
    // Production optimizations
    if (!dev) {
      // Enable tree shaking
      config.optimization.usedExports = true;
      
      // Optimize client-side bundles
      if (!isServer) {
        config.optimization.splitChunks = {
          chunks: 'all',
          maxInitialRequests: 25,
          minSize: 20000,
          maxSize: 300000, // 300kb max chunk size for better loading
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              name: 'framework',
              test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
              priority: 40,
              enforce: true,
            },
            lib: {
              test: /[\\/]node_modules[\\/]/,
              priority: 30,
              name(module) {
                // Get the name of the npm package
                const packageNameMatch = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/);
                const packageName = packageNameMatch ? packageNameMatch[1] : null;
                
                // Return a name for the chunk
                return `npm.${packageName.replace('@', '')}`;
              },
            },
            styles: {
              name: 'styles',
              test: /\.css$/,
              chunks: 'all',
              enforce: true,
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
          },
        };
        
        // Disable source maps in production
        if (process.env.NODE_ENV === 'production') {
          config.devtool = false;
        }
      }
    }
    
    return config;
  },
  async rewrites() {
    return [
      // API proxying with better error handling
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL 
          ? process.env.NEXT_PUBLIC_API_URL + '/:path*' 
          : 'http://backend:8000/api/:path*',
      },
      // Improved media files handling
      {
        source: '/media/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL 
          ? process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '') + '/media/:path*' 
          : 'http://backend:8000/media/:path*',
      },
      // These specific paths need to go to our own Next.js API routes
      {
        source: '/api/test-backend',
        destination: '/api/test-backend',
      },
      {
        source: '/api/contact-info',
        destination: '/api/contact-info',
      }
    ];
  },
  eslint: {
    // Dangerously allow production builds to successfully complete even with ESLint errors
    ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig; 