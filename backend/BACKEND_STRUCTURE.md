# Archway Backend Structure (Django)

This document outlines the current project structure for the Archway Django backend, designed for scalability, maintainability, and robustness.

## Current Directory Structure (Implemented)

```
.
├── apps/                           # Container for individual Django applications (features/domains)
│   ├── __init__.py                 # Makes apps a Python package
│   ├── analytics/                  # App: Analytics tracking and reporting (Placeholder - Future Implementation)
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── migrations/
│   │   └── models.py               # Basic model structure
│   ├── blog/                       # App: Blog articles and content (Placeholder - In Progress)
│   │   ├── __init__.py
│   │   ├── apps.py                 # App config (7 lines)
│   │   ├── migrations/
│   │   └── models.py               # Basic model structure (9 lines)
│   ├── bookings/                   # App: Booking system for client appointments (Placeholder - Future Implementation)
│   │   ├── __init__.py
│   │   ├── apps.py                 # App config (7 lines) 
│   │   ├── migrations/
│   │   └── models.py               # Basic model structure (9 lines)
│   ├── chatbot/                    # App: Chatbot functionality (Placeholder - Future Implementation)
│   │   ├── __init__.py
│   │   ├── apps.py                 # App config (7 lines)
│   │   ├── migrations/
│   │   └── models.py               # Basic model structure (9 lines)
│   ├── contact/                    # App: Contact form and inquiries (Inactive)
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── tests.py
│   │   └── views.py
│   ├── contact_management/         # App: Contact/lead management (Active)
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── tests.py
│   │   └── views.py
│   ├── email_system/               # App: Email sending and templating (Active)
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── tests.py
│   │   └── views.py
│   ├── faqs/                       # App: Frequently Asked Questions (Active)
│   │   ├── __init__.py             # (1 line)
│   │   ├── admin.py                # Django admin (64 lines)
│   │   ├── apps.py                 # App config (8 lines)
│   │   ├── migrations/             # Database migrations
│   │   ├── models.py               # FAQ models (111 lines)
│   │   ├── serializers.py          # DRF serializers (88 lines)
│   │   ├── urls.py                 # URL patterns (13 lines)
│   │   └── views.py                # API views (209 lines)
│   ├── footer/                     # App: Footer content management (Active)
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── tests.py
│   │   └── views.py
│   ├── jobs/                       # App: Job postings and career info (Placeholder - In Progress)
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── migrations/
│   │   └── models.py
│   ├── newsletter/                 # App: Newsletter subscription management (Active)
│   │   ├── __init__.py
│   │   ├── admin.py
│   │   ├── apps.py
│   │   ├── migrations/
│   │   ├── models.py
│   │   ├── tests.py
│   │   └── views.py
│   ├── projects/                   # App: Portfolio projects (Active - Core Functionality)
│   │   ├── __init__.py
│   │   ├── admin.py                # Django admin (156 lines)
│   │   ├── apps.py                 # App config (7 lines)
│   │   ├── migrations/             # Database migrations
│   │   ├── models.py               # Project models (132 lines)
│   │   ├── serializers.py          # DRF serializers (252 lines)
│   │   ├── tests.py                # Tests (4 lines, placeholder)
│   │   ├── views.py                # API views (150 lines)
│   │   └── management/             # Custom Django commands
│   │       ├── __init__.py
│   │       └── commands/
│   │           ├── __init__.py
│   │           ├── wait_for_db.py              # Database connection check (38 lines)
│   │           ├── list_admin_models.py        # Lists available admin models (10 lines)
│   │           └── check_static.py             # Static file check (36 lines)
│   ├── services/                   # App: Services offered (Active - Core Functionality)
│   │   ├── __init__.py
│   │   ├── admin.py                # Django admin (47 lines)
│   │   ├── apps.py                 # App config (8 lines)
│   │   ├── migrations/             # Database migrations
│   │   ├── models.py               # Service models (112 lines)
│   │   ├── serializers.py          # DRF serializers (204 lines)
│   │   ├── tests.py                # Tests (4 lines, placeholder)
│   │   ├── urls.py                 # URL patterns (11 lines)
│   │   └── views.py                # API views (110 lines)
│   ├── testimonials/               # App: Client testimonials (Placeholder - In Progress)
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── migrations/
│   │   └── models.py
│   └── users/                      # App: User management (Inactive)
│       ├── __init__.py
│       ├── admin.py
│       ├── apps.py
│       ├── migrations/
│       ├── models.py
│       ├── tests.py
│       └── views.py
│
├── interior_platform/              # Main Django project configuration
│   ├── __init__.py
│   ├── asgi.py                     # ASGI configuration (20 lines)
│   ├── management/                 # Project-level management commands
│   ├── settings/                   # Split settings for different environments
│   │   ├── __init__.py             # Settings initializer (1 line)
│   │   ├── base.py                 # Base settings (265 lines)
│   │   ├── development.py          # Development settings (37 lines)
│   │   └── production.py           # Production settings (64 lines)
│   ├── urls.py                     # Root URL configuration (112 lines)
│   └── wsgi.py                     # WSGI configuration (19 lines)
│
├── static/                         # Static files (CSS, JS, images)
│
├── staticfiles/                    # Collected static files
│
├── media/                          # User uploaded files
│
├── templates/                      # Django templates
│
├── utils/                          # Shared utility functions
│   ├── __init__.py
│   └── security.py                 # Security utilities (98 lines)
│
├── .env                            # Environment variables (39 lines)
├── Dockerfile                      # Docker configuration (104 lines)
├── manage.py                       # Django management script (25 lines)
├── requirements-dev.txt            # Development dependencies (14 lines)
└── requirements.txt                # Production dependencies (28 lines)
```

