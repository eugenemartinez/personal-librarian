"use client";

import { useState, useEffect } from "react";
import { useNavigationContext } from '@/hooks/useNavigationContext';
import { useRouter } from "next/navigation";
import { useDisplaySettings } from '@/hooks/useDisplaySettings';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';

// Import utilities
import { 
  filterBooksByStatus,
  sortBooks,
  SortOrder
} from "@/utils/libraryUtils";

// Import our custom hooks
import { useLibraryData } from './_hooks/useLibraryData';
import { useLibraryTabs } from './_hooks/useLibraryTabs';

// Import components
import { LibraryHeader } from "./_components/LibraryHeader";
import { LibraryDisplayHeader } from "./_components/LibraryDisplayHeader";
import { EmptyLibraryState } from "./_components/EmptyLibraryState";
import { LibraryBooksGrid } from "./_components/LibraryBooksGrid";
import { LibraryBooksList } from "./_components/LibraryBooksList";
import { ReadingHistoryContent } from "./_components/ReadingHistoryContent";

export default function LibraryPage() {
  // Enable scroll position restoration
  useScrollRestoration();
  
  // Get navigation context for routing
  const { navigateToBook } = useNavigationContext();
  const router = useRouter();
  
  // Use our custom hooks
  const {
    libraryBooks,
    readingHistory,
    isHistoryEnabled,
    loading,
    bookStatuses,
    handleStatusChange,
    handleRemoveBook,
    loadLibraryData
  } = useLibraryData();

  const {
    activeTab,
    setActiveTab,
    determineActiveTab,
    handleTabChange
  } = useLibraryTabs();
  
  // Use display settings hook
  const { 
    viewMode, 
    sortOrder,
    changeViewMode, 
    changeSortOrder,
    saveAsGlobalDefaults 
  } = useDisplaySettings("library");
  
  // Load on mount
  useEffect(() => {
    loadLibraryData();
    
    // Set the active tab based on persistence
    const tabToActivate = determineActiveTab();
    setActiveTab(tabToActivate);
    
    // Also update the URL hash if not already set
    if (typeof window !== 'undefined' && !window.location.hash && tabToActivate) {
      window.history.replaceState(null, '', `#${tabToActivate}`);
    }
  }, []);
  
  // Filter books by status
  const filteredBooks = filterBooksByStatus(
    libraryBooks, 
    activeTab === "all" || activeTab === "history" ? "all" : activeTab
  );

  // Sort the filtered books
  const sortedBooks = sortBooks(filteredBooks, sortOrder);

  // UI event handlers
  const handleViewModeChange = (mode: typeof viewMode) => {
    changeViewMode(mode);
    saveAsGlobalDefaults();
  };
  
  const handleSortOrderChange = (value: string) => {
    changeSortOrder(value as SortOrder);
    saveAsGlobalDefaults();
  };

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Header section with tabs */}
      <LibraryHeader 
        activeTab={activeTab}
        onTabChange={handleTabChange}
        hasBooks={libraryBooks.length > 0}
      />
      
      {/* Display controls section */}
      <LibraryDisplayHeader
        viewMode={viewMode}
        sortOrder={sortOrder}
        activeTab={activeTab}
        hasBooks={libraryBooks.length > 0}
        readingHistory={readingHistory}
        onViewModeChange={handleViewModeChange}
        onSortOrderChange={handleSortOrderChange}
      />
      
      {/* Main content area */}
      {loading ? (
        <div className="text-center py-12">
          <p>Loading your library...</p>
        </div>
      ) : activeTab === "history" ? (
        <div className="space-y-4">
          <ReadingHistoryContent
            readingHistory={readingHistory}
            viewMode={viewMode}
            isHistoryEnabled={isHistoryEnabled}
            onNavigate={navigateToBook}
          />
        </div>
      ) : libraryBooks.length === 0 ? (
        <EmptyLibraryState />
      ) : filteredBooks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No books in this category yet.</p>
        </div>
      ) : viewMode === 'grid' ? (
        <LibraryBooksGrid
          books={sortedBooks}
          bookStatuses={bookStatuses}
          onNavigate={navigateToBook}
          onRemove={handleRemoveBook}
          onStatusChange={handleStatusChange}
        />
      ) : (
        <LibraryBooksList
          books={sortedBooks}
          bookStatuses={bookStatuses}
          onNavigate={navigateToBook}
          onRemove={handleRemoveBook}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
}