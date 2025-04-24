/**
 * This script helps to eliminate unused preload warnings
 * by monitoring and cleaning up unused resources
 */

(function() {
  // Only run in the browser
  if (typeof window === 'undefined') return;

  // Keep track of resources that have been used
  const usedResources = new Set();
  
  // List of known static media files that don't need to be preloaded
  const knownUnusedPatterns = [
    '/_next/static/media/',
    '/_next/static/css/',
    '/fonts/critical.woff2',
    '.p.woff2'
  ];

  // Clean up unused preloads
  function cleanupUnusedPreloads() {
    // Wait for all resources to load
    setTimeout(() => {
      try {
        // Get all preload links
        const preloadLinks = document.querySelectorAll('link[rel="preload"]');
        
        // Check each preload link
        preloadLinks.forEach(link => {
          const href = link.getAttribute('href');
          
          // Skip if it's a critical resource
          if (!href || 
              href.includes('/_next/static/chunks/') || 
              href.includes('/static/pages/') || 
              href.includes('critical') ||
              usedResources.has(href)) {
            return;
          }
          
          // Force remove for known problematic patterns
          if (knownUnusedPatterns.some(pattern => href.includes(pattern))) {
            link.remove();
            return;
          }
          
          // Check if this resource is actually used
          const isUsed = (
            document.querySelector(`img[src="${href}"]`) ||
            document.querySelector(`script[src="${href}"]`) ||
            document.querySelector(`link[href="${href}"]:not([rel="preload"])`) ||
            Array.from(document.styleSheets).some(sheet => 
              sheet.href === href || (sheet.rules && Array.from(sheet.rules).some(rule => 
                rule.cssText && rule.cssText.includes(href)
              ))
            )
          );
          
          // If not used, remove the preload
          if (!isUsed) {
            // Remove the element to stop console warnings
            link.remove();
          } else {
            usedResources.add(href);
          }
        });
      } catch (error) {
        console.warn('Error in preload cleanup:', error);
      }
    }, 500); // Reduced time for faster cleanup
  }

  // Track resource usage
  function trackResourceUsage() {
    // Track image loads
    document.addEventListener('load', event => {
      const target = event.target;
      if (target.tagName === 'IMG' && target.src) {
        usedResources.add(target.src);
      }
    }, true);
    
    // Track CSS and script loads
    const observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (mutation.type === 'attributes' && 
            (mutation.attributeName === 'href' || 
             mutation.attributeName === 'src')) {
          const node = mutation.target;
          const url = node.getAttribute(mutation.attributeName);
          if (url) {
            usedResources.add(url);
          }
        }
      });
    });
    
    observer.observe(document, { 
      attributes: true, 
      subtree: true, 
      attributeFilter: ['src', 'href'] 
    });
  }

  // Run our cleanup on both DOMContentLoaded and load events
  document.addEventListener('DOMContentLoaded', cleanupUnusedPreloads);
  window.addEventListener('load', cleanupUnusedPreloads);
  
  // Start tracking resource usage immediately
  trackResourceUsage();
  
  // Also run the cleanup after a short delay for early unused resources
  setTimeout(cleanupUnusedPreloads, 200);
})(); 