"use client";

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { getLocalStorage, setLocalStorage, removeLocalStorage } from '@/utils/localStorage';

// Define types for reading settings
export interface ReadingSettings {
  fontSize: number;
  fontFamily: 'serif' | 'sans-serif' | 'monospace';
  lineHeight: string;
  preferredReadingMode: 'page' | 'scroll';
}

// Default settings
const DEFAULT_SETTINGS: ReadingSettings = {
  fontSize: 18,
  fontFamily: 'serif',
  lineHeight: '1.8',
  preferredReadingMode: 'page',
};

// Local storage keys
const SETTINGS_KEY = "userSettings";
const LEGACY_KEYS = {
  fontSize: "reader-font-size",
  lineHeight: "reader-line-height",
  fontFamily: "reader-font-family",
};

// Context type
interface ReadingSettingsContextType {
  settings: ReadingSettings;
  updateSettings: (newSettings: Partial<ReadingSettings>) => void;
  resetSettings: () => void;
}

// Create the context
const ReadingSettingsContext = createContext<ReadingSettingsContextType>({
  settings: DEFAULT_SETTINGS,
  updateSettings: () => {},
  resetSettings: () => {},
});

export function ReadingSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS);
  const [isInitialized, setIsInitialized] = useState(false);
  const isUpdating = useRef(false);

  // Load settings on mount
  useEffect(() => {
    // Only run this once
    if (isInitialized) return;

    try {

      const userSettings = getLocalStorage<Record<string, any>>(SETTINGS_KEY, {});
      
      if (Object.keys(userSettings).length > 0) {
        
        const readingSettings = {
          fontSize: typeof userSettings.fontSize === 'number' ? userSettings.fontSize : DEFAULT_SETTINGS.fontSize,
          fontFamily: ['serif', 'sans-serif', 'monospace'].includes(userSettings.fontFamily) 
            ? userSettings.fontFamily 
            : DEFAULT_SETTINGS.fontFamily,
          lineHeight: ['1.5', '1.8', '2.2', '2.5'].includes(userSettings.lineHeight)
            ? userSettings.lineHeight
            : DEFAULT_SETTINGS.lineHeight,
          preferredReadingMode: ['page', 'scroll'].includes(userSettings.preferredReadingMode)
            ? userSettings.preferredReadingMode
            : DEFAULT_SETTINGS.preferredReadingMode,
        } as ReadingSettings;
        
        setSettings(readingSettings);
      } else {
        
        // Use utility functions for legacy keys too
        const legacyFontSize = getLocalStorage<string | null>(LEGACY_KEYS.fontSize, null);
        const legacyLineHeight = getLocalStorage<string | null>(LEGACY_KEYS.lineHeight, null);
        const legacyFontFamily = getLocalStorage<string | null>(LEGACY_KEYS.fontFamily, null);
        
        if (legacyFontSize || legacyLineHeight || legacyFontFamily) {
          const migratedSettings: Partial<ReadingSettings> = {};
          
          if (legacyFontSize) {
            const fontSize = parseInt(legacyFontSize);
            if (!isNaN(fontSize) && fontSize >= 14 && fontSize <= 28) {
              migratedSettings.fontSize = fontSize;
            }
          }
          
          if (legacyLineHeight) {
            if (['1.5', '1.8', '2.2', '2.5'].includes(legacyLineHeight)) {
              migratedSettings.lineHeight = legacyLineHeight;
            }
          }
          
          if (legacyFontFamily) {
            if (['serif', 'sans-serif', 'monospace'].includes(legacyFontFamily)) {
              migratedSettings.fontFamily = legacyFontFamily as 'serif' | 'sans-serif' | 'monospace';
            }
          }
          
          // Apply migrated settings
          const userSettings = getLocalStorage<Record<string, any>>(SETTINGS_KEY, {});
          const updatedSettings = {
            ...userSettings,
            ...migratedSettings
          };
          
          setLocalStorage(SETTINGS_KEY, updatedSettings);
          
          // Clean up legacy keys
          removeLocalStorage(LEGACY_KEYS.fontSize);
          removeLocalStorage(LEGACY_KEYS.lineHeight);
          removeLocalStorage(LEGACY_KEYS.fontFamily);
        }
      }

      setIsInitialized(true);
    } catch (error) {
      console.error("[Debug] Failed to load reading settings:", error);
      // If there's an error, use defaults
      setSettings(DEFAULT_SETTINGS);
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // Update settings
  const updateSettings = (newSettings: Partial<ReadingSettings>) => {
    
    // Skip if already updating
    if (isUpdating.current) {
      return;
    }
    
    isUpdating.current = true;
    
    setSettings(prev => {
      // Check if anything has actually changed
      const hasChanges = Object.entries(newSettings).some(
        ([key, value]) => prev[key as keyof ReadingSettings] !== value
      );
      
      if (!hasChanges) {
        isUpdating.current = false;
        return prev; // Don't update if nothing changed
      }
      
      const updatedSettings = { ...prev, ...newSettings };
      
      try {
        // Update in localStorage using utility function
        const userSettings = getLocalStorage<Record<string, any>>(SETTINGS_KEY, {});
        const mergedSettings = { ...userSettings, ...updatedSettings };
        setLocalStorage(SETTINGS_KEY, mergedSettings);
      } catch (error) {
        console.error("[Debug] Failed to save reading settings:", error);
      }
      
      // Reset the update flag after a short delay
      setTimeout(() => {
        isUpdating.current = false;
      }, 0);
      
      return updatedSettings;
    });
  };

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(DEFAULT_SETTINGS);
    
    try {
      // Update in localStorage using utility function
      const userSettings = getLocalStorage<Record<string, any>>(SETTINGS_KEY, {});
      const resetReadingSettings = { 
        ...userSettings,
        fontSize: DEFAULT_SETTINGS.fontSize,
        fontFamily: DEFAULT_SETTINGS.fontFamily,
        lineHeight: DEFAULT_SETTINGS.lineHeight,
        preferredReadingMode: DEFAULT_SETTINGS.preferredReadingMode,
      };
      setLocalStorage(SETTINGS_KEY, resetReadingSettings);
    } catch (error) {
      console.error("Failed to reset reading settings:", error);
    }
  };

  return (
    <ReadingSettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
      {children}
    </ReadingSettingsContext.Provider>
  );
}

// Custom hook to use reading settings
export function useReadingSettings() {
  return useContext(ReadingSettingsContext);
}