/**
 * Safe localStorage utility that works with SSR
 * Provides type-safe access with error handling
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

/**
 * Safely get an item from localStorage with proper type conversion
 */
export function getLocalStorage<T>(key: string, defaultValue: T): T {
  if (!isBrowser) {
    return defaultValue;
  }
  
  try {
    const item = localStorage.getItem(key);
    if (item === null) {
      return defaultValue;
    }
    
    // Handle different value types appropriately
    if (typeof defaultValue === 'boolean') {
      return (item === 'true') as unknown as T;
    }
    
    // Try to parse as JSON, fallback to raw value
    try {
      return JSON.parse(item) as T;
    } catch {
      return item as unknown as T;
    }
  } catch {
    return defaultValue;
  }
}

/**
 * Safely set an item in localStorage with proper serialization
 */
export function setLocalStorage<T>(key: string, value: T): boolean {
  if (!isBrowser) {
    return false;
  }
  
  try {
    if (value === null || value === undefined) {
      localStorage.removeItem(key);
    } else {
      const valueToStore = typeof value === 'object' ? JSON.stringify(value) : String(value);
      localStorage.setItem(key, valueToStore);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 */
export function removeLocalStorage(key: string): boolean {
  if (!isBrowser) {
    return false;
  }
  
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

/**
 * Special navigation context helpers
 */
const NAVIGATION_CONTEXT_KEY = "bookNavigationContext";

// Get navigation context with SSR safety
export function getNavigationContext(): string {
  if (!isBrowser) return "/books"; // Safe default for SSR
  
  try {
    const context = localStorage.getItem(NAVIGATION_CONTEXT_KEY);
    return context || "/books";
  } catch {
    return "/books";
  }
}

// Set navigation context with SSR safety
export function setNavigationContext(path: string): void {
  if (!isBrowser) return;
  
  try {
    localStorage.setItem(NAVIGATION_CONTEXT_KEY, path);
  } catch {
    // Suppress errors in production
  }
}

// Get the section name for display purposes
export function getContextSectionName(): string {
  const context = getNavigationContext();
  
  if (context.startsWith("/library")) return "Library";
  if (context.startsWith("/search")) return "Search Results";
  if (context.startsWith("/books")) return "Books"; 
  return "Books"; // Default
}