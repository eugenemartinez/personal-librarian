"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  updateReaderPosition, 
  getCurrentPage, 
  getPagePosition, 
  wasProgressReset,
  markBookAsCompleted
} from '@/utils/readerProgress';
import { getReadingStatus } from '@/utils/libraryUtils';
import { toast } from 'sonner';
import { showCompletionToast } from '@/utils/toastUtils';
import { BookContent } from '@/data/bookContent';
import { useReadingSettings } from '@/contexts/ReadingSettingsContext';

type ReadingMode = 'page' | 'scroll';

export function useReader(bookId: string, content: BookContent) {
  const router = useRouter();
  const { settings, updateSettings } = useReadingSettings();
  
  // Create the ref at the top level of the component
  const isSyncingFromContext = useRef(true);
  
  // Initialize state from settings context
  const [fontSize, setFontSize] = useState<number>(settings.fontSize);
  const [lineHeight, setLineHeight] = useState<string>(settings.lineHeight);
  const [fontFamily, setFontFamily] = useState<string>(settings.fontFamily);
  const [readingMode, setReadingMode] = useState<ReadingMode>(settings.preferredReadingMode);
  
  // Other state variables for reader functionality
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [initialLoadDone, setInitialLoadDone] = useState<boolean>(false);
  
  const totalPages = content.pages.length;
  const progress = Math.round((currentPage / (totalPages - 1)) * 100);
  
  // Sync with context when settings change
  useEffect(() => {
    // Don't conditionally create a ref here
    if (settings.fontSize !== fontSize) {
      setFontSize(settings.fontSize);
    }
    
    if (settings.lineHeight !== lineHeight) {
      setLineHeight(settings.lineHeight);
    }
    
    if (settings.fontFamily !== fontFamily) {
      setFontFamily(settings.fontFamily);
    }
    
    if (settings.preferredReadingMode !== readingMode) {
      setReadingMode(settings.preferredReadingMode);
    }
    
  }, [settings, fontSize, lineHeight, fontFamily, readingMode]);
  
  // Set CSS variables when settings change
  useEffect(() => {
    document.documentElement.style.setProperty('--reader-font-size', `${fontSize}px`);
    document.documentElement.style.setProperty('--reader-line-height', lineHeight);
    document.documentElement.style.setProperty('--reader-font-family', fontFamily);
  }, [fontSize, lineHeight, fontFamily]);
  
  // Initialize the reader with the correct position
  useEffect(() => {
    if (content && !initialLoadDone) {
      // Get the status of the book
      const status = getReadingStatus(bookId);
      const position = getPagePosition(bookId);
      
      // Check if progress was reset
      const progressReset = wasProgressReset(bookId, position);
      
      if (progressReset || status === "to-read") {
        // If progress was reset, start from the beginning
        setCurrentPage(0);
      } else {
        // Otherwise, get the user's saved position (1-based to 0-based)
        const savedPage = getCurrentPage(bookId);
        if (savedPage > 0) {
          setCurrentPage(Math.min(savedPage - 1, totalPages - 1));
        }
      }
      
      setInitialLoadDone(true);
    }
  }, [bookId, content, initialLoadDone, totalPages]);
  
  // Track reading progress when page changes
  useEffect(() => {
    if (!initialLoadDone) return;
    
    if (content && currentPage !== undefined) {
      // Get actual page number (1-based)
      const currentPageNumber = currentPage + 1;
      
      // Update the reader position and progress
      updateReaderPosition(bookId, currentPageNumber, totalPages);
      
      // If we've reached the end, show completion toast
      if (currentPageNumber === totalPages) {
        markBookAsCompleted(bookId);
        showCompletionToast(bookId, router);
      }
    }
  }, [bookId, currentPage, content, initialLoadDone, totalPages, router]);
  
  // Handlers that update both local state and the context
  const handleFontSizeChange = (size: number) => {
    if (fontSize !== size) { // Only update if different
      setFontSize(size);
      // Delay updating context to next tick
      setTimeout(() => {
        updateSettings({ fontSize: size });
      }, 0);
    }
  };
  
  const handleLineHeightChange = (height: string) => {
    if (lineHeight !== height) { // Only update if different
      setLineHeight(height);
      // Delay updating context to next tick
      setTimeout(() => {
        updateSettings({ lineHeight: height });
      }, 0);
    }
  };
  
  const handleFontFamilyChange = (family: string) => {
    if (fontFamily !== family) { // Only update if different
      setFontFamily(family);
      // Delay updating context to next tick
      setTimeout(() => {
        updateSettings({ fontFamily: family as any });
      }, 0);
    }
  };
  
  const handleReadingModeChange = (mode: ReadingMode) => {
    switchReadingMode(mode);
  };
  
  // Navigation functions
  const nextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
      window.scrollTo(0, 0);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleMarkComplete = () => {
    markBookAsCompleted(bookId);
    toast.success("Book marked as complete!", {
      description: "You can find it in your completed books in the library."
    });
  };

  const handleJumpToPage = (pageIndex: number) => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      setCurrentPage(pageIndex);
      updateReaderPosition(bookId, pageIndex + 1, totalPages);
      window.scrollTo(0, 0);
    }
  };
  
  // Mode switching function
  const switchReadingMode = (mode: ReadingMode) => {
    if (mode === readingMode) return;
    
    if (mode === 'page') {
      // When switching from scroll to page mode
      // Convert scroll position to approximate page
      const approximatePage = Math.floor((scrollPosition / 100) * totalPages);
      setCurrentPage(Math.min(approximatePage, totalPages - 1));
    } else {
      // When switching from page to scroll mode
      // Convert page to approximate scroll position
      const approximateScrollPosition = (currentPage / totalPages) * 100;
      setScrollPosition(approximateScrollPosition);
    }
    
    setReadingMode(mode);
    updateSettings({ preferredReadingMode: mode });
  };

  return {
    // State
    readingMode,
    fontSize,
    lineHeight,
    fontFamily,
    currentPage,
    scrollPosition,
    progress,
    totalPages,
    
    // Setters
    setFontSize: handleFontSizeChange,
    setLineHeight: handleLineHeightChange,
    setFontFamily: handleFontFamilyChange,
    setReadingMode: handleReadingModeChange,
    setCurrentPage,
    setScrollPosition,
    
    // Page mode functions
    nextPage,
    prevPage,
    handleJumpToPage,
    
    // Common functions
    handleMarkComplete,
    switchReadingMode
  };
}