import { NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/api';
import { defaultProjects } from '../defaultData';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const apiBaseUrl = getApiBaseUrl();
  const endpoint = `${apiBaseUrl}/portfolio/projects/${id}`;

  console.log(`Fetching portfolio project with ID ${id} from: ${endpoint}`);

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
      throw new Error(`Failed to fetch portfolio project: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log(`Successfully fetched project with ID ${id}`);

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 's-maxage=10, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error(`Error fetching portfolio project with ID ${id}:`, error);
    console.log('Attempting to return default project with matching ID');

    // Find the project with the matching ID from the default projects
    const defaultProject = defaultProjects.find(project => project.id.toString() === id);
    
    if (defaultProject) {
      return NextResponse.json(defaultProject, {
        headers: {
          'Cache-Control': 's-maxage=10, stale-while-revalidate=60',
        },
      });
    }

    // If no matching project is found, return a 404 error
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
} 