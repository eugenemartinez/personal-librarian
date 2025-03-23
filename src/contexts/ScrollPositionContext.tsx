"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { usePathname } from 'next/navigation';

interface ScrollPositionContextValue {
  saveScrollPosition: (route: string, position: number) => void;
  getScrollPosition: (route: string) => number;
}

const ScrollPositionContext = createContext<ScrollPositionContextValue | undefined>(undefined);

export function ScrollPositionProvider({ children }: { children: ReactNode }) {
  // Store scroll positions for different routes
  const [scrollPositions, setScrollPositions] = useState<Record<string, number>>({});
  
  // Save scroll position function
  const saveScrollPosition = (route: string, position: number) => {
    setScrollPositions(prev => ({
      ...prev,
      [route]: position
    }));
    
    // Also save to sessionStorage for persistence across refreshes
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('scrollPositions');
        const positions = stored ? JSON.parse(stored) : {};
        positions[route] = position;
        sessionStorage.setItem('scrollPositions', JSON.stringify(positions));
      } catch (error) {
        console.error('Error saving scroll position to sessionStorage', error);
      }
    }
  };

  // Get scroll position function
  const getScrollPosition = (route: string) => {
    // First try context state
    if (scrollPositions[route] !== undefined) {
      return scrollPositions[route];
    }
    
    // Then try sessionStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('scrollPositions');
        if (stored) {
          const positions = JSON.parse(stored);
          if (positions[route] !== undefined) {
            return positions[route];
          }
        }
      } catch (error) {
        console.error('Error reading scroll position from sessionStorage', error);
      }
    }
    
    return 0; // Default to top
  };

  // Load saved positions from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = sessionStorage.getItem('scrollPositions');
        if (stored) {
          setScrollPositions(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading scroll positions from sessionStorage', error);
      }
    }
  }, []);

  return (
    <ScrollPositionContext.Provider value={{ saveScrollPosition, getScrollPosition }}>
      {children}
    </ScrollPositionContext.Provider>
  );
}

export const useScrollPosition = () => {
  const context = useContext(ScrollPositionContext);
  if (context === undefined) {
    throw new Error('useScrollPosition must be used within a ScrollPositionProvider');
  }
  return context;
};