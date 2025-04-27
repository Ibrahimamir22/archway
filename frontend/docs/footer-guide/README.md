# Footer Guide

This folder contains quick reference guides for working with the Archway footer system. These guides are designed to help you quickly find solutions to common problems and remember how the system works.

## Available Guides

- [Quick Reference](./QUICK_REFERENCE.md) - Simple steps for common footer tasks
- [Translation Troubleshooting](./TRANSLATION_TROUBLESHOOTING.md) - How to fix translation issues
- [Environment Setup](./ENVIRONMENT_SETUP.md) - Guide to configuring environments

## What's the Footer System?

The Archway footer uses a hybrid data fetching approach with three potential data sources:

1. **Backend API** - Production data from Django
2. **Mock API** - Local Next.js API route that serves translated content
3. **Fallback Data** - Hardcoded structure as a last resort

This architecture ensures that:
- Content can be managed from the backend CMS in production
- Translations work properly during development
- The footer never fails to render, even if all APIs are down

## Most Common Issues and Quick Fixes

### 1. Footer Text Not Translating

```bash
# Add to your .env.local file:
NEXT_PUBLIC_USE_MOCK_API=true
```

This enables the mock API, which reads from translation files.

### 2. Footer Not Loading at All

Check your network requests and API URLs. Make sure:
```bash
# For Docker setup:
NEXT_PUBLIC_API_URL=http://backend:8000/api/v1
NEXT_PUBLIC_API_BROWSER_URL=http://localhost:8000/api/v1
```

### 3. Testing Without Backend

To develop without needing the backend:
```bash
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_PREFER_BACKEND=false
```

## Further Reading

For more detailed information, see the complete documentation:
[Footer Architecture and Best Practices](/docs/FOOTER_ARCHITECTURE_AND_BEST_PRACTICES.md) 