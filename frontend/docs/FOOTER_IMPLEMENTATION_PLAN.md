# Footer Hybrid Data Implementation Plan

This document outlines the step-by-step plan for implementing hybrid data fetching for the footer component in Archway. This approach allows seamless switching between mock data and the Django backend, with proper fallbacks.

## Table of Contents

1. [Overview](#overview)
2. [Current Status](#current-status)
3. [Implementation Steps](#implementation-steps)
4. [Data Flow Diagram](#data-flow-diagram)
5. [Testing Plan](#testing-plan)
6. [Deployment Checklist](#deployment-checklist)
7. [Future Enhancements](#future-enhancements)
8. [Implementation Progress](#implementation-progress)

## Overview

The hybrid approach enables the footer component to:
- Fetch data from the Django backend in production
- Use local mock API for development/testing
- Provide fallbacks for missing/incomplete backend data
- Switch between data sources via environment variables
- Maintain consistent behavior across environments

## Current Status

Currently, the footer implementation:
- Uses a hooks-based approach with `useFooter`
- Tries fetching from the backend first via `fetchRawFooterData`
- Falls back to mock data in `footerData.ts` if backend fails
- Merges data via `transformRawFooterData`
- Uses translations from `messages/*.json` files for UI text

Missing pieces:
- Environment variable control for data source
- Proper local mock API integration
- Structured logging for data source tracking
- Clear documentation of the data flow

## Implementation Steps

### Phase 1: Configuration System ✅ COMPLETED

1. **Create Config Module** ✅
   
   Created new file at `frontend/src/lib/config.ts`:
   
   ```typescript
   // frontend/src/lib/config.ts
   
   /**
    * Application configuration based on environment variables
    */
   export const config = {
     // Data fetching configuration
     useMockApi: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true',
     preferBackend: process.env.NEXT_PUBLIC_PREFER_BACKEND !== 'false',
     fallbackToMock: process.env.NEXT_PUBLIC_FALLBACK_TO_MOCK !== 'false',
     
     // API paths
     mockApiBasePath: process.env.NEXT_PUBLIC_MOCK_API_PATH || '/api',
     
     // Debugging
     logDataFetching: process.env.NEXT_PUBLIC_LOG_DATA_FETCHING === 'true',
     
     // Function to get current environment
     isProduction: () => process.env.NODE_ENV === 'production',
     isDevelopment: () => process.env.NODE_ENV === 'development',
     isTest: () => process.env.NODE_ENV === 'test',
   };
   
   export default config;
   ```

2. **Setup Environment Files** ✅
   
   Created/updated environment files:
   
   ```bash
   # .env.development
   NEXT_PUBLIC_USE_MOCK_API=true
   NEXT_PUBLIC_PREFER_BACKEND=true
   NEXT_PUBLIC_FALLBACK_TO_MOCK=true
   NEXT_PUBLIC_LOG_DATA_FETCHING=true
   
   # .env.production
   NEXT_PUBLIC_USE_MOCK_API=false
   NEXT_PUBLIC_PREFER_BACKEND=true
   NEXT_PUBLIC_FALLBACK_TO_MOCK=true
   NEXT_PUBLIC_LOG_DATA_FETCHING=false
   
   # .env.test
   NEXT_PUBLIC_USE_MOCK_API=true
   NEXT_PUBLIC_PREFER_BACKEND=false
   NEXT_PUBLIC_FALLBACK_TO_MOCK=true
   NEXT_PUBLIC_LOG_DATA_FETCHING=true
   ```

### Phase 2: Common Fetcher Implementation (Next)

1. **Create Generic Fetcher**
   
   Create a new file at `frontend/src/lib/api/fetcher.ts`:
   
   ```typescript
   // frontend/src/lib/api/fetcher.ts
   
   import axios, { AxiosRequestConfig } from 'axios';
   import { config } from '../config';
   import { getApiBaseUrl } from './core';
   
   // Logger for data fetching
   const logFetch = (message: string, data?: any) => {
     if (config.logDataFetching) {
       console.log(`[Fetcher] ${message}`, data);
     }
   };
   
   export interface FetchOptions<T> {
     // Local mock API endpoint path (e.g., '/footer')
     mockEndpoint?: string;
     
     // List of potential backend endpoints to try
     backendEndpoints?: string[];
     
     // Default data to use as fallback
     fallbackData?: T;
     
     // URL parameters for API requests
     queryParams?: Record<string, string>;
     
     // Whether to require complete data
     requireComplete?: boolean;
     
     // Function to merge API data with fallbacks
     mergeFunction?: (apiData: any, fallbackData: T) => T;
     
     // Custom axios config for requests
     axiosConfig?: AxiosRequestConfig;
   }
   
   /**
    * Hybrid data fetcher that can fetch from multiple sources in order:
    * 1. Local mock API (if enabled via environment variables)
    * 2. Backend API endpoints (trying multiple potential URLs)
    * 3. Fallback to default data (if allowed)
    */
   export async function hybridFetch<T>(options: FetchOptions<T>): Promise<T | null> {
     const {
       mockEndpoint,
       backendEndpoints = [],
       fallbackData,
       queryParams = {},
       requireComplete = false,
       mergeFunction,
       axiosConfig = {}
     } = options;
     
     // Build query string
     const queryString = new URLSearchParams(queryParams).toString();
     const queryAppend = queryString ? `?${queryString}` : '';
     
     // Common request config
     const requestConfig = {
       timeout: 5000,
       validateStatus: (status: number) => status < 500,
       ...axiosConfig
     };
   
     // Track data source for logging
     let dataSource: 'mock' | 'backend' | 'fallback' | 'none' = 'none';
     
     // STEP 1: Try mock API if enabled
     if (config.useMockApi && mockEndpoint) {
       try {
         const url = `${config.mockApiBasePath}${mockEndpoint}${queryAppend}`;
         logFetch(`Fetching from mock API: ${url}`);
         
         const response = await axios.get(url, requestConfig);
         if (response.status === 200 && response.data) {
           if (!requireComplete || isCompleteData(response.data)) {
             dataSource = 'mock';
             logFetch(`Successfully fetched from mock API: ${url}`, {
               status: response.status,
               dataKeys: Object.keys(response.data || {})
             });
             return response.data;
           } else {
             logFetch(`Mock API data incomplete, continuing to backend`);
           }
         }
       } catch (error) {
         logFetch(`Mock API fetch failed: ${error}`);
       }
     }
   
     // STEP 2: Try backend endpoints if enabled
     if (config.preferBackend && backendEndpoints.length > 0) {
       const apiBaseUrl = getApiBaseUrl();
       
       for (const endpoint of backendEndpoints) {
         try {
           const url = endpoint.startsWith('http') 
             ? `${endpoint}${queryAppend}`
             : `${apiBaseUrl}/${endpoint.replace(/^\//, '')}${queryAppend}`;
           
           logFetch(`Fetching from backend: ${url}`);
           
           const response = await axios.get(url, requestConfig);
           if (response.status === 200 && response.data) {
             // If we have both API data and fallback data + merge function,
             // merge them to provide fallbacks for missing sections
             if (fallbackData && mergeFunction) {
               dataSource = 'backend+fallback';
               const mergedData = mergeFunction(response.data, fallbackData);
               logFetch(`Merged backend data with fallbacks`, {
                 url,
                 backendFields: Object.keys(response.data || {}),
                 mergedFields: Object.keys(mergedData || {})
               });
               return mergedData;
             }
             
             // Otherwise just return the backend data directly
             dataSource = 'backend';
             logFetch(`Successfully fetched from backend: ${url}`, {
               status: response.status,
               dataKeys: Object.keys(response.data || {})
             });
             return response.data;
           }
         } catch (error) {
           logFetch(`Backend endpoint failed: ${endpoint}, ${error}`);
         }
       }
     }
   
     // STEP 3: Use fallback data if allowed
     if (config.fallbackToMock && fallbackData) {
       dataSource = 'fallback';
       logFetch('All fetches failed, using fallback data');
       return fallbackData;
     }
   
     // No data available
     logFetch('No data available from any source');
     return null;
   }
   
   // Helper to check if data is complete enough
   function isCompleteData(data: any): boolean {
     if (!data) return false;
     if (typeof data !== 'object') return false;
     // Add custom logic for different data types if needed
     return Object.keys(data).length > 0;
   }
   ```

### Phase 3: Update Footer-Specific Implementation (Day 2)

1. **Create Footer-Specific Fetcher**
   
   Create a new file at `frontend/src/lib/api/footer.ts`:
   
   ```typescript
   // frontend/src/lib/api/footer.ts
   
   import { hybridFetch } from './fetcher';
   import { FooterData, mockFooterData } from '../fixtures/footer/footerData';
   import { transformRawFooterData } from '../utils/footerUtils';
   
   /**
    * Fetches footer data using the hybrid approach:
    * 1. Try mock API if enabled
    * 2. Try backend endpoints
    * 3. Fall back to mock data if needed
    * 
    * @param locale - The language locale (e.g., 'en', 'ar')
    * @returns The footer data or null if all fetch attempts fail
    */
   export async function fetchFooterData(locale: string): Promise<FooterData | null> {
     return hybridFetch<FooterData>({
       // Local mock API endpoint
       mockEndpoint: '/footer',
       
       // Potential backend endpoints to try
       backendEndpoints: [
         'api/v1/footer/all/',
         'footer/all/'
       ],
       
       // Fallback data from fixtures
       fallbackData: mockFooterData,
       
       // Query parameters
       queryParams: { lang: locale },
       
       // Merge function for combining backend data with fallbacks
       mergeFunction: transformRawFooterData
     });
   }
   ```

2. **Update Core API File**
   
   Update `frontend/src/lib/api/core.ts` to use the new fetcher:
   
   ```typescript
   // frontend/src/lib/api/core.ts
   
   // Add this import
   import { fetchFooterData } from './footer';
   
   // Replace the existing fetchRawFooterData function with this
   export async function fetchRawFooterData(locale: string): Promise<any | null> {
     return fetchFooterData(locale);
   }
   ```

3. **Uncomment and Update Mock API Route**
   
   Update `frontend/src/app/api/footer/route.ts`:
   
   ```typescript
   // frontend/src/app/api/footer/route.ts
   
   import { NextResponse } from 'next/server';
   import fs from 'fs';
   import path from 'path';
   
   /**
    * Local mock API endpoint for footer data
    * Used for development and testing when backend is not available
    */
   export async function GET(request: Request) {
     try {
       // Get query parameters
       const { searchParams } = new URL(request.url);
       const lang = searchParams.get('lang') || 'en';
       
       // Load translations directly from message files
       // This ensures consistent translations between UI and API
       const messagesPath = path.join(process.cwd(), 'src', 'messages', `${lang}.json`);
       const messagesExist = fs.existsSync(messagesPath);
       
       // Fallback to English if requested language doesn't exist
       const finalLang = messagesExist ? lang : 'en';
       const finalPath = path.join(process.cwd(), 'src', 'messages', `${finalLang}.json`);
       
       // Read and parse the messages file
       const messagesContent = fs.readFileSync(finalPath, 'utf8');
       const messages = JSON.parse(messagesContent);
       
       // Get translated content from messages
       const footer = messages.footer || {};
       
       // Construct response using translations
       const footerData = {
         settings: null,
         sections: [
           {
             id: "company",
             title: footer.sections?.company?.title || (finalLang === 'en' ? "Company" : "الشركة"),
             links: [
               { 
                 id: "about", 
                 text: footer.sections?.company?.links?.about_us || (finalLang === 'en' ? "About Us" : "من نحن"), 
                 url: "/about", 
                 open_in_new_tab: false 
               },
               { 
                 id: "services", 
                 text: footer.sections?.company?.links?.services || (finalLang === 'en' ? "Services" : "خدماتنا"), 
                 url: "/services", 
                 open_in_new_tab: false 
               },
               { 
                 id: "portfolio", 
                 text: footer.sections?.company?.links?.portfolio || (finalLang === 'en' ? "Portfolio" : "معرض الأعمال"), 
                 url: "/portfolio", 
                 open_in_new_tab: false 
               }
             ]
           },
           {
             id: "resources",
             title: footer.sections?.resources?.title || (finalLang === 'en' ? "Resources" : "مصادر"),
             links: [
               { 
                 id: "blog", 
                 text: footer.sections?.resources?.links?.blog || (finalLang === 'en' ? "Blog" : "المدونة"), 
                 url: "/blog", 
                 open_in_new_tab: false 
               },
               { 
                 id: "faq", 
                 text: footer.sections?.resources?.links?.faq || (finalLang === 'en' ? "FAQ" : "الأسئلة الشائعة"), 
                 url: "/faq", 
                 open_in_new_tab: false 
               },
               { 
                 id: "contact", 
                 text: footer.sections?.resources?.links?.contact || (finalLang === 'en' ? "Contact" : "اتصل بنا"), 
                 url: "/contact", 
                 open_in_new_tab: false 
               }
             ]
           }
         ],
         social_media: [
           { id: "facebook", name: "Facebook", url: "https://facebook.com/archway.egypt/", icon: "facebook" },
           { id: "instagram", name: "Instagram", url: "https://instagram.com/archway.egypt", icon: "instagram" },
           { id: "linkedin", name: "LinkedIn", url: "https://linkedin.com/company/archway-innovations", icon: "linkedin" }
         ],
         bottom_links: [
           { 
             id: "privacy", 
             text: footer.privacyPolicy || (finalLang === 'en' ? "Privacy Policy" : "سياسة الخصوصية"), 
             url: "/privacy", 
             open_in_new_tab: false 
           },
           { 
             id: "terms", 
             text: footer.termsOfService || (finalLang === 'en' ? "Terms of Service" : "شروط الخدمة"), 
             url: "/terms", 
             open_in_new_tab: false 
           }
         ],
         company_name: footer.companyInfo?.name || "Archway Innovations",
         description: footer.companyInfo?.description || (finalLang === 'en' 
           ? "We create stunning interior designs for modern homes and offices" 
           : "نصمم تصاميم داخلية مذهلة للمنازل والمكاتب الحديثة"),
         copyright_text: footer.copyright || (finalLang === 'en' 
           ? "© 2025 Archway Innovations. All rights reserved." 
           : "© 2025 آركواي للابتكارات. جميع الحقوق محفوظة."),
         show_newsletter: true,
         newsletter_text: footer.newsletter?.description || (finalLang === 'en' 
           ? "Stay updated with our latest news and offers." 
           : "ابق على اطلاع بأحدث أخبارنا وعروضنا."),
         newsletter_label: footer.newsletter?.title || (finalLang === 'en' 
           ? "Subscribe to Our Newsletter" 
           : "اشترك في نشرتنا الإخبارية"),
         contact_title: footer.contactUs || (finalLang === 'en' ? "Contact Us" : "اتصل بنا"),
         contact_info: [
           { id: "email", type: "email", value: "info@archwayeg.com", icon: "email" },
           { id: "phone", type: "phone", value: "+201150000183", icon: "phone" },
           { id: "address", type: "address", value: finalLang === 'en' 
             ? "VILLA 65, Ground floor, Near El Banafseg 5, NEW CAIRO, EGYPT, Cairo, Egypt" 
             : "فيلا ٦٥، الدور الأرضي، بالقرب من البنفسج ٥، القاهرة الجديدة، مصر، القاهرة، مصر", 
             icon: "location" 
           }
         ]
       };
   
       // Return mock data
       return NextResponse.json(footerData);
     } catch (error) {
       console.error('Error in footer mock API:', error);
       return NextResponse.json({ error: 'Internal error' }, { status: 500 });
     }
   }
   ```

### Phase 4: Update Hook (Day 2)

1. **Update Footer Hook**
   
   Update `frontend/src/lib/hooks/footer/useFooter.ts`:
   
   ```typescript
   // Add this import at the top
   import config from '@/lib/config';
   
   // Replace the loadFooterData function with this version
   const loadFooterData = async () => {
     setLoading(true);
     setError(null);

     try {
       const apiData = await fetchRawFooterData(locale);
       
       // If data is missing, empty, or just an empty object
       const isEmptyApiData = !apiData || 
         Object.keys(apiData).length === 0 || 
         (typeof apiData === 'object' && !Object.values(apiData).some(value => !!value));
       
       if (isEmptyApiData) {
         console.warn(`Footer data source (${locale}): Using FALLBACK data completely`);
         setFooterData(mockFooterData);
       } else {
         // Data source is logged by the hybrid fetcher
         console.log(`Footer data source (${locale}): Using API/HYBRID data`);
         setFooterData(apiData);
       }
     } catch (err) {
       console.error('Error loading footer data:', err);
       setError('Failed to load footer configuration.');
       // Always use mock data on error
       setFooterData(mockFooterData);
     } finally {
       setLoading(false);
     }
   };
   ```

### Phase 5: Testing and Documentation (Day 3)

1. **Create Footer README**
   
   Create a new file at `frontend/src/components/common/Footer/README.md`:
   
   ```markdown
   # Footer Component
   
   The footer component uses a hybrid data fetching approach that allows it to work
   with either backend data, mock data, or a combination of both.
   
   ## Data Flow
   
   1. User visits a page with the Footer component
   2. Footer component calls the `useFooter` hook
   3. Hook fetches data using this pipeline:
      - Try backend API if enabled
      - Try mock API if enabled
      - Fall back to default data if needed
   4. Footer renders with the data, regardless of source
   
   ## Configuration
   
   The footer's data source is controlled by environment variables:
   
   - `NEXT_PUBLIC_USE_MOCK_API` - Whether to enable mock API
   - `NEXT_PUBLIC_PREFER_BACKEND` - Whether to try backend first
   - `NEXT_PUBLIC_FALLBACK_TO_MOCK` - Whether to use mock data as fallback
   - `NEXT_PUBLIC_LOG_DATA_FETCHING` - Whether to log data fetching details
   
   ## Files
   
   - `components/common/Footer/Footer.tsx` - Main component
   - `lib/hooks/footer/useFooter.ts` - React hook
   - `lib/api/footer.ts` - API fetcher
   - `lib/utils/footerUtils.ts` - Data transformation
   - `lib/fixtures/footer/footerData.ts` - Fallback data
   - `app/api/footer/route.ts` - Mock API endpoint
   ```

2. **Add Environment Instructions**
   
   Create a file at `frontend/.env.example`:
   
   ```bash
   # Data fetching configuration
   NEXT_PUBLIC_USE_MOCK_API=true
   NEXT_PUBLIC_PREFER_BACKEND=true
   NEXT_PUBLIC_FALLBACK_TO_MOCK=true
   NEXT_PUBLIC_LOG_DATA_FETCHING=true
   
   # API configuration
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   NEXT_PUBLIC_API_BROWSER_URL=http://localhost:8000/api/v1
   ```

## Implementation Progress

- ✅ **Phase 1: Configuration System** - Completed
  - ✅ Created config module with environment variables
  - ✅ Setup environment files for development, production, and testing

- ✅ **Phase 2: Common Fetcher Implementation** - Completed
  - ✅ Created generic fetcher with multiple data source support
  - ✅ Implemented detailed logging for debugging
  - ✅ Added fallback mechanism for handling API failures

- ✅ **Phase 3: Footer-Specific Implementation** - Completed
  - ✅ Created footer-specific fetcher
  - ✅ Updated core API file
  - ✅ Updated mock API route

- ✅ **Phase 4: Update Hook** - Completed
  - ✅ Updated footer hook to work with the hybrid fetching system
  - ✅ Improved logging and error handling

- ✅ **Phase 5: Testing and Documentation** - Completed
  - ✅ Created footer README with usage instructions
  - ✅ Added documentation about Docker-specific configuration
  - ✅ Added troubleshooting guide

## Implementation Summary

The hybrid data fetching system for the footer component has been fully implemented. The system provides:

1. **Environment-Based Configuration**
   - Control data source behavior with environment variables
   - Support different settings for development, production, and testing

2. **Multiple Data Source Support**
   - Backend API for production use
   - Mock API for development and testing
   - Fallback data when APIs aren't available

3. **Docker Support**
   - Proper handling of Docker networking
   - Appropriate URL transformations for server vs. browser contexts

4. **Developer Experience**
   - Detailed logging for debugging
   - Comprehensive documentation
   - Troubleshooting guides

5. **Robustness**
   - Graceful handling of API failures
   - Consistent fallbacks for missing data
   - Support for multiple backend endpoint patterns

## Data Flow Diagram

```
┌────────────────┐     ┌──────────────┐     ┌─────────────────┐
│  Footer.tsx    │     │  useFooter   │     │ fetchFooterData │
│  Component     │────▶│  React Hook  │────▶│ Hybrid Fetcher  │
└────────────────┘     └──────────────┘     └─────────────────┘
                                                     │
                                                     ▼
┌────────────────┐     ┌──────────────┐     ┌─────────────────┐
│ FooterUtils.ts │     │ footerData.ts│     │     Source      │
│Transform/Merge │◀────│ Fallback Data│◀────│Selection Logic  │
└────────────────┘     └──────────────┘     └─────────────────┘
                                                     │
                                                     ▼
                                            ┌─────────────────┐
                                            │  1. Mock API    │
                                            │  2. Backend API │
                                            │  3. Fallback    │
                                            └─────────────────┘
```

## Testing Plan

1. **Environment Variable Tests**
   - Test with mock API enabled/disabled
   - Test with backend preferred/not preferred
   - Test with fallbacks enabled/disabled

2. **Backend Integration Tests**
   - Test with backend available
   - Test with backend returning partial data
   - Test with backend unavailable

3. **Localization Tests**
   - Test with English locale
   - Test with Arabic locale
   - Test with unsupported locale (should fall back to default)

4. **Render Tests**
   - Test that footer renders correctly with all data sources
   - Test that all links and sections work correctly

## Deployment Checklist

Before deploying to production:

1. Ensure environment variables are configured correctly
2. Verify that backend API endpoints are working
3. Confirm that fallback data is up-to-date
4. Test the complete flow in staging environment
5. Ensure that logging is appropriate for production (not too verbose)

## Future Enhancements

1. **Caching Layer**
   - Implement SWR or React Query for advanced caching
   - Add client-side storage for offline support

2. **Performance Monitoring**
   - Add metrics for data fetching times
   - Track fallback usage rate

3. **Extended Configuration**
   - Allow per-feature toggle of data sources
   - Implement more granular control of fallbacks 