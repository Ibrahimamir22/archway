# Server Component Migration Plan

## Overview

This document outlines the strategy for migrating appropriate components to React Server Components in the Archway project. This migration aims to:

1. Reduce client-side JavaScript bundle size
2. Improve initial page load performance
3. Separate data fetching from rendering logic
4. Leverage Next.js App Router's server component capabilities

## Component Migration Candidates

Components will be prioritized for migration based on:

- Data fetching requirements
- Minimal interactivity needs
- Rendering static or semi-static content
- High impact on initial page load

### Initial Migration Candidates

#### High Priority (Phase 1)

- **Portfolio Components**
  - ✅ `ProjectGrid.tsx` - Displaying project listings
  - ✅ `ProjectHeader.tsx` - Static project header content
  - ✅ `ProjectDetails.tsx` - Static project information display

- **Service Components**
  - ✅ `ServiceGrid.tsx` - Displaying service listings
  - ✅ `ServiceDetail.tsx` - Static service information display

- **Marketing Components**
  - ✅ `ContactInfo.tsx` - Static contact information display (optimized with shared hooks)
  - ✅ `FAQCategory.tsx` - Static FAQ category content
  - ✅ `BusinessHours.tsx` - Static business hours display (optimized with shared hooks)

#### Medium Priority (Phase 2)

- **Common Components**
  - `Footer.tsx` - Static footer content
  - `CompanyInfo.tsx` - Static company information

- **Home Components**
  - Convert static sections of home page components
  - Preserve client components for interactive elements

#### Lower Priority (Phase 3)

- **UI Components**
  - Evaluate UI primitives for server component conversion
  - Convert non-interactive UI patterns

## Migration Approach

### 1. Component Analysis

For each component:
- Review all imports for client-side dependencies
- Identify state and event handlers that require client-side functionality
- Determine data fetching patterns used

### 2. Separation Pattern

When a component has mixed server/client needs:
1. Create a server component for the main content
2. Extract interactive elements to client components
3. Compose the server component with client components using the "children" pattern

### 3. Implementation Steps

For each component migration:
1. Rename the existing component file to indicate client component (e.g., `.client.tsx`)
2. Create a new server component file with the original name
3. Move data fetching to the server component
4. Use React Server Actions for any mutative operations
5. Import and use client components for interactive elements

### 4. File Naming Convention

- Server Components: `ComponentName.tsx`
- Client Components: `ComponentName.client.tsx`
- Shared Types: `types.ts`

## Completed Migrations

### 1. ProjectGrid Component Migration

**Files created/modified:**
- Created `frontend/src/lib/api/portfolio.ts` - Server-side data fetching functions
- Created `frontend/src/components/portfolio/list/ProjectGrid.client.tsx` - Client component for interactivity
- Updated `frontend/src/components/portfolio/list/ProjectGrid.tsx` - Server component with async data fetching
- Created `frontend/src/components/portfolio/list/ProjectGridLoader.tsx` - Client pagination loader
- Updated `frontend/src/app/[locale]/(portfolio)/portfolio/page.tsx` - Server component page
- Created `frontend/src/app/[locale]/(portfolio)/portfolio/FilterWrapper.tsx` - Client-side filter wrapper

**Benefits achieved:**
- Server-side data fetching for initial project data
- Reduced client-side JavaScript bundle for initial page load
- Clean separation of data fetching from UI rendering
- Improved initial page load performance
- Maintained client-side interactivity for filtering and pagination
- Enhanced URL-based filtering with cleaner patterns

**Implementation patterns:**
- Server component for initial data fetching
- Client components for interactivity (filtering, pagination)
- Hybrid approach with server-rendered first page and client-side pagination
- URL-based filtering for better SEO and shareability

### 2. ProjectHeader Component Migration

**Files created/modified:**
- Created `frontend/src/components/portfolio/detail/ProjectHeader.client.tsx` - Client component for interactive links
- Updated `frontend/src/components/portfolio/detail/ProjectHeader.tsx` - Server component that delegates to client
- Updated `frontend/src/app/[locale]/(portfolio)/portfolio/[slug]/page.tsx` - Updated to pass locale to the component

**Benefits achieved:**
- Simplified server component structure
- Better separation of static and interactive elements
- Improved rendering performance for project detail pages
- Enhanced maintainability with clear component responsibilities

**Implementation patterns:**
- Thin server component that passes data to client component
- Client component that handles all interactive elements
- Server-side translation handling
- Explicit locale passing for better predictability

### 3. ProjectDetails Component Migration

**Files created/modified:**
- Created `frontend/src/components/portfolio/detail/ProjectDetails.client.tsx` - Client component with interactive elements
- Updated `frontend/src/components/portfolio/detail/ProjectDetails.tsx` - Server component that delegates to client
- Updated `frontend/src/app/[locale]/(portfolio)/portfolio/[slug]/page.tsx` - Updated to pass locale to component

**Benefits achieved:**
- Consistent approach with other portfolio components
- Better locale handling with explicit passing
- Improved navigation with properly localized contact links
- Enhanced maintainability with clear separation of concerns

**Implementation patterns:**
- Server component for translations and data preparation
- Client component for interactive elements (Button, Links)
- Simplified data flow with explicit props passing
- Localized contact links with proper paths

### 4. ServiceGrid Component Migration

**Files created/modified:**
- Enhanced `frontend/src/lib/api/services.ts` - Added server-side data fetching functions
- Created `frontend/src/components/services/list/ServiceGrid.client.tsx` - Client component for interactivity
- Updated `frontend/src/components/services/list/ServiceGrid.tsx` - Server component with async data fetching
- Created `frontend/src/components/services/list/ServiceGridLoader.tsx` - Client pagination loader
- Updated `frontend/src/app/[locale]/(services)/services/services-client.tsx` - Updated to use the server component

