import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api';
import { defaultProjects } from './defaultData';

export async function GET() {
  const apiBaseUrl = getApiBaseUrl();
  const endpoint = `${apiBaseUrl}/portfolio/projects`;

  console.log(`Fetching portfolio projects from: ${endpoint}`);

  try {
    const response = await fetch(endpoint, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 10,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch portfolio projects: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Successfully fetched ${data.length} portfolio projects`);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 's-maxage=10, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Error fetching portfolio projects:', error);
    console.log('Returning default portfolio projects');

    // Return default projects as fallback
    return NextResponse.json(defaultProjects, {
      headers: {
        'Cache-Control': 's-maxage=10, stale-while-revalidate=60',
      },
    });
  }
} 