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
export * from './services';

// UI hooks
export * from './ui/useFooter';

// Utility hooks
export * from './utils/useApi';

// No need to re-export these individually as they come from the useApi export
// export { fixImageUrl, normalizeImageUrl } from './utils/useApi';
// export { getApiBaseUrl } from '../utils/urls';

// Export organized namespaces for cleaner imports
import * as PortfolioTypes from './portfolio/types';
import * as ProjectDetailHooks from './portfolio/useProjectDetail';
import * as ProjectFilterHooks from './portfolio/useProjectFilters';
import * as ProjectImageHooks from './portfolio/useProjectImages';
import * as ProjectListHooks from './portfolio/useProjectList';
import * as ApiUtils from './utils/useApi';
import * as AuthModules from './auth/useAuth';
import * as FooterHooks from './ui/useFooter';
import * as ServiceHooks from './services';

// Export them as grouped namespaces
export const PortfolioHooks = {
  ...PortfolioTypes,
  ...ProjectDetailHooks,
  ...ProjectFilterHooks,
  ...ProjectImageHooks,
  ...ProjectListHooks
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

/**
 * Helper for handling API errors consistently
 */
export const handleApiError = (error: any) => {
  console.error('API Error:', error);
  
  // Extract the most useful error message
  let errorMessage = 'An unexpected error occurred';
  
  if (error.response) {
    // Server responded with an error status
    const status = error.response.status;
    
    if (status === 404) {
      errorMessage = 'Resource not found (404)';
    } else if (status === 500) {
      errorMessage = 'Server error (500)';
    } else if (error.response.data && error.response.data.detail) {
      errorMessage = error.response.data.detail;
    } else if (error.response.data && error.response.data.message) {
      errorMessage = error.response.data.message;
    }
  } else if (error.request) {
    // Request made but no response received
    errorMessage = 'No response from server. Please check your connection.';
  } else if (error.message) {
    // Error in setting up the request
    errorMessage = error.message;
  }
  
  return errorMessage;
}; 