**Benefits achieved:**
- Consistent migration pattern with portfolio components
- Server-side data fetching for initial services data
- Reduced client-side JavaScript bundle
- Simplified services-client.tsx implementation
- Enhanced separation of concerns between data fetching and UI rendering

**Implementation patterns:**
- Server component for initial data fetching
- Client component for interactivity and UI
- Client loader component for pagination logic
- Reuse of existing API functions with enhancements for server components

### 5. ServiceDetail Component Migration

**Files created/modified:**
- Created `frontend/src/components/services/detail/ServiceDetail.client.tsx` - Client component for interactive elements
- Updated `frontend/src/components/services/detail/ServiceDetail.tsx` - Server component that delegates to client
- Updated `frontend/src/app/[locale]/(services)/services/[slug]/service-detail-client.tsx` - Updated to use the server component

**Benefits achieved:**
- Consistent migration approach across all detail components
- Improved separation of concerns with server and client components
- Enhanced translation handling with server-side internalization
- Better maintainability with standardized component patterns
- Optimized initial page load with server-side rendering

**Implementation patterns:**
- Thin server component delegating to client component
- Client component handling interactive UI elements
- Explicit locale passing for internationalization
- Reuse of consistent patterns established in earlier migrations

### 6. ContactInfo Component Optimization

**Files modified:**
- Updated `frontend/src/components/marketing/contact/ContactInfo.tsx` - Enhanced server component with error handling and data preparation
- Updated `frontend/src/components/marketing/contact/ContactInfo.client.tsx` - Optimized with useMemo and shared hooks
- Updated `frontend/src/components/marketing/contact/form/BusinessHours.tsx` - Enhanced server component with clearer documentation
- Updated `frontend/src/components/marketing/contact/form/BusinessHours.client.tsx` - Optimized with React.memo
- Updated `frontend/src/components/marketing/contact/form/ContactItem.tsx` - Optimized with React.memo and accessibility enhancements
- Created `frontend/src/lib/hooks/marketing/contact/useClipboard.ts` - Extracted clipboard functionality to reusable hook

**Benefits achieved:**
- Extracted clipboard functionality to a reusable hook, reducing code duplication
- Improved performance with React.memo for components with frequent re-renders
- Enhanced accessibility with proper ARIA attributes
- Better error handling in the server component
- Improved server/client separation following project patterns
- Cached expensive operations with useMemo
- Added data-testid attributes for easier testing
- Better URL handling for security (rel attributes)
- Maintained consistent component patterns with other migrations

**Implementation patterns:**
- Server components for data fetching and preparation
- Client components for interactivity
- Shared hooks for common functionality
- React.memo for performance optimization
- Proper aria attributes for accessibility
- Component displayName for better debugging
- Consistent error handling patterns

### 7. FAQCategory Component Migration

**Files created/modified:**
- Created `frontend/src/lib/api/faq.ts` - Server-side data fetching functions for FAQs
- Created `frontend/src/components/marketing/faq/FAQCategory.client.tsx` - Client component for interactive FAQ sections
- Updated `frontend/src/components/marketing/faq/FAQCategory.tsx` - Server component that delegates to client component
- Created `frontend/src/components/marketing/faq/FAQServer.tsx` - Server component for FAQ page with server-side data fetching
- Created `frontend/src/components/marketing/faq/FAQ.client.tsx` - Client component for interactive FAQ features
- Updated `frontend/src/components/marketing/faq/index.ts` - Updated exports to include new components

**Benefits achieved:**
- Server-side data fetching for FAQ content
- Reduced client-side JavaScript bundle size
- Improved separation of data fetching from UI rendering
- Enhanced SEO with server-rendered content
- Maintained client-side interactivity for search, filtering and animations
- Improved error handling with clear error states
- Added server-side sorting for better performance

**Implementation patterns:**
- Server component for data fetching and preparation
- Client component for interactivity (animations, search, filtering)
- Server-side sorting of categories
- Consistent error handling with user feedback
- Maintained prefetching capabilities for enhanced UX
- React.memo for client components to optimize rendering
- Clear separation of server/client responsibilities

## Example Migration

### Before (Client Component)

```tsx
// ProjectGrid.tsx
'use client';

import { useState, useEffect } from 'react';
import { ProjectCard } from './ProjectCard';
import { useProjects } from '@/lib/hooks/portfolio/useProjects';

export function ProjectGrid() {
  const { projects, loading } = useProjects();
  
  if (loading) return <p>Loading...</p>;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

### After (Server Component)

```tsx
// ProjectGrid.tsx (Server Component)
import { ProjectCard } from './ProjectCard.client';
import { getProjects } from '@/lib/api/portfolio';

export async function ProjectGrid() {
  const projects = await getProjects();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
```

## Performance Measurement

Before and after each migration phase, we will measure:
- JavaScript bundle size
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- Time to Interactive (TTI)
- Total Blocking Time (TBT)

## Timeline

- **Phase 1:** High priority components - 1 week (8/8 components completed)
- **Phase 2:** Medium priority components - 1 week
- **Phase 3:** Lower priority components - 1 week
- **Testing & Validation:** 1 week

## Risks and Mitigations

- **Risk:** Hydration mismatches
  - **Mitigation:** Careful separation of client/server boundaries

- **Risk:** Breaking existing functionality
  - **Mitigation:** Comprehensive testing after each component migration

- **Risk:** Performance regression in interactive features
  - **Mitigation:** Benchmark before/after and optimize client components

## Documentation

Each migrated component will be documented with:
- Rationale for server component conversion
- Performance improvements observed
- Patterns used for client/server separation 