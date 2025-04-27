# Footer Translation Troubleshooting

## Common Translation Issues

### Problem: English text showing in Arabic view

#### Quick Fixes:

1. **Enable the mock API**
   ```
   NEXT_PUBLIC_USE_MOCK_API=true
   ```

2. **Check that you're viewing the mock API responses**
   - Open browser dev tools → Network tab
   - Look for requests to `/api/footer`
   - Response should contain translated text

3. **Verify the locale parameter is being passed**
   - URL should include locale: `/ar/...`
   - Request parameters should include `?lang=ar`

## How Footer Translation Works

### Data Flow:

1. Footer component requests data via `useFooter` hook
2. System tries to fetch from backend API first
3. If backend unavailable or returns partial data, tries mock API
4. Mock API reads from translation files based on locale
5. If all fail, falls back to hardcoded data in `footerData.ts`

### Translation Sources:

- **Backend API**: Should return localized data based on language parameter
- **Mock API**: Reads from translation files in `src/messages/{locale}.json`
- **Fallback Data**: Contains hardcoded English text (doesn't support translation)

## Fixing Specific Translation Issues

### 1. Company Name/Description Not Translating

Check:
```typescript
// In Footer.tsx, ensure it has this logic:
const companyName = footerData?.company_name || t('companyInfo.name');
const description = footerData?.description || t('companyInfo.description');
```

### 2. Newsletter Text Not Translating

Check:
```typescript
// In Footer.tsx, ensure it has this logic:
const newsletterText = footerData?.newsletter_text || t('newsletter.description');
const newsletterLabel = footerData?.newsletter_label || t('newsletter.title');
```

### 3. All Sections Not Translating

Check that mock API is enabled. Mock API is currently the best way to ensure all content is properly translated.

## Testing Translation

To test that translations are working:

1. Switch language in UI (click language toggle)
2. Enable mock API if needed:
   ```
   NEXT_PUBLIC_USE_MOCK_API=true
   ```
3. Check browser console for data source logs:
   ```
   NEXT_PUBLIC_LOG_DATA_FETCHING=true
   ```
4. Verify that the correct locale file is being loaded:
   - `src/messages/en.json` for English
   - `src/messages/ar.json` for Arabic

## Adding New Translated Content

1. Add to English translation file (`src/messages/en.json`):
   ```json
   "footer": {
     "newSection": "New Section Text"
   }
   ```

2. Add to Arabic translation file (`src/messages/ar.json`):
   ```json
   "footer": {
     "newSection": "نص القسم الجديد"
   }
   ```

3. Update mock API (`route.ts`) to use the translation:
   ```typescript
   new_section: footer.newSection || (finalLang === 'en' 
     ? "Default English" 
     : "النص الافتراضي بالعربية"),
   ```

4. In the component, add fallback to translations:
   ```typescript
   const newSectionText = footerData?.new_section || t('newSection');
   ```

## Translation Key System (Future Enhancement)

A planned enhancement is to use translation keys in the fallback data:

```typescript
// Instead of:
newsletter_text: 'Stay updated with our latest news and offers.'

// Use:
newsletter_text: '__TRANSLATION_KEY__:footer.newsletter.description'
```

This would ensure that even the hardcoded fallback data would be properly translated. 