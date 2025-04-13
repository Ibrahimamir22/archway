import { useState, useEffect } from 'react';

/**
 * Hook for handling user authentication state
 */
export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check auth state on mount
  useEffect(() => {
    // In a real application, this would check JWT token or session
    // For now, we'll use localStorage as a simple simulation
    const checkAuth = () => {
      const authToken = localStorage.getItem('authToken');
      setIsAuthenticated(!!authToken);
    };
    
    checkAuth();
    // Listen for storage events (for multi-tab authentication)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  /**
   * Save a project to the user's favorites
   */
  const saveToFavorites = (projectId: string) => {
    if (!isAuthenticated) {
      return false;
    }
    
    // In an actual implementation, this would make an API call
    // For now, just store in localStorage for demonstration
    try {
      const existingFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
      if (!existingFavorites.includes(projectId)) {
        localStorage.setItem('favorites', JSON.stringify([...existingFavorites, projectId]));
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  return {
    isAuthenticated,
    saveToFavorites
  };
}; 