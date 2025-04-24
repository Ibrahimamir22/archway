# Footer Component

The footer component uses a hybrid data fetching approach that allows it to work with either backend data, mock data, or a combination of both.

## Data Flow

1. User visits a page with the Footer component
2. Footer component calls the `useFooter` hook
3. Hook fetches data using this pipeline:
   - Try backend API if enabled and preferred
   - Try mock API if enabled
   - Fall back to default data if needed
4. Footer renders with the data, regardless of source

## Configuration

The footer's data source is controlled by environment variables:

- `NEXT_PUBLIC_USE_MOCK_API` - Whether to enable mock API
- `NEXT_PUBLIC_PREFER_BACKEND` - Whether to try backend first
- `NEXT_PUBLIC_FALLBACK_TO_MOCK` - Whether to use mock data as fallback
- `NEXT_PUBLIC_LOG_DATA_FETCHING` - Whether to log data fetching details

## Docker Considerations

When running in Docker:
- Server-side fetches should use: `http://backend:8000/api/v1/...`
- Browser-side fetches should use: `http://localhost:8000/api/v1/...`

These values are configured in the environment files and handled automatically by the fetching mechanism.

## Files

- `components/common/Footer/Footer.tsx` - Main component
- `lib/hooks/footer/useFooter.ts` - React hook
- `lib/api/footer.ts` - Footer-specific fetcher
- `lib/api/fetcher.ts` - Generic hybrid fetcher mechanism
- `lib/utils/footerUtils.ts` - Data transformation
- `lib/fixtures/footer/footerData.ts` - Fallback data
- `app/api/footer/route.ts` - Mock API endpoint

## Troubleshooting

### Switching to Mock API Only

To use only the mock API during development or testing, set:
```
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_PREFER_BACKEND=false
```

### Backend API Not Working

If the backend API isn't responding as expected:
1. Check that the backend is running
2. Verify API endpoints in `lib/api/footer.ts`
3. Enable detailed logging with `NEXT_PUBLIC_LOG_DATA_FETCHING=true`
4. Check browser console for fetch debugging logs

### Updating Mock Data

To modify the mock/fallback data:
1. Edit `lib/fixtures/footer/footerData.ts`
2. If needed, update the mock API in `app/api/footer/route.ts` 