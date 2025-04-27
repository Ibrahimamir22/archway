# Footer Environment Configuration Guide

## Environment Files

The footer system is controlled by environment variables in these files:

- **`.env.development`**: Used in development environment
- **`.env.production`**: Used in production environment
- **`.env.test`**: Used in testing environment
- **`.env.local`**: Local overrides (not committed to the repository)

## Critical Environment Variables

| Variable | Purpose | Recommended Setting |
|----------|---------|-------------------|
| `NEXT_PUBLIC_USE_MOCK_API` | Whether to use the mock API | `true` in dev, `false` in prod |
| `NEXT_PUBLIC_PREFER_BACKEND` | Whether to try backend API first | `true` |
| `NEXT_PUBLIC_FALLBACK_TO_MOCK` | Whether to use fallback data when all else fails | `true` |
| `NEXT_PUBLIC_LOG_DATA_FETCHING` | Enable detailed logging | `true` in dev, `false` in prod |
| `NEXT_PUBLIC_MOCK_API_PATH` | Base path for mock API | `/api` |
| `NEXT_PUBLIC_API_URL` | Backend API URL (server-side) | See Docker section below |
| `NEXT_PUBLIC_API_BROWSER_URL` | Backend API URL (client-side) | See Docker section below |

## Environment Presets

### Development Environment

```bash
# .env.development
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_PREFER_BACKEND=true
NEXT_PUBLIC_FALLBACK_TO_MOCK=true
NEXT_PUBLIC_LOG_DATA_FETCHING=true
NEXT_PUBLIC_MOCK_API_PATH=/api
```

### Production Environment

```bash
# .env.production
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_PREFER_BACKEND=true
NEXT_PUBLIC_FALLBACK_TO_MOCK=true
NEXT_PUBLIC_LOG_DATA_FETCHING=false
NEXT_PUBLIC_MOCK_API_PATH=/api
```

### Testing Environment

```bash
# .env.test
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_PREFER_BACKEND=false
NEXT_PUBLIC_FALLBACK_TO_MOCK=true
NEXT_PUBLIC_LOG_DATA_FETCHING=true
NEXT_PUBLIC_MOCK_API_PATH=/api
```

## Docker Configuration

When using Docker, set these environment variables:

```bash
# For server-side requests (container to container)
NEXT_PUBLIC_API_URL=http://backend:8000/api/v1

# For client-side browser requests 
NEXT_PUBLIC_API_BROWSER_URL=http://localhost:8000/api/v1
```

These URLs are different because:
- Server-side requests happen inside the Docker network (use service name)
- Browser requests happen from outside Docker (use exposed port)

## Common Scenarios

### 1. Development Without Backend

When developing without a backend, use these settings:

```bash
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_PREFER_BACKEND=false
```

This forces the app to use the mock API, which gets data from translation files.

### 2. Development With Backend

When developing with a backend, use:

```bash
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_PREFER_BACKEND=true
```

This tries the backend first, but falls back to mock API if needed.

### 3. Production Setup

In production, use:

```bash
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_PREFER_BACKEND=true
NEXT_PUBLIC_FALLBACK_TO_MOCK=true
```

This prioritizes the backend but allows fallback to hardcoded data if needed.

## Troubleshooting Environment Issues

### Backend URL Issues

If you're having trouble connecting to the backend:

1. Check `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_API_BROWSER_URL` are correct
2. For Docker, ensure the service names match your `docker-compose.yml`
3. Verify the backend service is running
4. Make sure the port is properly exposed in Docker

### Mock API Issues

If the mock API isn't working:

1. Ensure `NEXT_PUBLIC_USE_MOCK_API=true`
2. Check that `NEXT_PUBLIC_MOCK_API_PATH=/api` matches your Next.js configuration
3. Ensure the mock API route exists at `src/app/api/footer/route.ts`

### Data Source Control

To see which data source is being used:

1. Set `NEXT_PUBLIC_LOG_DATA_FETCHING=true`
2. Check browser console for logs like: `[Fetcher] Successfully fetched from mock API`
3. Look for the `dataSource` value in logs (`mock`, `backend`, `backend+fallback`, or `fallback`) 