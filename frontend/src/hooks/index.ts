/**
 * Hooks central export file
 */

// Auth hooks
export * from './auth/useAuth';

// Portfolio hooks
export * from './portfolio/useProjects';
export * from './portfolio/useProjectImages';
export * from './portfolio/useProjectDetail';
export * from './portfolio/useProjectFilters';
export * from './portfolio/useProjectList';
export * from './portfolio/types';

// Service hooks
export * from './services/useServices';
export * from './services/useServiceCategories';

// UI hooks
export * from './ui/useFooter';

// Utility hooks
export * from './utils/useApi';

// For explicit use in imports
export { fixImageUrl, getApiBaseUrl, normalizeImageUrl } from './utils/useApi';

// Export organized namespaces for cleaner imports
import * as PortfolioTypes from './portfolio/types';
import * as ProjectDetailHooks from './portfolio/useProjectDetail';
import * as ProjectFilterHooks from './portfolio/useProjectFilters';
import * as ProjectImageHooks from './portfolio/useProjectImages';
import * as ProjectListHooks from './portfolio/useProjectList';
import * as ApiUtils from './utils/useApi';
import * as AuthModules from './auth/useAuth';
import * as FooterHooks from './ui/useFooter';
import * as ServiceCategoriesHooks from './services/useServiceCategories';

// Export them as grouped namespaces
export const PortfolioHooks = {
  ...PortfolioTypes,
  ...ProjectDetailHooks,
  ...ProjectFilterHooks,
  ...ProjectImageHooks,
  ...ProjectListHooks
};

export const ServiceHooks = {
  ...ServiceCategoriesHooks
};

export const UtilHooks = {
  ...ApiUtils
};

export const UIHooks = {
  ...FooterHooks
};

export const AuthHooks = {
  ...AuthModules
}; 