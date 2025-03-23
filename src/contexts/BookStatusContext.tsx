"use client";

import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { ReadingStatus } from "@/utils/libraryUtils";

// Define the context type
interface BookStatusContextType {
  // Functions to update book status
  updateLibraryStatus: (bookId: string, inLibrary: boolean) => void;
  resetReadingProgress: (bookId: string, status: ReadingStatus | null, progress: number) => void;

  // Last updated book information
  lastUpdatedBookId: string | null;
  lastLibraryAction: boolean | null; // true = added, false = removed, null = no action
  lastResetAction: boolean | null; // true = reset, null = no reset
}

// Create the context with a default undefined value
const BookStatusContext = createContext<BookStatusContextType | undefined>(undefined);

/**
 * Provider component for the BookStatusContext.
 * Manages and shares book status updates across the application.
 */
export function BookStatusProvider({ children }: { children: ReactNode }) {
  const [lastUpdatedBookId, setLastUpdatedBookId] = useState<string | null>(null);
  const [lastLibraryAction, setLastLibraryAction] = useState<boolean | null>(null);
  const [lastResetAction, setLastResetAction] = useState<boolean | null>(null);

  /**
   * Update the library status of a book (added/removed).
   * Notifies components of the change and resets the state after a short delay.
   */
  const updateLibraryStatus = useCallback((bookId: string, inLibrary: boolean) => {
    setLastUpdatedBookId(bookId);
    setLastLibraryAction(inLibrary);

    // Reset the action state after a short delay
    setTimeout(() => {
      setLastLibraryAction(null);
    }, 100);
  }, []);

  /**
   * Notify components of a reading progress reset for a book.
   * Resets the state after a short delay.
   */
  const resetReadingProgress = useCallback((bookId: string, status: ReadingStatus | null, progress: number) => {
    setLastUpdatedBookId(bookId);
    setLastResetAction(true);

    // Reset the action state after a short delay
    setTimeout(() => {
      setLastResetAction(null);
    }, 100);
  }, []);

  return (
    <BookStatusContext.Provider
      value={{
        updateLibraryStatus,
        resetReadingProgress,
        lastUpdatedBookId,
        lastLibraryAction,
        lastResetAction,
      }}
    >
      {children}
    </BookStatusContext.Provider>
  );
}

/**
 * Custom hook to consume the BookStatusContext.
 * Throws an error if used outside of the BookStatusProvider.
 */
export function useBookStatus() {
  const context = useContext(BookStatusContext);
  if (context === undefined) {
    throw new Error("useBookStatus must be used within a BookStatusProvider");
  }
  return context;
}