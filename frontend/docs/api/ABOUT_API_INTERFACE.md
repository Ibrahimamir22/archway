# About Page API Interface

This document outlines the API interface specifications for the About page components. It serves as a reference for both frontend and backend developers to ensure consistent data structures and endpoint design.

## API Endpoints

### 1. Team Members

**Endpoint:** `/api/marketing/team-members`  
**Method:** `GET`  
**Query Parameters:**
- `locale` (string): Language code (e.g., 'en', 'ar')
- `department` (string, optional): Filter by department
- `limit` (number, optional): Limit the number of results
- `featured` (boolean, optional): Return only featured team members

**Response Schema:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "position": "string",
      "department": "string",
      "bio": "string",
      "profileImage": "string",
      "order": "number",
      "featured": "boolean",
      "social": {
        "linkedin": "string (optional)",
        "twitter": "string (optional)",
        "email": "string (optional)"
      },
      "skills": ["string (optional)"],
      "isPriority": "boolean (optional)"
    }
  ],
  "meta": {
    "total": "number",
    "departments": ["string"]
  }
}
```

### 2. Testimonials

**Endpoint:** `/api/marketing/testimonials`  
**Method:** `GET`  
**Query Parameters:**
- `locale` (string): Language code (e.g., 'en', 'ar')
- `category` (string, optional): Filter by category
- `limit` (number, optional): Limit the number of results
- `featured` (boolean, optional): Return only featured testimonials

**Response Schema:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "author": "string",
      "position": "string",
      "company": "string",
      "content": "string",
      "imageUrl": "string (optional)",
      "rating": "number (1-5)",
      "category": "string",
      "featured": "boolean",
      "order": "number"
    }
  ],
  "meta": {
    "total": "number",
    "categories": ["string"]
  }
}
```

### 3. Core Values

**Endpoint:** `/api/marketing/core-values`  
**Method:** `GET`  
**Query Parameters:**
- `locale` (string): Language code (e.g., 'en', 'ar')

**Response Schema:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "icon": "string (icon key)",
      "order": "number"
    }
  ]
}
```

### 4. Company History

**Endpoint:** `/api/marketing/company-history`  
**Method:** `GET`  
**Query Parameters:**
- `locale` (string): Language code (e.g., 'en', 'ar')

**Response Schema:**
```json
{
  "success": true,
  "data": {
    "eras": [
      {
        "id": "string",
        "name": "string",
        "description": "string (optional)",
        "order": "number"
      }
    ],
    "events": [
      {
        "id": "string",
        "title": "string",
        "description": "string",
        "year": "number",
        "era": "string (era id)",
        "imageUrl": "string (optional)",
        "order": "number"
      }
    ]
  }
}
```

### 5. Company Stats

**Endpoint:** `/api/marketing/company-stats`  
**Method:** `GET`  
**Query Parameters:**
- `locale` (string): Language code (e.g., 'en', 'ar')

**Response Schema:**
```json
{
  "success": true,
  "data": {
    "stats": [
      {
        "id": "string",
        "title": "string",
        "value": "number",
        "prefix": "string (optional)",
        "suffix": "string (optional)",
        "description": "string (optional)",
        "icon": "string (icon key)",
        "order": "number"
      }
    ],
    "meta": {
      "description": "string (optional)",
      "title": "string (optional)"
    }
  }
}
```

### 6. Client Logos

**Endpoint:** `/api/marketing/client-logos`  
**Method:** `GET`  
**Query Parameters:**
- `locale` (string): Language code (e.g., 'en', 'ar')
- `category` (string, optional): Filter by category

**Response Schema:**
```json
{
  "success": true,
  "data": [
    {
      "id": "string",
      "name": "string",
      "logoUrl": "string",
      "websiteUrl": "string (optional)",
      "category": "string",
      "featured": "boolean",
      "order": "number"
    }
  ],
  "meta": {
    "total": "number",
    "categories": ["string"]
  }
}
```

### 7. Mission & Vision

**Endpoint:** `/api/marketing/mission-vision`  
**Method:** `GET`  
**Query Parameters:**
- `locale` (string): Language code (e.g., 'en', 'ar')

**Response Schema:**
```json
{
  "success": true,
  "data": {
    "mission": {
      "title": "string",
      "content": "string",
      "icon": "string (icon key)"
    },
    "vision": {
      "title": "string",
      "content": "string",
      "icon": "string (icon key)"
    }
  }
}
```

### 8. Combined About Data

**Endpoint:** `/api/marketing/about`  
**Method:** `GET`  
**Query Parameters:**
- `locale` (string): Language code (e.g., 'en', 'ar')
- `sections` (string, optional): Comma-separated list of sections to include (e.g., 'mission-vision,team,stats')

**Response Schema:**
```json
{
  "success": true,
  "data": {
    "hero": {
      "title": "string",
      "subtitle": "string",
      "backgroundImage": "string (optional)"
    },
    "missionVision": {
      // Mission & Vision data (as in endpoint 7)
    },
    "coreValues": [
      // Core Values data (as in endpoint 3)
    ],
    "teamMembers": {
      "featured": [
        // Featured Team Members (as in endpoint 1)
      ],
      "meta": {
        "total": "number",
        "departments": ["string"]
      }
    },
    "testimonials": {
      "featured": [
        // Featured Testimonials (as in endpoint 2)
      ],
      "meta": {
        "total": "number",
        "categories": ["string"]
      }
    },
    "companyStats": {
      // Company Stats data (as in endpoint 5)
    },
    "clientLogos": {
      "featured": [
        // Featured Client Logos (as in endpoint 6)
      ],
      "meta": {
        "total": "number",
        "categories": ["string"]
      }
    },
    "companyHistory": {
      // Company History data (as in endpoint 4)
    }
  }
}
```

## Django Models (Proposed)

### TeamMember Model

```python
class TeamMember(models.Model):
    name = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    department = models.CharField(max_length=255)
    bio = models.TextField()
    profile_image = models.ImageField(upload_to='team/')
    order = models.IntegerField(default=0)
    featured = models.BooleanField(default=False)
    linkedin_url = models.URLField(blank=True, null=True)
    twitter_url = models.URLField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    skills = models.JSONField(blank=True, null=True)
    is_priority = models.BooleanField(default=False)
    
    # Translations
    name_ar = models.CharField(max_length=255, blank=True, null=True)
    position_ar = models.CharField(max_length=255, blank=True, null=True)
    department_ar = models.CharField(max_length=255, blank=True, null=True)
    bio_ar = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name