## Key Architectural Patterns

### Project Structure

1. **App-Based Organization:** Code is organized into domain-specific Django apps, each focusing on a specific feature or domain area.

2. **Split Settings:** Environment-specific settings are separated into `base.py`, `development.py`, and `production.py`.

3. **Utility Module:** Common, cross-cutting utilities are kept in the `utils` package.

### Code Organization Within Apps

The implemented apps follow a standard Django organization:

1. **Models (`models.py`):** Database schema definitions using Django's ORM.

2. **Views (`views.py`):** Django REST Framework views for API endpoints.

3. **Serializers (`serializers.py`):** DRF serializers for data validation and transformation.

4. **Admin (`admin.py`):** Django admin interface configuration.

5. **URLs (`urls.py`):** App-specific URL routing.

6. **Management Commands:** Custom Django management commands in `management/commands/`.

## Existing Apps Overview

| App | Status | Purpose | Key Components |
|-----|--------|---------|----------------|
| projects | **ACTIVE** | Portfolio project management | Project models, serializers, admin |
| services | **ACTIVE** | Services offered by the company | Service models, serializers, admin |
| users | **INACTIVE** | User management | User models and authentication |
| contact | **INACTIVE** | Contact form handling | Contact models and form processing |
| contact_management | **ACTIVE** | Lead management | Contact storage and categorization |
| email_system | **ACTIVE** | Email functionality | Email templates and sending |
| faqs | **ACTIVE** | FAQ management | FAQ models, categories, serializers, admin |
| footer | **ACTIVE** | Footer content | Footer text and link management |
| newsletter | **ACTIVE** | Newsletter subscriptions | Subscription management |
| blog | **INPROGRESS** | Blog content management | Basic model structure only |
| bookings | **INPROGRESS** | Appointment booking | Basic model structure only |
| chatbot | **PLACEHOLDER** | Chatbot functionality | Basic model structure only |
| jobs | **INPROGRESS** | Career/job postings | Basic model structure only |
| testimonials | **INPROGRESS** | Client testimonials | Basic model structure only |
| analytics | **PLACEHOLDER** | Usage analytics | Basic model structure only |

## Items To Be Implemented

### Future Applications
The following apps exist as placeholder structures and will be fully implemented in future phases:

1. **Blog System:** Content management for blog articles and posts
2. **Booking System:** Client appointment scheduling and management
3. **Chatbot:** Interactive customer support chatbot
4. **Jobs Board:** Career opportunities and job postings
5. **Testimonials:** Client testimonial display and management
6. **Analytics:** Usage tracking and reporting

### Architectural Improvements

1. **Service Layer (`services.py`):** Add service layer modules to separate business logic from views.

2. **Testing Infrastructure:** Expand beyond placeholder tests with proper test cases and factories.

3. **Permissions System:** Implement proper permission classes for fine-grained access control.

4. **Selectors Layer:** Add selectors for complex database queries.

5. **OpenAPI Documentation:** Implement API documentation using DRF Spectacular or similar.

6. **Advanced Security Features:** CSRF protection, rate limiting, etc.

7. **Caching Layer:** Implement caching for performance improvement.

8. **Background Tasks:** Add Celery integration for asynchronous processing.

## Best Practices to Follow

1. **Keep Views Thin:** Move business logic from views to service modules.

2. **Consistent API Responses:** Use consistent response formatting across all endpoints.

3. **Type Annotations:** Add type hints to functions for better IDE support and documentation.

4. **Error Handling:** Implement proper exception handling throughout the codebase.

5. **Test Coverage:** Aim for good test coverage for models, services, and API endpoints.

6. **API Versioning:** Implement API versioning for backwards compatibility.

7. **Logging:** Implement structured logging for better debugging.

Refer to this updated structure when creating new features or expanding existing functionality. 