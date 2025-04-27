# About Page API Interface (Implementation Status)

This document outlines the API interface specifications for the About page components and tracks their implementation status.

## API Endpoints - Current Implementation

### 1. Main Content Endpoint

**Endpoint:** `/api/v1/about/`  
**Method:** `GET`  
**Status:** ✅ Implemented

**Query Parameters:**
- `localized=true` - Returns only the fields for the requested language
- `lang=en|ar` - Specifies the language for localized content (default: en)

**Response Schema:**
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
  "meta_description": "Learn about Archway Innovations, our mission, vision, and the team behind our interior design expertise."
}
```

### 2. Combined Data Endpoint

**Endpoint:** `/api/v1/about/combined/`  
**Method:** `GET`  
**Status:** ✅ Implemented

**Query Parameters:**
- `lang=en|ar` - Specifies the language for localized content (default: en)

**Response Schema:**
```json
{
  "main_content": {
    // AboutPage data (as in endpoint 1)
  },
  "team_members": [
    // Team members data (as in endpoint 3)
  ],
  "core_values": [
    // Core Values data (as in endpoint 4)
  ],
  "testimonials": [
    // Testimonials data (as in endpoint 5)
  ],
  "company_history": [
    // Company History data (as in endpoint 6)
  ],
  "statistics": [
    // Company Statistics data (as in endpoint 7)
  ],
  "client_logos": [
    // Client Logos data (as in endpoint 8)
  ],
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

### 3. Team Members

**Endpoint:** `/api/v1/about/team/`  
**Method:** `GET`  
**Status:** ✅ Implemented

**Query Parameters:**
- `is_featured=true|false` - Filter by featured status
- `department=Leadership` - Filter by department
- `search=Sarah` - Search by name, role, or department
- `ordering=order,-name` - Order results (prefix with - for descending)

**Response Schema:**
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

### 4. Core Values

**Endpoint:** `/api/v1/about/core-values/`  
**Method:** `GET`  
**Status:** ✅ Implemented

**Query Parameters:**
- `ordering=order` - Order results (prefix with - for descending)

**Response Schema:**
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

### 5. Testimonials

**Endpoint:** `/api/v1/about/testimonials/`  
**Method:** `GET`  
**Status:** ✅ Implemented

**Query Parameters:**
- `is_featured=true|false` - Filter by featured status
- `ordering=-created_at` - Order results (prefix with - for descending)

**Response Schema:**
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

### 6. Company History

**Endpoint:** `/api/v1/about/history/`  
**Method:** `GET`  
**Status:** ✅ Implemented

**Query Parameters:**
- `ordering=-year` - Order results (prefix with - for descending)

**Response Schema:**
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

### 7. Company Statistics

**Endpoint:** `/api/v1/about/statistics/`  
**Method:** `GET`  
**Status:** ✅ Implemented

**Query Parameters:**
- `ordering=order` - Order results (prefix with - for descending)

**Response Schema:**
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

### 8. Client Logos

**Endpoint:** `/api/v1/about/client-logos/`  
**Method:** `GET`  
**Status:** ✅ Implemented

**Query Parameters:**
- `ordering=order,name` - Order results (prefix with - for descending)

**Response Schema:**
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

## Important Implementation Notes

### Data Management Command

The Django backend includes a custom management command for managing About page data:

```bash
# Export data to a JSON file
python manage.py about_data export --file=about_backup.json

# Import data from a JSON file
python manage.py about_data import --file=about_backup.json

# Reset data to default values
python manage.py about_data reset
```

### Caching

The API implements caching for improved performance:
- Main content is cached for 1 hour
- Combined data is cached with a language-specific key
- Team members lists are cached with query-specific keys

### Frontend Integration

To integrate with the frontend, use the `useAboutData` hook:

```typescript
// Import the hook
import { useAboutData } from '@/lib/hooks/marketing/about';

// Inside your component
const { data, isLoading, error, isFallback, tryAgain } = useAboutData(locale, {
  useMockData: process.env.NEXT_PUBLIC_USE_MOCK_API === 'true'
});

// Then access data properties
const { main_content, team_members, core_values, testimonials } = data || {};
```

## Future Enhancements

While the core APIs are implemented, some planned enhancements for future phases include:

1. Advanced filtering options
2. Pagination for large datasets
3. Image optimization endpoints
4. Search functionality
5. Admin-specific API operations 