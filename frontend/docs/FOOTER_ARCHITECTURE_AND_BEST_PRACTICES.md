# Footer Architecture and Best Practices

## Overview

This document explains the complete architecture of the Archway footer system, which uses a hybrid data fetching approach to handle content from multiple sources with proper internationalization support. The system is designed to work seamlessly across development, testing, and production environments, with or without Docker.

## Table of Contents

1. [Architecture Components](#architecture-components)
2. [Data Flow Diagram](#data-flow-diagram)
3. [Environment Configuration](#environment-configuration)
4. [Internationalization Support](#internationalization-support)
5. [Best Practices](#best-practices)
6. [Troubleshooting Guide](#troubleshooting-guide)
7. [Enhancement Roadmap](#enhancement-roadmap)

## Architecture Components

### Data Sources (in order of priority)

1. **Backend API** - Production data from Django backend
2. **Mock API** - Local API endpoint that provides translated content in development
3. **Fallback Data** - Hardcoded structure as a last resort

### Key Files

- **`src/components/common/Footer/Footer.tsx`** - Main footer component
- **`src/lib/hooks/footer/useFooter.ts`** - React hook for accessing footer data
- **`src/lib/api/footer.ts`** - Footer-specific data fetcher
- **`src/lib/api/fetcher.ts`** - Generic hybrid fetching mechanism
- **`src/app/api/footer/route.ts`** - Mock API endpoint for footer data
- **`src/lib/fixtures/footer/footerData.ts`** - Last-resort fallback data
- **`src/messages/{locale}.json`** - Translation files for all text content

### Component Relationships

1. **Footer Component** - Uses the `useFooter` hook to access data
2. **useFooter Hook** - Uses footer.ts to fetch data
3. **footer.ts** - Uses fetcher.ts with footer-specific configuration
4. **fetcher.ts** - Implements the hybrid fetching logic using config
5. **route.ts** - Serves mock data with translations when the backend is unavailable
6. **footerData.ts** - Provides last-resort fallback structure

## Data Flow Diagram

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Footer    │◄─────┤  useFooter  │◄─────┤  footer.ts  │
│  Component  │      │    Hook     │      │             │
└─────────────┘      └─────────────┘      └──────┬──────┘
                                                 │
                                                 ▼
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│ Translation │      │   Mock API  │◄─────┤  fetcher.ts │
│    Files    │─────►│  route.ts   │      │             │
└─────────────┘      └─────────────┘      └──────┬──────┘
                                                 │
                                                 ▼
                                          ┌─────────────┐
                                          │ footerData  │
                                          │     .ts     │
                                          └─────────────┘
```

## Environment Configuration

The footer system's behavior is controlled through environment variables defined in:
- `.env.development` - Development environment
- `.env.production` - Production environment
- `.env.test` - Testing environment
- `.env.local` - Local overrides (not committed to repo)

### Critical Environment Variables

| Variable                     | Purpose                                  | Default Value |
|------------------------------|------------------------------------------|---------------|
| NEXT_PUBLIC_USE_MOCK_API     | Whether to try the mock API              | true (dev), false (prod) |
| NEXT_PUBLIC_PREFER_BACKEND   | Whether to prioritize backend API        | true          |
| NEXT_PUBLIC_FALLBACK_TO_MOCK | Whether to use fallback data if needed   | true          |
| NEXT_PUBLIC_LOG_DATA_FETCHING| Enable detailed logging for debugging    | true (dev), false (prod) |
| NEXT_PUBLIC_MOCK_API_PATH    | Base path for mock API                   | /api          |
| NEXT_PUBLIC_API_URL          | Backend API URL (server-side)            | http://backend:8000/api/v1 (Docker) |
| NEXT_PUBLIC_API_BROWSER_URL  | Backend API URL (client-side)            | http://localhost:8000/api/v1 |

### Environment Configurations

#### Development (`.env.development`)
```
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_PREFER_BACKEND=true
NEXT_PUBLIC_FALLBACK_TO_MOCK=true
NEXT_PUBLIC_LOG_DATA_FETCHING=true
```

#### Production (`.env.production`)
```
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_PREFER_BACKEND=true
NEXT_PUBLIC_FALLBACK_TO_MOCK=true
NEXT_PUBLIC_LOG_DATA_FETCHING=false
```

#### Testing (`.env.test`)
```
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_PREFER_BACKEND=false
NEXT_PUBLIC_FALLBACK_TO_MOCK=true
NEXT_PUBLIC_LOG_DATA_FETCHING=true
```

## Internationalization Support

The footer handles internationalization via:

1. **Translation Files**
   - Located in `src/messages/{locale}.json`
   - Contain all text in multiple languages (e.g., en.json, ar.json)

2. **Mock API Internationalization**
   - The mock API (`route.ts`) reads the current locale from request params
   - It then loads the appropriate translation file for that locale
   - This ensures mock data is properly translated even without a backend

3. **Translation Usage in Components**
   - Footer components use `useTranslations` hook from next-intl
   - Fallback to translations when backend data is missing or incomplete

### Translation Workflow

1. Browser makes request with locale
2. System tries backend API first
3. If backend fails, mock API reads translations for that locale
4. If both fail, component uses translation files directly

## Best Practices

### 1. API Data Structure

Ensure all text content from the backend API follows this structure:

```json
{
  "company_name": "Archway Innovations",
  "description": "We create stunning interior designs...",
  "copyright_text": "© 2025 Archway Innovations...",
  "newsletter_text": "Stay updated with our latest news...",
  "newsletter_label": "Subscribe to Our Newsletter",
  "contact_title": "Contact Us",
  "sections": [...],
  "social_links": [...],
  "contact_info": [...]
}
```

### 2. Adding New Footer Content

When adding new content to the footer:

1. Add field to `FooterData` interface in `footerData.ts`
2. Add field to `mockFooterData` object in `footerData.ts`
3. Add corresponding entry in translation files (en.json, ar.json)
4. Update `route.ts` to use the translation
5. Update `Footer.tsx` component to display the new content

### 3. Backend Development

When developing the backend API:
1. Ensure backend returns the same data structure as the mock API
2. Include a `lang` or `locale` parameter to support language switching
3. Always have a default value for each field

### 4. Docker Considerations

When using Docker:
1. Ensure `NEXT_PUBLIC_API_URL` points to the service name (e.g., `http://backend:8000/api/v1`)
2. Ensure `NEXT_PUBLIC_API_BROWSER_URL` points to the exposed port (e.g., `http://localhost:8000/api/v1`)

## Troubleshooting Guide

### Text Not Translating

**Problem**: Footer text appears in English despite switching to another language.

**Possible Causes and Solutions**:

1. **Mock API disabled**
   - Check if `NEXT_PUBLIC_USE_MOCK_API` is set to `true` in your environment
   - If in production, make sure backend is properly returning localized content

2. **Translation key missing**
   - Check if the key exists in the language files (e.g., ar.json)
   - Verify the structure matches what the component expects

3. **Backend providing hardcoded text**
   - Ensure backend is properly handling the locale parameter
   - Check if backend is returning language-specific content

### Footer Not Loading

**Problem**: Footer displays loading skeleton or error state.

**Possible Causes and Solutions**:

1. **API endpoints unreachable**
   - Check network tab in browser dev tools for failed requests
   - Verify API URLs are correct for your environment
   - Ensure backend service is running

2. **Fallback disabled**
   - Check if `NEXT_PUBLIC_FALLBACK_TO_MOCK` is set to `true`
   - If both backend and mock API fail, this setting ensures fallback data is used

3. **Error in data processing**
   - Enable `NEXT_PUBLIC_LOG_DATA_FETCHING` to see detailed logs
   - Check browser console for errors in transforming or rendering data

## Enhancement Roadmap

### Planned Improvements

1. **Translation Key System in Fallback Data**
   - Replace hardcoded strings with translation key references
   - Format: `__TRANSLATION_KEY__:footer.key.path`
   - This ensures even last-resort fallback data is properly translated

2. **Cache Implementation**
   - Add caching to reduce API calls
   - Implement browser storage for footer data
   - Add data freshness checks

3. **Visual Dev Indicators**
   - Add a subtle indicator when using fallback or mock data in development
   - Helps developers know which data source is being used

4. **Improved Error Recovery**
   - Add more granular fallbacks for individual sections
   - Implement retry logic with backoff for failed API calls

### Implementation Priority

1. Translation key system (High priority)
2. Visual dev indicators (Medium priority)
3. Improved error recovery (Medium priority)
4. Cache implementation (Low priority)

## Footer Component API Reference

The footer component accepts these props:

```typescript
interface FooterProps {
  // Any future props for customization
}
```

### Example Usage

```tsx
// Basic usage
<Footer />

// With the hook directly
const { footerData, loading, error } = useFooter();
```

### Data Interface

The core footer data interface:

```typescript
interface FooterData {
  company_name?: string;
  logo_url?: string;
  logo_alt?: string;
  description?: string;
  social_links: SocialMediaLink[];
  contact_info: ContactInfo[];
  sections: FooterSection[];
  copyright_text?: string;
  bottom_links?: FooterLink[];
  show_newsletter?: boolean;
  newsletter_text?: string;
  contact_title?: string;
  newsletter_label?: string;
  email?: string;
  phone?: string;
  address?: string;
}
```

---

## Quick Reference Guide

### Add a New Footer Section

1. Update `FooterData` interface in `footerData.ts`
2. Add to `mockFooterData` object
3. Add translations to language files
4. Update `route.ts` to use translation
5. Modify `Footer.tsx` to render new section

### Disable Mock API

```
NEXT_PUBLIC_USE_MOCK_API=false
```

### View Data Source Logs

```
NEXT_PUBLIC_LOG_DATA_FETCHING=true
```

### Force Backend Only

```
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_PREFER_BACKEND=true
```

### Force Mock API Only (Testing)

```
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_PREFER_BACKEND=false
``` 