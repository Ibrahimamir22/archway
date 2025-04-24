# Archway Utils to Lib Migration Cleanup Plan

## Progress So Far

We've successfully migrated utilities from the `/utils` directory to the `/lib` directory according to the project structure guidelines in `FRONTEND_STRUCTURE.md`.

### Completed Tasks

1. ✅ Created consolidated API utilities in `/lib/api.ts`
2. ✅ Created image utilities in `/lib/images.ts`
3. ✅ Added general utilities in `/lib/utils.ts`
4. ✅ Created service-specific API utilities in `/lib/api/services.ts`
5. ✅ Created barrel files for easy importing
6. ✅ Updated imports in all components:
   - ✅ All hooks in the project
   - ✅ All service components
   - ✅ All portfolio components
   - ✅ Common components (OptimizedImage, ServiceLink)
   - ✅ API routes in `/app/api/` directory
   - ✅ Page components in `/app/[locale]/` directory
7. ✅ Deleted old files:
   - ✅ `/utils/api.ts` (replaced by `/lib/api.ts`)
   - ✅ `/utils/urls.ts` (functionality moved to `/lib/api.ts`)
   - ✅ `/utils/image-loader.js` (replaced by `/lib/images.ts`)
   - ✅ `/utils/services/index.ts` (replaced by `/lib/api/services.ts` and `/lib/images.ts`)
   - ✅ `/utils/index.ts` (barrel file no longer needed)
   - ✅ Removed entire `/utils` directory

## Next Steps

1. Run the application to verify everything works with the new imports
   ```
   cd frontend && npm run dev
   ```

2. Commit the changes and push to the repository

## Import Mapping

If you need to update imports, use this reference:

| Old Import | New Import |
|------------|------------|
| `@/utils/api` | `@/lib/api` |
| `@/utils/urls` | `@/lib/api` |
| `@/utils/image-loader` | `@/lib/images` |
| `@/utils/services` | `@/lib/api/services` or `@/lib/images` |
| `@/utils` (barrel) | `@/lib` (barrel) |

## Benefits of the New Structure

1. **Follows project guidelines** defined in `FRONTEND_STRUCTURE.md`
2. **Single source of truth** for API and utility functions
3. **Better organization** with related functions grouped together
4. **Improved type safety** with proper TypeScript interfaces
5. **Clearer separation of concerns** with domain-specific files 