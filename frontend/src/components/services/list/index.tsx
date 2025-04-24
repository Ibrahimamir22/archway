// This barrel file exports all Service list components
import ServiceGrid, { ServiceGridProps } from './ServiceGrid';
import ServiceFilters, { ServiceFiltersProps } from './ServiceFilters';

// Re-export all components
export { 
  ServiceGrid,
  ServiceFilters
};

// Also export types
export type { 
  ServiceGridProps,
  ServiceFiltersProps 
};

// Export ServiceGrid as default
export default ServiceGrid; 