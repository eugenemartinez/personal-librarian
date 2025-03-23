import { useState, useEffect } from 'react';
import { ReadingStatus } from '@/utils/libraryUtils';

export function useLibraryTabs() {
  const [activeTab, setActiveTab] = useState<"all" | ReadingStatus | "history">("all");
  
  // Determine active tab from URL hash or localStorage
  const determineActiveTab = () => {
    // First, try to get tab from URL hash
    if (typeof window !== 'undefined') {
      const hashTab = window.location.hash.replace('#', '');
      if (['all', 'to-read', 'reading', 'completed', 'history'].includes(hashTab)) {
        return hashTab as "all" | ReadingStatus | "history";
      }
    }
    
    // Then, check localStorage for saved tab
    if (typeof window !== 'undefined') {
      const savedTab = localStorage.getItem('libraryActiveTab');
      if (savedTab && ['all', 'to-read', 'reading', 'completed', 'history'].includes(savedTab)) {
        return savedTab as "all" | ReadingStatus | "history";
      }
    }
    
    // Default to 'all'
    return 'all';
  };

  // Initialize on mount - load persisted tab
  useEffect(() => {
    // Set the active tab based on persistence
    const tabToActivate = determineActiveTab();
    setActiveTab(tabToActivate);
    
    // Also update the URL hash if not already set
    if (typeof window !== 'undefined' && !window.location.hash && tabToActivate) {
      window.history.replaceState(null, '', `#${tabToActivate}`);
    }
  }, []);

  // Handle tab changes
  const handleTabChange = (tab: "all" | ReadingStatus | "history") => {
    setActiveTab(tab);
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('libraryActiveTab', tab);
      
      // Update URL hash
      window.history.replaceState(null, '', `#${tab}`);
      
      // Scroll to top when changing tabs
      window.scrollTo(0, 0);
    }
  };

  return {
    activeTab,
    setActiveTab,
    determineActiveTab,
    handleTabChange
  };
}