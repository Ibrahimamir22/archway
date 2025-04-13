/**
 * Main type definitions file
 * Exports all component and hook types
 */

// Export component types
export * from './components/footer';
export * from './components/ui';

// Export hook types
export * from './hooks/useFooter';

// Define global types and interfaces
declare global {
  // Define any global interfaces if needed
}

// Augment React JSX to support custom elements
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
} 