```

### Testimonial Model

```python
class Testimonial(models.Model):
    author = models.CharField(max_length=255)
    position = models.CharField(max_length=255)
    company = models.CharField(max_length=255)
    content = models.TextField()
    image_url = models.ImageField(upload_to='testimonials/', blank=True, null=True)
    rating = models.IntegerField(default=5, validators=[MinValueValidator(1), MaxValueValidator(5)])
    category = models.CharField(max_length=255)
    featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    # Translations
    author_ar = models.CharField(max_length=255, blank=True, null=True)
    position_ar = models.CharField(max_length=255, blank=True, null=True)
    company_ar = models.CharField(max_length=255, blank=True, null=True)
    content_ar = models.TextField(blank=True, null=True)
    category_ar = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return f"{self.author} - {self.company}"
```

### CoreValue Model

```python
class CoreValue(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    icon = models.CharField(max_length=100)
    order = models.IntegerField(default=0)
    
    # Translations
    title_ar = models.CharField(max_length=255, blank=True, null=True)
    description_ar = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.title
```

### CompanyTimeline Model

```python
class TimelineEra(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    order = models.IntegerField(default=0)
    
    # Translations
    name_ar = models.CharField(max_length=255, blank=True, null=True)
    description_ar = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.name

class TimelineEvent(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    year = models.IntegerField()
    era = models.ForeignKey(TimelineEra, on_delete=models.CASCADE, related_name='events')
    image_url = models.ImageField(upload_to='timeline/', blank=True, null=True)
    order = models.IntegerField(default=0)
    
    # Translations
    title_ar = models.CharField(max_length=255, blank=True, null=True)
    description_ar = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.year}: {self.title}"
```

### CompanyStat Model

```python
class CompanyStat(models.Model):
    title = models.CharField(max_length=255)
    value = models.DecimalField(max_digits=10, decimal_places=2)
    prefix = models.CharField(max_length=10, blank=True, null=True)
    suffix = models.CharField(max_length=10, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    icon = models.CharField(max_length=100)
    order = models.IntegerField(default=0)
    
    # Translations
    title_ar = models.CharField(max_length=255, blank=True, null=True)
    description_ar = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.title
```

### ClientLogo Model

```python
class ClientLogo(models.Model):
    name = models.CharField(max_length=255)
    logo_url = models.ImageField(upload_to='clients/')
    website_url = models.URLField(blank=True, null=True)
    category = models.CharField(max_length=255)
    featured = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    # Translations
    name_ar = models.CharField(max_length=255, blank=True, null=True)
    category_ar = models.CharField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return self.name
```

### MissionVision Model

```python
class MissionVision(models.Model):
    mission_title = models.CharField(max_length=255)
    mission_content = models.TextField()
    mission_icon = models.CharField(max_length=100)
    vision_title = models.CharField(max_length=255)
    vision_content = models.TextField()
    vision_icon = models.CharField(max_length=100)
    
    # Translations
    mission_title_ar = models.CharField(max_length=255, blank=True, null=True)
    mission_content_ar = models.TextField(blank=True, null=True)
    vision_title_ar = models.CharField(max_length=255, blank=True, null=True)
    vision_content_ar = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return "Mission & Vision"
    
    class Meta:
        verbose_name_plural = "Mission & Vision"
```

## Implementation Notes

1. All endpoints should support internationalization via the `locale` parameter.
2. Error responses should follow this format:
   ```json
   {
     "success": false,
     "error": {
       "code": "string",
       "message": "string"
     }
   }
   ```
3. For optimization, consider implementing:
   - Response caching with appropriate cache headers
   - Partial response with the `fields` parameter
   - Pagination for endpoints that return large collections

4. Authentication requirements: 
   - GET endpoints: No authentication required
   - Admin-only operations: JWT authentication with admin role

5. Planned Backend Implementation Timeline:
   - Phase 1: Create Django models and migrations
   - Phase 2: Implement API endpoints with DRF
   - Phase 3: Add admin interface customizations
   - Phase 4: Implement caching and optimization 