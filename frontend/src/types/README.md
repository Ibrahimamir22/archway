# TypeScript Types Directory

This directory contains all TypeScript type definitions for the Archway project.

## Structure

```
/types
  /services         # Types for service-related features
  /api              # Types for API requests and responses
  /pages            # Types specific to page components
  /vendor           # Types for third-party libraries
  /@types           # Module declarations and augmentations
    declarations.d.ts       # General declaration file
    next-env.d.ts           # Next.js environment definitions
    next-environment.d.ts   # Additional Next.js environment types
    utility-types.d.ts      # Utility type helpers
```

## Usage Guidelines

### Custom Types

For your own application-specific types, create them in the appropriate subdirectory:

```typescript
// Example: frontend/src/types/services/project.ts
export interface Project {
  id: string;
  name: string;
  slug: string;
  // ...
}
```

Then import them in your components:

```typescript
import { Project } from '@/types/services/project';
// or from the barrel file
import { Project } from '@/types';
```

### Module Declarations

To add or extend type declarations for external libraries, add them to the appropriate file in the `@types` directory. For large declarations, consider creating a separate file.

Example:
```typescript
// frontend/src/types/@types/my-library.d.ts
declare module 'my-library' {
  export function someFunction(): void;
}
```

## Best Practices

1. **Keep types close to their usage**: If a type is only used in one component, consider defining it there
2. **Use barrel files**: Export multiple related types from index.ts files for clean imports
3. **Be specific**: Avoid using `any` when possible; define proper interfaces
4. **Document complex types**: Add JSDoc comments to explain complex types
5. **Use TypeScript utility types**: Leverage `Partial<T>`, `Pick<T>`, etc. for derived types 