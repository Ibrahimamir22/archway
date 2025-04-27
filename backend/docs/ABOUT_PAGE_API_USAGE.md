# About Page API Usage Guide

This guide outlines the available API endpoints for the About page and how to use them in the frontend.

## API Endpoints

### Main Content Endpoint

**URL:** `/api/v1/about/`

**Method:** GET

**Description:** Returns the main content for the About page, including mission, vision, and section titles.

**Response Example:**
```json
{
  "title": "About Archway Innovations",
  "subtitle": "Transforming Spaces, Enhancing Lives",
  "mission_title": "Our Mission",
  "mission_description": "To create innovative interior designs that balance aesthetics, functionality, and sustainability while exceeding client expectations.",
  "vision_title": "Our Vision",
  "vision_description": "To be the leading interior design firm, recognized for our exceptional designs and sustainable practices that enhance quality of life.",
  "team_section_title": "Meet Our Team",
  "values_section_title": "Our Core Values",
  "testimonials_section_title": "What Our Clients Say",
  "history_section_title": "Our Journey",
  "meta_description": "Learn about Archway Innovations, our mission, vision, and the team behind our interior design expertise.",
  "title_ar": "عن آركواي للابتكارات",
  "subtitle_ar": "تحويل المساحات، تعزيز الحياة",
  "mission_title_ar": "مهمتنا",
  "mission_description_ar": "إنشاء تصاميم داخلية مبتكرة توازن بين الجماليات والوظائف والاستدامة مع تجاوز توقعات العملاء.",
  "vision_title_ar": "رؤيتنا",
  "vision_description_ar": "أن نكون شركة التصميم الداخلي الرائدة، المعروفة بتصاميمنا الاستثنائية وممارساتنا المستدامة التي تعزز جودة الحياة.",
  "team_section_title_ar": "تعرف على فريقنا",
  "values_section_title_ar": "قيمنا الأساسية",
  "testimonials_section_title_ar": "ماذا يقول عملاؤنا",
  "history_section_title_ar": "رحلتنا",
  "meta_description_ar": "تعرف على آركواي للابتكارات، مهمتنا، رؤيتنا، والفريق وراء خبرتنا في التصميم الداخلي."
}
```

**Query Parameters:**
- `localized=true` - Returns only the fields for the requested language (determined by `lang` parameter)
- `lang=en|ar` - Specifies the language for localized content (default: en)

### Combined Data Endpoint

**URL:** `/api/v1/about/combined/`

**Method:** GET

**Description:** Returns comprehensive data for the entire About page in a single request, including main content, team members, core values, testimonials, company history, statistics, and client logos.

**Response Structure:**
```json
{
  "main_content": { /* AboutPage data */ },
  "team_members": [ /* Team members data */ ],
  "core_values": [ /* Core values data */ ],
  "testimonials": [ /* Testimonials data */ ],
  "company_history": [ /* Company history data */ ],
  "statistics": [ /* Company statistics data */ ],
  "client_logos": [ /* Client logos data */ ],
  "metadata": {
    "team_count": 3,
    "values_count": 4,
    "testimonials_count": 3,
    "history_count": 4,
    "statistics_count": 4,
    "logos_count": 0,
    "language": "en"
  }
}
```

**Query Parameters:**
- `lang=en|ar` - Specifies the language for localized content (default: en)

### Team Members Endpoint

**URL:** `/api/v1/about/team/`

**Method:** GET

**Description:** Returns a list of team members.

**Response Example:**
```json
[
  {
    "id": 1,
    "name": "Sarah Johnson",
    "role": "Founder & CEO",
    "bio": "With over 15 years of experience in interior design, Sarah founded Archway Innovations to transform spaces into extraordinary experiences.",
    "image": "/media/team/sarah.jpg",
    "image_url": "http://localhost:8000/media/team/sarah.jpg",
    "email": "sarah@archwayinnovations.com",
    "linkedin": "https://linkedin.com/in/sarahjohnson",
    "department": "Leadership",
    "is_featured": true,
    "name_ar": "سارة جونسون",
    "role_ar": "المؤسس والرئيس التنفيذي",
    "bio_ar": "مع أكثر من 15 عامًا من الخبرة في التصميم الداخلي، أسست سارة آركواي للابتكارات لتحويل المساحات إلى تجارب استثنائية.",
    "department_ar": "القيادة"
  }
]
```

**Query Parameters:**
- `is_featured=true|false` - Filter by featured status
- `department=Leadership` - Filter by department
- `search=Sarah` - Search by name, role, or department
- `ordering=order,-name` - Order results (prefix with - for descending)

### Core Values Endpoint

**URL:** `/api/v1/about/core-values/`

**Method:** GET

**Description:** Returns company core values.

**Response Example:**
```json
[
  {
    "id": 1,
    "title": "Excellence",
    "description": "We strive for excellence in every project, paying meticulous attention to detail.",
    "icon": "star",
    "order": 1,
    "title_ar": "التميز",
    "description_ar": "نسعى للتميز في كل مشروع، مع الاهتمام الدقيق بالتفاصيل."
  }
]
```

