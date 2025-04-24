# Components Directory Structure

This directory contains all React components organized by feature or domain. The structure follows the recommendations in `FRONTEND_STRUCTURE.md`.

## Directory Structure

```
/components
  /common/       # General-purpose reusable components (Button, Navbar, Footer, Input, etc.)
  /ui/           # Base UI primitives (e.g., from shadcn/ui)
  /providers/    # Client-side Provider components (context providers, etc.)
  
  # Feature-specific components
  /portfolio/    # Components specific to the portfolio feature
  /services/     # Components specific to services feature
  /auth/         # Authentication components (login, signup forms)
  /marketing/    # Marketing/site components (contact forms, etc.)
  
  # Future feature components
  /admin/        # Components specific to the admin dashboard
  /chatbot/      # Components for the chatbot feature
  /3d/           # Components related to 3D/360 views
  /content/      # Components for rendering CMS content blocks/types
```

## Component Organization

Each feature directory can have its own internal organization based on complexity. For example:

```
/services
  /card          # Components related to service cards
  /detail        # Components for service detail view
  /list          # Components for listing services
  /common        # Components shared within services feature
  /icons         # Service-specific icons
```

## Best Practices

1. **Component Naming**: Use PascalCase for component files and directories containing components (e.g., `Button.tsx`, `ServiceCard/index.tsx`)
2. **Co-location**: Keep related components together in the same directory
3. **Reusability**: Place components that are used across multiple features in `/common`
4. **Split Components**: Break large components into smaller, focused ones
5. **Type Definitions**: Define component props as interfaces within the component file or in a separate `types.ts` file if shared 