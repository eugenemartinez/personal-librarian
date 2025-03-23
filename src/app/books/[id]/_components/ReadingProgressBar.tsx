"use client";

import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { 
  getReadingStatus, 
  ReadingStatus,
  updateBookStatus,
  isBookInLibrary
} from '@/utils/libraryUtils';
import { BookOpenCheck, BookOpen, BookMarked, RefreshCw, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  resetReadingProgress,
  getReaderProgress, 
  getCurrentPage, 
  getTotalPages 
} from '@/utils/readerProgress';
import { toast } from 'sonner';
import { useBookStatus } from '@/contexts/BookStatusContext'; // Add this import

// Keep this for backward compatibility with existing code
export const READING_PROGRESS_RESET_EVENT = 'reading-progress-reset';

interface ReadingProgressBarProps {
  bookId: string;
  className?: string;
  showIcon?: boolean;
  showReset?: boolean;
  showDetails?: boolean;
  variant?: "default" | "compact";
  hasContent?: boolean;
}

export function ReadingProgressBar({ 
  bookId, 
  className, 
  showIcon = true,
  showReset = false,
  showDetails = false,
  variant = "default",
  hasContent = false
}: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<ReadingStatus | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isInLibrary, setIsInLibrary] = useState(false);
  
  // Add the book status context
  const { lastUpdatedBookId, lastLibraryAction, lastResetAction, resetReadingProgress: notifyReset } = useBookStatus();

  // Load initial status and progress
  const loadBookData = () => {
    const bookProgress = getReaderProgress(bookId);
    setProgress(bookProgress);
    
    // Check if book is in library
    const inLibrary = isBookInLibrary(bookId);
    setIsInLibrary(inLibrary);
    
    // Get status only if book is in library
    setStatus(inLibrary ? getReadingStatus(bookId) : null);
    
    // Get detailed page information if needed
    if (showDetails) {
      setCurrentPage(getCurrentPage(bookId));
      setTotalPages(getTotalPages(bookId));
    }
  };

  // Initial load
  useEffect(() => {
    loadBookData();
  }, [bookId, showDetails]);
  
  // Listen for library status changes from context
  useEffect(() => {
    if (lastUpdatedBookId === bookId && lastLibraryAction !== null) {
      loadBookData();
    }
  }, [lastUpdatedBookId, lastLibraryAction, bookId]);
  
  // Listen for reset actions from context
  useEffect(() => {
    if (lastUpdatedBookId === bookId && lastResetAction) {
      loadBookData();
    }
  }, [lastUpdatedBookId, lastResetAction, bookId]);
  
  // Only show the component if one of these conditions is met
  const shouldShow = 
    progress > 0 ||  // Has progress
    isInLibrary ||   // Is in library
    (hasContent && showDetails && isInLibrary);  // Has content and is in the library
  
  // Log visibility state for debugging
  useEffect(() => {
  }, [progress, isInLibrary, hasContent, showDetails, bookId, shouldShow]);

  if (!shouldShow) {
    return null;
  }
  
  // Get progress color based on completion percentage
  const getProgressColor = () => {
    if (status === "completed") return "var(--chart-1)";
    if (progress < 25) return "var(--chart-4)";
    if (progress < 75) return "var(--chart-3)";
    return "var(--chart-2)";
  };
  
  // Status icon - show generic icon if not in library
  const StatusIcon = () => {
    if (!showIcon) return null;
    
    if (!isInLibrary) {
      // Book not in library, show generic reading icon based on progress
      if (progress === 0) {
        return <BookMarked className="h-4 w-4 text-chart-4 mr-2 flex-shrink-0" />;
      }
      return progress >= 100 
        ? <BookOpenCheck className="h-4 w-4 text-chart-1 mr-2 flex-shrink-0" />
        : <BookOpen className="h-4 w-4 text-chart-3 mr-2 flex-shrink-0" />;
    }
    
    // Book in library, show status-specific icon
    switch (status) {
      case "reading":
        return <BookOpen className="h-4 w-4 text-chart-3 mr-2 flex-shrink-0" />;
      case "completed":
        return <BookOpenCheck className="h-4 w-4 text-chart-1 mr-2 flex-shrink-0" />;
      case "to-read":
        return <BookMarked className="h-4 w-4 text-chart-4 mr-2 flex-shrink-0" />;
      default:
        return <BookMarked className="h-4 w-4 text-chart-4 mr-2 flex-shrink-0" />;
    }
  };
  
  // Handle reset progress
  const handleReset = () => {
    
    // Use resetReadingProgress with the callback to notify the context
    resetReadingProgress(bookId, (resetBookId, resetStatus, resetProgress) => {
      // This callback will run after the progress is reset in localStorage
      // Update local component state
      setProgress(0);
      setStatus(isInLibrary ? "to-read" : null);
      setCurrentPage(0);
      
      // Notify the context system for other components
      notifyReset(resetBookId, resetStatus, resetProgress);
    });
    
    toast.success("Reading progress reset", {
      description: isInLibrary 
        ? "Book has been reset to 'To Read' status." 
        : "Reading progress has been reset."
    });
    
    // Keep backward compatibility with event system
    if (typeof window !== 'undefined') {
      const resetEvent = new CustomEvent(READING_PROGRESS_RESET_EVENT, { 
        detail: { 
          bookId,
          status: "to-read",
          progress: 0
        } 
      });
      window.dispatchEvent(resetEvent);
    }
  };

  // The rest of your component remains the same...
  
  // Get the appropriate status text based on library status and progress
  const getStatusText = () => {
    // If progress is 0 and has content
    if (progress === 0) {
      return isInLibrary ? "To Read" : "Ready to Read";
    }
    
    // If not in library, use simple progress text
    if (!isInLibrary) {
      return progress >= 100 ? "Completed" : "Reading Progress";
    }

    // Otherwise, use status-based text
    return status === "reading" ? "Currently Reading" : 
           status === "completed" ? "Completed" : "To Read";
  };

  // Get the appropriate progress text
  const getProgressText = () => {
    // For 0% progress
    if (progress === 0) {
      return "0% Read";
    }
    
    // If book is completed in library, show "Complete" instead of "Read"
    if (isInLibrary && status === "completed") {
      return progress + "% Complete";
    }
    
    // For all other cases (in library or not)
    return progress + "% Read";
  };

  // For compact variant (similar to library card)
  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        <StatusIcon />
        <div className="text-sm font-medium">
          {progress === 0 
            ? (isInLibrary ? "To Read" : "Ready to Read")
            : (isInLibrary 
                ? (status === "reading" ? `${progress}% Read` : 
                  status === "completed" ? "Completed" : "To Read")
                : (progress >= 100 ? "Completed" : `${progress}% Read`)
              )
          }
        </div>
        
        {showReset && (
          // Only show refresh if:
          // 1. There's actual progress to reset (progress > 0), OR
          // 2. Book is in library and not in "to-read" status
          (progress > 0 || (isInLibrary && status !== "to-read")) 
        ) && (
          <Button 
            variant="ghost" 
            size="icon"
            onClick={handleReset}
            className="h-6 w-6 ml-auto"
          >
            <RefreshCw className="h-3 w-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={cn("rounded-lg border border-border p-4", className)}>
      <div className="flex items-center justify-between text-sm mb-3">
        <div className="flex items-center">
          <StatusIcon />
          <span className="font-medium">{getStatusText()}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="font-medium">{getProgressText()}</div>
          
          {showReset && (
            // Same condition as above
            (progress > 0 || (isInLibrary && status !== "to-read"))
          ) && (
            <Button 
              variant="ghost" 
              size="icon"
              onClick={handleReset}
              className="h-6 w-6"
              title="Reset Progress"
            >
              <RefreshCw className="h-3 w-3" />
            </Button>
          )}
        </div>
      </div>
      
      <Progress 
        value={progress} 
        className="h-2 mb-3"
        style={{
          '--progress-foreground': getProgressColor()
        } as React.CSSProperties}
      />
      
      {showDetails && (
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>
              {totalPages > 0 
                ? `Page ${currentPage} of ${totalPages}` 
                : "Ready to start reading"}
            </span>
          </div>
          {totalPages > 0 && currentPage > 0 && (
            <div>
              {totalPages - currentPage} pages remaining
            </div>
          )}
        </div>
      )}
    </div>
  );
}