**Query Parameters:**
- `ordering=order` - Order results (prefix with - for descending)

### Testimonials Endpoint

**URL:** `/api/v1/about/testimonials/`

**Method:** GET

**Description:** Returns testimonials about the company.

**Response Example:**
```json
[
  {
    "id": 1,
    "client_name": "Ahmad Hassan",
    "quote": "Working with Archway was a fantastic experience. They truly transformed our home into a space that reflects our personality and lifestyle.",
    "project": "Residential Interior",
    "is_featured": true,
    "client_name_ar": "أحمد حسن",
    "quote_ar": "كان العمل مع آركواي تجربة رائعة. لقد حولوا منزلنا حقًا إلى مساحة تعكس شخصيتنا وأسلوب حياتنا.",
    "project_ar": "تصميم داخلي سكني"
  }
]
```

**Query Parameters:**
- `is_featured=true|false` - Filter by featured status
- `ordering=-created_at` - Order results (prefix with - for descending)

### Company History Endpoint

**URL:** `/api/v1/about/history/`

**Method:** GET

**Description:** Returns company history timeline events.

**Response Example:**
```json
[
  {
    "id": 1,
    "year": 2013,
    "title": "Founding of Archway",
    "description": "Archway Innovations was founded by a small team of passionate designers with a vision to transform interior spaces.",
    "title_ar": "تأسيس آركواي",
    "description_ar": "تأسست آركواي للابتكارات على يد فريق صغير من المصممين المتحمسين برؤية لتحويل المساحات الداخلية."
  }
]
```

**Query Parameters:**
- `ordering=-year` - Order results (prefix with - for descending)

### Company Statistics Endpoint

**URL:** `/api/v1/about/statistics/`

**Method:** GET

**Description:** Returns company statistics.

**Response Example:**
```json
[
  {
    "id": 1,
    "title": "Projects Completed",
    "value": 150,
    "unit": "+",
    "order": 1,
    "title_ar": "المشاريع المنجزة",
    "unit_ar": "+"
  }
]
```

**Query Parameters:**
- `ordering=order` - Order results (prefix with - for descending)

### Client Logos Endpoint

**URL:** `/api/v1/about/client-logos/`

**Method:** GET

**Description:** Returns client logos for display in the About page.

**Response Example:**
```json
[
  {
    "id": 1,
    "name": "ABC Corporation",
    "logo": "/media/clients/abc.png",
    "logo_url": "http://localhost:8000/media/clients/abc.png",
    "url": "https://abc-corp.com",
    "order": 1,
    "name_ar": "شركة إيه بي سي"
  }
]
```

**Query Parameters:**
- `ordering=order,name` - Order results (prefix with - for descending)

## Usage in Next.js Frontend

### Example Usage with the Combined Endpoint

```typescript
// src/lib/hooks/marketing/about/useAboutData.ts

import { useState, useEffect } from 'react';
import axios from 'axios';

export function useAboutData(locale: string = 'en') {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/v1/about/combined/?lang=${locale}`);
        setData(response.data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch about data'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [locale]);

  return { data, loading, error };
}
```

### Using the Hook in a Component

```tsx
// src/app/[locale]/(marketing)/about/AboutClient.tsx
'use client';

import React from 'react';
import { useAboutData } from '@/lib/hooks/marketing/about/useAboutData';
import { AboutHero } from '@/components/marketing/about/AboutHero';
import { MissionVision } from '@/components/marketing/about/MissionVision';
import { TeamSection } from '@/components/marketing/about/TeamSection';
import { LoadingState, ErrorMessage } from '@/components/ui';

interface AboutClientProps {
  locale: string;
}

export default function AboutClient({ locale }: AboutClientProps) {
  const { data, loading, error } = useAboutData(locale);
  
  if (loading) return <LoadingState />;
  if (error) return <ErrorMessage message={error.message} />;
  if (!data) return null;
  
  const { main_content, team_members, core_values, testimonials, statistics } = data;
  
  return (
    <div className="container mx-auto px-4 py-20">
      <AboutHero 
        title={main_content.title}
        subtitle={main_content.subtitle}
      />
      
      <MissionVision
        mission={{
          title: main_content.mission_title,
          description: main_content.mission_description
        }}
        vision={{
          title: main_content.vision_title,
          description: main_content.vision_description
        }}
      />
      
      <TeamSection 
        title={main_content.team_section_title}
        members={team_members}
      />
      
      {/* Additional sections for core values, testimonials, etc. */}
    </div>
  );
}
```

## Caching Considerations

The API implements server-side caching for improved performance:

- Main content is cached for 1 hour
- Combined data is cached with a language-specific key
- Team member lists are cached with query-specific keys

The frontend should implement appropriate caching strategies as well, such as:

- SWR or React Query for client-side caching and revalidation
- Prefetching data for common navigation paths
- Storing data in localStorage for offline support (if applicable)

## Error Handling

The API endpoints include proper error handling. Frontend components should:

1. Handle loading states with appropriate UI indicators
2. Display user-friendly error messages when API requests fail
3. Implement retry logic for transient errors
4. Provide fallback content when specific sections fail to load 