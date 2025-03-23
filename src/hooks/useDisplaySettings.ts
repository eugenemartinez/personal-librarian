"use client";

import { useState, useEffect } from "react";

export type ViewMode = "grid" | "list";
export type SortOrder = "default" | "newest" | "title" | "author";

interface DisplaySettings {
  bookViewMode: ViewMode;
  bookSortBy: SortOrder;
}

// Default settings for new users
const defaultSettings: DisplaySettings = {
  bookViewMode: "grid",
  bookSortBy: "default",
};

/**
 * Hook to manage display settings with support for global defaults and page-specific overrides.
 */
export function useDisplaySettings(pageKey?: string) {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultSettings.bookViewMode);
  const [sortOrder, setSortOrder] = useState<SortOrder>(defaultSettings.bookSortBy);

  // Load settings on mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem("userSettings");
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);

        // Apply global settings
        setViewMode(parsedSettings.bookViewMode || defaultSettings.bookViewMode);
        setSortOrder(parsedSettings.bookSortBy || defaultSettings.bookSortBy);

        // Apply page-specific overrides if available
        if (pageKey) {
          const pageSettings = localStorage.getItem(`pageSettings_${pageKey}`);
          if (pageSettings) {
            const parsedPageSettings = JSON.parse(pageSettings);
            setViewMode(parsedPageSettings.bookViewMode || viewMode);
            setSortOrder(parsedPageSettings.bookSortBy || sortOrder);
          }
        }
      }
    } catch (error) {
      console.error("Failed to load display settings:", error);
    }
  }, [pageKey]);

  // Save page-specific overrides
  const saveLocalOverride = (key: keyof DisplaySettings, value: any) => {
    if (!pageKey) return;

    try {
      const pageSettings = JSON.parse(localStorage.getItem(`pageSettings_${pageKey}`) || "{}");
      pageSettings[key] = value;
      localStorage.setItem(`pageSettings_${pageKey}`, JSON.stringify(pageSettings));
    } catch (error) {
      console.error("Failed to save page setting:", error);
    }
  };

  // Save global defaults
  const saveAsGlobalDefaults = () => {
    try {
      const savedSettings = JSON.parse(localStorage.getItem("userSettings") || "{}");
      savedSettings.bookViewMode = viewMode;
      savedSettings.bookSortBy = sortOrder;
      localStorage.setItem("userSettings", JSON.stringify(savedSettings));
      return true;
    } catch (error) {
      console.error("Failed to save global settings:", error);
      return false;
    }
  };

  // Change view mode
  const changeViewMode = (mode: ViewMode) => {
    setViewMode(mode);
    if (pageKey) saveLocalOverride("bookViewMode", mode);
  };

  // Change sort order
  const changeSortOrder = (order: SortOrder) => {
    setSortOrder(order);
    if (pageKey) saveLocalOverride("bookSortBy", order);
  };

  return {
    viewMode,
    sortOrder,
    changeViewMode,
    changeSortOrder,
    saveAsGlobalDefaults,
  };
}