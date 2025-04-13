/**
 * Global TypeScript definitions to suppress common errors
 */

// Add JSX support without conflicting with existing React declarations
declare namespace JSX {
  interface IntrinsicAttributes {
    [key: string]: any;
  }
}

// Allow importing CSS/SCSS modules
declare module '*.css' {
  const cssContent: Record<string, string>;
  export default cssContent;
}

declare module '*.scss' {
  const scssContent: Record<string, string>;
  export default scssContent;
}

// Allow importing image files
declare module '*.png' {
  const pngSrc: string;
  export default pngSrc;
}

declare module '*.jpg' {
  const jpgSrc: string;
  export default jpgSrc;
}

declare module '*.svg' {
  const svgSrc: string;
  export default svgSrc;
}

// Add missing module declarations for commonly used libraries that don't have types
declare module 'react-modal-video';
declare module 'react-indiana-drag-scroll';
declare module '@react-hook/media-query';
declare module 'react-countup';
declare module 'react-reveal/Fade';
declare module 'react-reveal/Zoom';
declare module 'react-vertical-timeline-component'; 