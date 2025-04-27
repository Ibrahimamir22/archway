import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get environment variables
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'not set';
  const apiBrowserUrl = process.env.NEXT_PUBLIC_API_BROWSER_URL || 'not set';
  const useMockApi = process.env.NEXT_PUBLIC_USE_MOCK_API || 'not set';
  const forceLocalUrls = process.env.NEXT_PUBLIC_FORCE_LOCAL_URLS || 'not set';

  // Log for debugging
  console.log('[ENV Debug] API URL:', apiUrl);
  console.log('[ENV Debug] API Browser URL:', apiBrowserUrl);
  console.log('[ENV Debug] Use Mock API:', useMockApi);
  console.log('[ENV Debug] Force Local URLs:', forceLocalUrls);

  // Test fetch to the backend
  let backendStatus = 'Not tested';
  let backendData = null;
  const combinedEndpoint = `http://localhost:8000/api/v1/about/combined/?lang=ar`;

  try {
    console.log('[ENV Debug] Testing endpoint:', combinedEndpoint);
    const response = await fetch(combinedEndpoint, { 
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        // Add a cache buster to avoid caching
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    });
    
    if (response.ok) {
      backendStatus = 'Success';
      const data = await response.json();
      backendData = {
        metadata: data.metadata,
        team_count: data.team_members?.length || 0,
        values_count: data.core_values?.length || 0
      };
    } else {
      backendStatus = `Failed with status: ${response.status}`;
      const text = await response.text();
      backendData = { error: text.substring(0, 200) + '...' };
    }
  } catch (error) {
    backendStatus = 'Error';
    backendData = { error: error instanceof Error ? error.message : String(error) };
  }

  // Return environment variables and test result
  return NextResponse.json({
    env: {
      NEXT_PUBLIC_API_URL: apiUrl,
      NEXT_PUBLIC_API_BROWSER_URL: apiBrowserUrl,
      NEXT_PUBLIC_USE_MOCK_API: useMockApi,
      NEXT_PUBLIC_FORCE_LOCAL_URLS: forceLocalUrls,
      NODE_ENV: process.env.NODE_ENV
    },
    runtime: {
      isServer: typeof window === 'undefined',
      usedUrl: typeof window !== 'undefined' && process.env.NEXT_PUBLIC_FORCE_LOCAL_URLS === 'true'
        ? apiBrowserUrl : apiUrl
    },
    backend: {
      endpoint: combinedEndpoint,
      status: backendStatus,
      data: backendData
    }
  });
} 