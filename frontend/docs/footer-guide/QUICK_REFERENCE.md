# Footer Quick Reference Guide

## Common Tasks

### 1. Fix Footer Translations Not Working

If footer text isn't translating properly:

```
# Enable the mock API in development environment
NEXT_PUBLIC_USE_MOCK_API=true

# Make sure fallback is enabled
NEXT_PUBLIC_FALLBACK_TO_MOCK=true
```

### 2. Test With Different Data Sources

```bash
# Use backend data only
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_PREFER_BACKEND=true

# Use mock API data only
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_PREFER_BACKEND=false

# Use both (try backend first, then mock)
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_PREFER_BACKEND=true
```

### 3. View Debug Logs

```bash
# Enable data fetching logs
NEXT_PUBLIC_LOG_DATA_FETCHING=true
```

Check browser console for logs showing which data source is being used.

### 4. Docker Setup

Make sure these are set correctly:

```bash
# In .env.development or .env.local
NEXT_PUBLIC_API_URL=http://backend:8000/api/v1  # For container-to-container
NEXT_PUBLIC_API_BROWSER_URL=http://localhost:8000/api/v1  # For browser
```

## Add New Footer Content

1. Add field to interface in `src/lib/fixtures/footer/footerData.ts`:

```typescript
export interface FooterData {
  // existing fields...
  my_new_field?: string;
}
```

2. Add to `mockFooterData` in same file:

```typescript
export const mockFooterData: FooterData = {
  // existing fields...
  my_new_field: 'Default value',
};
```

3. Add translations to `src/messages/en.json` and `src/messages/ar.json`:

```json
// en.json
{
  "footer": {
    // existing translations...
    "myNewField": "My new content in English"
  }
}

// ar.json
{
  "footer": {
    // existing translations...
    "myNewField": "محتواي الجديد بالعربية"
  }
}
```

4. Update `src/app/api/footer/route.ts` to use translations:

```typescript
// In route.ts within the GET function:
const footerData = {
  // existing fields...
  my_new_field: footer.myNewField || (finalLang === 'en' 
    ? "English default" 
    : "النص الافتراضي بالعربية"),
};
```

5. Update the Footer component to display the new content:

```tsx
// In Footer.tsx
<div>
  {footerData?.my_new_field && (
    <p>{footerData.my_new_field}</p>
  )}
</div>
```

## Architecture Reminder

```
Backend API → Mock API → Fallback Data (footerData.ts)
```

The system tries to fetch data in this order:
1. First tries real backend if available
2. Then tries mock API which reads from translations
3. Falls back to hardcoded data as last resort

## File Locations

- **Component**: `src/components/common/Footer/Footer.tsx`
- **Data Hook**: `src/lib/hooks/footer/useFooter.ts`
- **API Fetcher**: `src/lib/api/footer.ts`
- **Mock API**: `src/app/api/footer/route.ts`
- **Fallback Data**: `src/lib/fixtures/footer/footerData.ts`
- **Translations**: `src/messages/en.json` and `src/messages/ar.json`

## Common Issues

- **English text in Arabic view**: Enable mock API or ensure backend returns translated content
- **Footer not loading**: Check network requests and API URLs
- **Missing content**: Ensure all fields exist in each data source

For more detailed information, see the full documentation at:
[FOOTER_ARCHITECTURE_AND_BEST_PRACTICES.md](/docs/FOOTER_ARCHITECTURE_AND_BEST_PRACTICES.md) 