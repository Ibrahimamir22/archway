'use client';

import React, { useState, useEffect } from 'react';
import { useAboutData } from '@/lib/hooks/marketing/about';
import Link from 'next/link';

export default function TestAboutPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  const [debugInfo, setDebugInfo] = useState<string>('Loading debug info...');
  
  // Test the useAboutData hook
  const { 
    data, 
    isLoading, 
    error, 
    isFallback, 
    tryAgain 
  } = useAboutData(locale, {
    useMockData: false
  });
  
  // Log environment variables
  useEffect(() => {
    const envInfo = {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
      NEXT_PUBLIC_API_BROWSER_URL: process.env.NEXT_PUBLIC_API_BROWSER_URL,
      NEXT_PUBLIC_USE_MOCK_API: process.env.NEXT_PUBLIC_USE_MOCK_API,
      NEXT_PUBLIC_FORCE_LOCAL_URLS: process.env.NEXT_PUBLIC_FORCE_LOCAL_URLS,
      runtime: {
        isServer: typeof window === 'undefined',
        usedUrl: typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FORCE_LOCAL_URLS === 'true'
          ? process.env.NEXT_PUBLIC_API_BROWSER_URL : process.env.NEXT_PUBLIC_API_URL
      }
    };
    
    setDebugInfo(JSON.stringify(envInfo, null, 2));
    
    console.log('[Test] Environment variables:', envInfo);
    console.log('[Test] Data from useAboutData:', data);
  }, [data]);

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">About Data Integration Test</h1>
      
      <div className="flex gap-4 mb-6">
        <Link href={`/${locale}/`} className="text-blue-500 hover:underline">
          Home
        </Link>
        <Link href={`/${locale}/about`} className="text-blue-500 hover:underline">
          Real About Page
        </Link>
        <Link href="/api/test-api" className="text-blue-500 hover:underline" target="_blank">
          API Test Endpoint
        </Link>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Environment Variables</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-40">
          {debugInfo}
        </pre>
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Data Status</h2>
        <div className="space-y-2">
          <p><strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}</p>
          <p><strong>Error:</strong> {error ? error.message : 'None'}</p>
          <p><strong>Using Fallback Data:</strong> {isFallback ? 'Yes' : 'No'}</p>
          {error && (
            <button 
              onClick={tryAgain} 
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
      
      {data && (
        <div className="grid gap-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Main Content</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-40">
              {JSON.stringify(data.main_content, null, 2)}
            </pre>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Core Values ({data.core_values?.length || 0})</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-40">
              {JSON.stringify(data.core_values, null, 2)}
            </pre>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Statistics ({data.statistics?.length || 0})</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-40">
              {JSON.stringify(data.statistics, null, 2)}
            </pre>
          </div>
          
          <div>
            <h2 className="text-xl font-semibold mb-2">Team Members ({data.team_members?.length || 0})</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-40">
              {JSON.stringify(data.team_members, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
} 