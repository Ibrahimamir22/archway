/**
 * Services module hooks exports
 */

// Re-export all services-related hooks and types
export * from './useServicesList';
export * from './useServiceDetail';
export * from './useServiceCategories';

// For backward compatibility
import { useServicesList } from './useServicesList';
export const useServices = useServicesList;

// Re-export types from the central type definitions
export type { Service, ServiceFeature, UseServicesOptions } from '@/@types/services'; 