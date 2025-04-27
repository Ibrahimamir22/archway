# About App Documentation

## Overview
The About app is a Django application that provides content management for the About page of the Archway Innovations website. It includes models for managing team member information, testimonials, core values, company history, statistics, and more.

## Features
- Complete content management for the About page through the Django admin interface
- REST API endpoints for retrieving About page content
- Multilingual support for English and Arabic content
- Support for team member profiles with images and social links
- Company history timeline and statistics
- Core values presentation
- Client testimonials management
- Client logo management

## Models
The app includes the following models:

1. **AboutPage** - Core content for the About page, including mission and vision statements
2. **TeamMember** - Information about team members, including name, role, bio, and image
3. **CoreValue** - Company core values with title, description, and icon
4. **Testimonial** - Client testimonials with quotes and attribution
5. **CompanyHistory** - Timeline of company history milestones
6. **CompanyStatistic** - Key company statistics and metrics
7. **ClientLogo** - Client logos for display in a partner/client section

## API Endpoints
The app provides the following API endpoints:

- `GET /api/about/` - Retrieve complete About page data
- `GET /api/about/team/` - Retrieve team member data
- `GET /api/about/values/` - Retrieve core values data
- `GET /api/about/testimonials/` - Retrieve testimonials data
- `GET /api/about/history/` - Retrieve company history data
- `GET /api/about/stats/` - Retrieve company statistics data
- `GET /api/about/clients/` - Retrieve client logos

## Usage Guide for Frontend Developers
To integrate the About page content in a frontend application:

1. Fetch the complete About page data from `/api/about/`
2. Use the appropriate data objects to render each section:
   - `aboutPage` for the main content, mission, and vision
   - `teamMembers` for the team section
   - `coreValues` for the core values section
   - `testimonials` for the testimonials section
   - `companyHistory` for the history timeline
   - `companyStatistics` for the statistics section
   - `clientLogos` for the client/partner logos

All text content is available in both English and Arabic, with field names like `title`/`title_ar`, `description`/`description_ar`, etc.

## Data Management Commands
The app includes management commands for importing, exporting, and resetting About page data:

### JSON Data Management
The `about_data` command allows for importing, exporting, and resetting About page data to/from JSON:

```bash
# Export all About page data to JSON
python manage.py about_data export

# Import About page data from JSON
python manage.py about_data import --file=about_data.json

# Reset About page data to default values
python manage.py about_data reset
```

### Markdown Data Management
The `export_import_about` command provides a more human-friendly approach to content management using markdown files:

```bash
# Export About page content to markdown files (both languages)
python manage.py export_import_about export --dir=about_content

# Export only English content
python manage.py export_import_about export --dir=about_content --lang=en

# Export only Arabic content
python manage.py export_import_about export --dir=about_content --lang=ar

# Import content from markdown files
python manage.py export_import_about import --dir=about_content
```

This creates a directory structure with markdown files organized by content type:
```
about_content/
├── about/          # Main About page content
├── team/           # Team member profiles
├── values/         # Core values
├── testimonials/   # Client testimonials
├── history/        # Company history events
├── stats/          # Company statistics
└── clients/        # Client logos
```

The markdown format makes it easy to edit content in any text editor or markdown editor, making it ideal for content writers who prefer working with text files rather than the admin interface.

## Installation and Setup
1. Add `'apps.about'` to `INSTALLED_APPS` in your Django settings
2. Run migrations to create the database tables:
   ```bash
   python manage.py migrate about
   ```
3. Register the app's URLs in your project's URL configuration:
   ```python
   urlpatterns = [
       # ... other URL patterns ...
       path('api/about/', include('apps.about.urls')),
   ]
   ```
4. The About app admin interface will be available at `/admin/about/`

## Development and Extension
To extend the About app:

1. Add new models in `models.py` for additional content types
2. Create serializers in `serializers.py` for your new models
3. Add views in `views.py` to serve the new content
4. Register URL patterns in `urls.py` for accessing the new content
5. Update the data management commands to handle your new models

Always follow Django best practices and include comprehensive docstrings and comments in your code. 