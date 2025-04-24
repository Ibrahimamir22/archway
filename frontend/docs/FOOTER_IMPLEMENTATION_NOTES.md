# Footer Hybrid Data Implementation - Files Overview

This document provides a concise explanation of all files created for the hybrid data fetching implementation for the footer component.

## Configuration Files

### `frontend/src/lib/config.ts`

**Purpose:** Centralizes all environment-based configuration for the application.

**Key Features:**
- Provides access to all environment variables in a type-safe manner
- Controls data fetching behavior (mock API vs backend)
- Manages debugging options like logging
- Includes environment detection helpers

**Usage:**
```typescript
import { config } from '@/lib/config';

// Check data source preferences
if (config.useMockApi) {
  // Use mock API for data
}

// Check environment
if (config.isDevelopment()) {
  // Development-specific code
}

// Enable detailed logging
if (config.logDataFetching) {
  console.log('Detailed fetch info:', data);
}
```

### Environment Files

#### `.env.development`

**Purpose:** Configuration for development environment.

**Key Settings:**
- Enables mock API (`NEXT_PUBLIC_USE_MOCK_API=true`)
- Tries backend first, then falls back to mock
- Enables detailed logging
- Points to local development API URLs

**Docker Considerations:**
- If using Docker, you may need to adjust `NEXT_PUBLIC_API_URL` to point to the Docker service name instead of localhost:
  ```
  NEXT_PUBLIC_API_URL=http://backend:8000/api/v1
  NEXT_PUBLIC_API_BROWSER_URL=http://localhost:8000/api/v1
  ```
- The browser URL should remain localhost (or your host domain) since browsers can't access Docker service names directly

#### `.env.production`

**Purpose:** Configuration for production environment.

**Key Settings:**
- Disables mock API (`NEXT_PUBLIC_USE_MOCK_API=false`) 
- Always uses backend in production
- Provides fallback capability if backend fails
- Disables verbose logging

**Docker Considerations:**
- In production Docker setup, you'll need to set actual production URLs
- These are typically injected during CI/CD deployment

#### `.env.test`

**Purpose:** Configuration for testing environment.

**Key Settings:**
- Enables mock API for consistent test results
- Prioritizes mock over backend (`NEXT_PUBLIC_PREFER_BACKEND=false`)
- Enables detailed logging for debugging tests

**Docker Considerations:**
- For test containers, these settings ensure tests don't depend on external services

#### `.env.example`

**Purpose:** Example configuration for documentation.

**Usage:**
- Reference for developers to create their own `.env.local` file
- Includes documentation for each environment variable

## API & Data Fetching Files (To Be Implemented)

### `frontend/src/lib/api/fetcher.ts` (Upcoming)

**Purpose:** Implements the hybrid data fetching mechanism.

**Key Features:**
- Tries multiple data sources in order of preference
- Handles fallbacks gracefully
- Provides detailed logging
- Generic and reusable for different data types

### `frontend/src/lib/api/footer.ts` (Upcoming)

**Purpose:** Footer-specific implementation of hybrid fetching.

**Key Features:**
- Configures fetcher specifically for footer data
- Defines backend endpoints to try
- Sets up proper fallback data

### `frontend/src/app/api/footer/route.ts` (Upcoming)

**Purpose:** Local mock API endpoint for footer data.

**Key Features:**
- Provides consistent mock data during development
- Uses translation files for internationalized content
- Doesn't require backend to be running

## Docker-Specific Notes

### Network Configuration

When running in Docker:
1. The Next.js frontend container can access the backend container using the service name (e.g., `http://backend:8000`)
2. But browsers running your app need to access the backend via the exposed port on the host (e.g., `http://localhost:8000`)

This is why we have two environment variables:
- `NEXT_PUBLIC_API_URL` - Used by the Next.js server
- `NEXT_PUBLIC_API_BROWSER_URL` - Used by browser clients

### Development Environment

In `docker-compose.yml`, you would typically have:

```yaml
services:
  frontend:
    build: ./frontend
    environment:
      - NEXT_PUBLIC_API_URL=http://backend:8000/api/v1
      - NEXT_PUBLIC_API_BROWSER_URL=http://localhost:8000/api/v1
      - NEXT_PUBLIC_USE_MOCK_API=true
      # Other env vars...
    ports:
      - "3000:3000"
    volumes:
      - ./frontend:/app
      # For hot reload...

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    # Other backend config...
```

### Testing Environment 

For testing in Docker, you might want to run without backend dependencies:

```yaml
services:
  frontend_test:
    build: 
      context: ./frontend
      dockerfile: Dockerfile.test
    environment:
      - NEXT_PUBLIC_USE_MOCK_API=true
      - NEXT_PUBLIC_PREFER_BACKEND=false
      # Other test env vars...
    command: npm test
```

## Usage Examples

### Toggling Between Data Sources

To force using only mock data:
```
NEXT_PUBLIC_USE_MOCK_API=true
NEXT_PUBLIC_PREFER_BACKEND=false
```

To use backend but allow fallbacks:
```
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_PREFER_BACKEND=true
NEXT_PUBLIC_FALLBACK_TO_MOCK=true
```

To use only backend with no fallbacks:
```
NEXT_PUBLIC_USE_MOCK_API=false
NEXT_PUBLIC_PREFER_BACKEND=true
NEXT_PUBLIC_FALLBACK_TO_MOCK=false
```

### Debugging Data Fetching

Enable detailed logs during development:
```
NEXT_PUBLIC_LOG_DATA_FETCHING=true
```

This will show in the console:
- Which data sources are being tried
- Success/failure of each attempt
- What data was received and from where 