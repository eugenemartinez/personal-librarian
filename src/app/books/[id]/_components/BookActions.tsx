"use client";

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { BookOpen, Trash2, PlusCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  isBookInLibrary, 
  addBookToLibrary, 
  removeBookFromLibrary,
  getReadingStatus,
  getReadingProgress,
  ReadingStatus,
  addBookToLibraryWithStatus,
  saveBookToCache
} from '@/utils/libraryUtils';
import { startReadAgain, getReaderProgress } from '@/utils/readerProgress';
import { toast } from 'sonner';
import { READING_PROGRESS_RESET_EVENT } from './ReadingProgressBar';
import { useBookStatus } from '@/contexts/BookStatusContext';
// Import the recordBookReading function
import { recordBookReading } from '@/utils/readingHistory';

interface BookActionsProps {
  bookId: string;
  hasContent: boolean;
  readUrl?: string | null;
}

interface ProgressResetEvent {
  bookId: string;
  status: ReadingStatus;
  progress: number;
}

export function BookActions({ bookId, hasContent, readUrl }: BookActionsProps) {
  const router = useRouter();
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [readingStatus, setReadingStatus] = useState<ReadingStatus | null>(null);
  const [readingProgress, setReadingProgress] = useState(0);
  const [actualProgress, setActualProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [book, setBook] = useState<any>(null);
  
  // Add the book status context
  const { updateLibraryStatus } = useBookStatus();
  
  // Load book data function
  const loadBookData = () => {
    setIsInLibrary(isBookInLibrary(bookId));
    setReadingStatus(getReadingStatus(bookId));
    setReadingProgress(getReadingProgress(bookId));
    
    // Get actual reading progress regardless of library status
    setActualProgress(getReaderProgress(bookId));
  };
  
  // Check if book is in library and get reading status
  useEffect(() => {
    setMounted(true);
    loadBookData();
    
    // Get book data from parent component if available
    if (window.bookDetailsData?.[bookId]) {
      setBook(window.bookDetailsData[bookId]);
    }
  }, [bookId]);
  
  // Listen for reading progress reset events
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleProgressReset = (event: Event) => {
      const customEvent = event as CustomEvent<ProgressResetEvent>;
      const { bookId: eventBookId, status, progress } = customEvent.detail;
      
      // Only update if this event is for our book
      if (eventBookId === bookId) {
        setReadingStatus(status);
        setReadingProgress(progress);
        setActualProgress(0); // Reset actual progress too
      }
    };
    
    window.addEventListener(READING_PROGRESS_RESET_EVENT, handleProgressReset);
    
    return () => {
      window.removeEventListener(READING_PROGRESS_RESET_EVENT, handleProgressReset);
    };
  }, [bookId]);
  
  const handleLibraryAction = () => {
    if (isInLibrary) {
      removeBookFromLibrary(bookId);
      setIsInLibrary(false);
      setReadingStatus(null);
      setReadingProgress(0);
      toast.success("Removed from your library");
      
      // Notify other components of library status change
      updateLibraryStatus(bookId, false);
    } else {
      // Determine the appropriate status based on reading progress
      let newStatus: ReadingStatus = "to-read";
      
      // If there's actual reading progress, set as "reading" instead of "to-read"
      if (actualProgress > 0) {
        if (actualProgress >= 100) {
          newStatus = "completed";
        } else {
          newStatus = "reading";
        }
      }
      
      // Add to library with the appropriate status
      addBookToLibraryWithStatus(bookId, newStatus, actualProgress);
      
      setIsInLibrary(true);
      setReadingStatus(newStatus);
      toast.success(`Added to your ${newStatus === "reading" ? "Currently Reading" : 
                   newStatus === "completed" ? "Completed" : "To Read"} shelf`);
      
      // Notify other components of library status change
      updateLibraryStatus(bookId, true);
    }
  };
  
  // Modified handleReadNow to record reading history
  const handleReadNow = useCallback(() => {
    // Record this book in reading history
    if (book) {
      // If we have book data available, use it for recording
      recordBookReading({
        id: bookId,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage // This maps to coverUrl in reading history
      });
    } else {
      // If parent didn't provide book data, try to find it in DOM
      const titleElement = document.querySelector('h1');
      const authorElement = document.querySelector('p.text-lg, p.text-xl');
      const coverElement = document.querySelector('img[alt*="Cover"]') as HTMLImageElement;
      
      recordBookReading({
        id: bookId,
        title: titleElement?.textContent || "Unknown Book",
        author: authorElement?.textContent?.replace('by ', '') || undefined,
        coverImage: coverElement?.src
      });
    }
    
    // Navigate to reader
    router.push(`/reader/${bookId}`);
  }, [bookId, router, book]);
  
  // Modified handleReadAgain to record reading history
  const handleReadAgain = () => {
    // Record this book in reading history same as handleReadNow
    if (book) {
      recordBookReading({
        id: bookId,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage
      });
    } else {
      const titleElement = document.querySelector('h1');
      const authorElement = document.querySelector('p.text-lg, p.text-xl');
      const coverElement = document.querySelector('img[alt*="Cover"]') as HTMLImageElement;
      
      recordBookReading({
        id: bookId,
        title: titleElement?.textContent || "Unknown Book",
        author: authorElement?.textContent?.replace('by ', '') || undefined,
        coverImage: coverElement?.src
      });
    }
    
    // Use startReadAgain with default behavior (sets as "reading")
    startReadAgain(bookId, false); // Explicitly set to reading mode
    
    // Update local state
    setReadingStatus("reading");
    setReadingProgress(0);
    setActualProgress(0);
    
    toast.success("Starting over", {
      description: "Progress has been reset. Enjoy reading again!"
    });
    router.push(`/reader/${bookId}`);
  };

  // New handleAddToLibrary function
  const handleAddToLibrary = () => {
    // Make sure we have the book data
    if (book) {
      // Save to cache before adding to library
      saveBookToCache(book);
    }
    
    // Then continue with adding to library
    addBookToLibraryWithStatus(bookId, "to-read");
    
    // Rest of your function...
  };
  
  // Safe rendering for SSR
  if (!mounted) {
    return (
      <div className="flex flex-row gap-2">
        <Button size="sm" className="w-full sm:w-auto">Add to Library</Button>
        {hasContent && (
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <BookOpen className="h-4 w-4 mr-2" />
            Read Now
          </Button>
        )}
      </div>
    );
  }
  
  const isCompleted = readingStatus === "completed" || actualProgress >= 100;
  const hasStartedReading = actualProgress > 0 && actualProgress < 100;
  
  // The rest of your component stays the same
  
  // Get the appropriate read button text and icon
  const getReadButtonContent = () => {
    if (isCompleted) {
      return (
        <>
          <RefreshCw className="h-4 w-4 mr-2" />
          Read Again
        </>
      );
    } else if (hasStartedReading) {
      return (
        <>
          <BookOpen className="h-4 w-4 mr-2" />
          Continue Reading
        </>
      );
    } else {
      return (
        <>
          <BookOpen className="h-4 w-4 mr-2" />
          Read Now
        </>
      );
    }
  };
  
  // Prioritize the Read button on smaller screens
  const readingButton = (
    <>
      {hasContent && (
        <Button 
          variant={isInLibrary ? "outline" : "default"}
          size="sm"
          className="flex-1"
          onClick={isCompleted ? handleReadAgain : handleReadNow}
        >
          {getReadButtonContent()}
        </Button>
      )}
      
      {!hasContent && (
        <Button variant="outline" size="sm" className="flex-1" disabled>
          Preview Unavailable
        </Button>
      )}
    </>
  );
  
  const libraryButton = (
    <Button 
      size="sm"
      className="flex-1"
      onClick={handleLibraryAction}
      variant={isInLibrary ? "destructive" : (hasContent ? "outline" : "default")}
    >
      {isInLibrary ? (
        <>
          <Trash2 className="h-4 w-4 mr-2" />
          Remove
        </>
      ) : (
        <>
          <PlusCircle className="h-4 w-4 mr-2" />
          {hasContent ? "Add to Library" : "Save for Later"}
        </>
      )}
    </Button>
  );
  
  return (
    <div className="flex flex-row gap-2">
      {/* On mobile, show reading button first if it has content */}
      {hasContent ? (
        <>
          {readingButton}
          {libraryButton}
        </>
      ) : (
        <>
          {libraryButton}
          {readingButton}
        </>
      )}
    </div>
  );
}

// Add this to window object for communication between components
declare global {
  interface Window {
    bookDetailsData?: Record<string, any>;
  }
}