import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { 
  LibraryBook, 
  ReadingStatus,
  getLibraryBooks,
  removeBookFromLibrary 
} from '@/utils/libraryUtils';
import { getRecentReadingHistory, isReadingHistoryEnabled } from '@/utils/readingHistory';

export function useLibraryData() {
  const [libraryBooks, setLibraryBooks] = useState<LibraryBook[]>([]);
  const [readingHistory, setReadingHistory] = useState<any[]>([]);
  const [isHistoryEnabled, setIsHistoryEnabled] = useState(true);
  const [loading, setLoading] = useState(true);
  const [bookStatuses, setBookStatuses] = useState<Record<string, { 
    status: ReadingStatus, 
    progress: number 
  }>>({});

  // Load library data function
  const loadLibraryData = () => {
    const books = getLibraryBooks();
    setLibraryBooks(books);
    
    const historyEnabled = isReadingHistoryEnabled();
    setIsHistoryEnabled(historyEnabled);
    
    if (historyEnabled) {
      const history = getRecentReadingHistory();
      setReadingHistory(history);
    }
    
    setLoading(false);
  };

  // Initialize book statuses
  useEffect(() => {
    const initialStatuses: Record<string, { status: ReadingStatus, progress: number }> = {};
    libraryBooks.forEach(book => {
      initialStatuses[book.id] = { status: book.status, progress: book.progress };
    });
    setBookStatuses(initialStatuses);
  }, [libraryBooks]);

  // Handle status changes
  const handleStatusChange = (bookId: string, status: ReadingStatus, progress?: number) => {
    setBookStatuses(prev => ({
      ...prev,
      [bookId]: { 
        status, 
        progress: progress !== undefined ? progress : 
                 status === 'completed' ? 100 :
                 prev[bookId]?.progress || 0 
      }
    }));
  };

  // Handle book removal
  const handleRemoveBook = (bookId: string) => {
    removeBookFromLibrary(bookId);
    
    // Find the book title before removing from state
    const bookToRemove = libraryBooks.find(book => book.id === bookId);
    const bookTitle = bookToRemove?.title || "Book";
    
    // Update local state to reflect removal
    setLibraryBooks(prev => prev.filter(book => book.id !== bookId));
    
    toast.success(`Removed from library`, {
      description: `"${bookTitle}" has been removed from your library`
    });
  };

  return {
    libraryBooks,
    readingHistory,
    isHistoryEnabled,
    loading,
    setLoading,
    bookStatuses,
    handleStatusChange,
    handleRemoveBook,
    loadLibraryData
  };
}