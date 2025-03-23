"use client";

import { useState, useEffect } from 'react';
import { useParams, notFound } from 'next/navigation';
import { mockBooks } from '@/data/books';
import { bookContent, BookContent } from '@/data/bookContent';
import { PageReader } from '../components/PageReader';
import { ScrollReader } from '../components/ScrollReader';
import { useReadingSettings } from '@/contexts/ReadingSettingsContext';
import { recordBookReading } from '@/utils/readingHistory';
import { getBookContent as getStoredBookContent } from '@/utils/indexedDb';

// Keys of our sample book content
const SAMPLE_BOOK_KEYS = ["OL24209966W", "OL1394592W", "OL8974098W"];

export default function ReaderPage() {
  const { id } = useParams() as { id: string };
  const { settings, updateSettings } = useReadingSettings();
  const [preferredReadingMode, setPreferredReadingMode] = useState<'page' | 'scroll'>(settings.preferredReadingMode);
  const [isLoading, setIsLoading] = useState(true);
  const [bookData, setBookData] = useState<{ book: any, content: BookContent } | null>(null);
  
  // Load book content from IndexedDB or static data
  useEffect(() => {
    async function loadBookContent() {
      setIsLoading(true);
      
      try {
        // Check if this is an OpenLibrary ID (e.g., OL24209966W)
        const isOpenLibraryId = typeof id === 'string' && id.startsWith('OL') && (id.endsWith('W') || id.endsWith('M'));
        
        if (isOpenLibraryId) {
          // For OpenLibrary books, use stored metadata if available or create a minimal book object
          
          // First check if we have direct content for this specific book
          if (bookContent[id]) {
            // We have exact content for this book
            setBookData({
              book: {
                id: id,
                title: bookContent[id].title.replace(' (Preview)', ''),
                author: "Author",
                coverImage: "",
              },
              content: bookContent[id]
            });
            setIsLoading(false);
            return;
          }
          
          // If not, pick a random sample content
          const randomIndex = Math.floor(Math.random() * SAMPLE_BOOK_KEYS.length);
          const randomBookKey = SAMPLE_BOOK_KEYS[randomIndex];
          
          // Use the random content but with the original book's title (if we can get it)
          // In a real app, we'd fetch this from the API, but for simplicity we'll use a placeholder
          const bookTitle = `Book ${id}`;
          
          setBookData({
            book: {
              id: id,
              title: bookTitle,
              author: "Author",
              coverImage: "",
            },
            content: {
              ...bookContent[randomBookKey],
              title: `${bookTitle} (Preview)`
            }
          });
          setIsLoading(false);
          return;
        }
        
        // For non-OpenLibrary books, continue with the original flow
        const bookMetadata = mockBooks.find(book => book.id === id);
        if (!bookMetadata) {
          return; // Will trigger notFound() below
        }
        
        // First try to get content from IndexedDB (for offline support)
        const storedContent = await getStoredBookContent(id);
        
        // If found in IndexedDB, use that
        if (storedContent) {
          setBookData({
            book: bookMetadata,
            content: storedContent
          });
          setIsLoading(false);
          return;
        }
        
        // Fall back to static data if not in IndexedDB
        const staticContent = bookContent[id];
        if (staticContent) {
          setBookData({
            book: bookMetadata,
            content: staticContent
          });
        }
      } catch (error) {
        console.error("Error loading book:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadBookContent();
  }, [id]);
  
  // Record that this book was opened for reading
  useEffect(() => {
    // Commenting out this recording since we now record in BookActions
    // when the user clicks "Read Now"
    /*
    if (bookData?.book) {
      recordBookReading({
        id: bookData.book.id,
        title: bookData.book.title,
        author: bookData.book.author,
        coverImage: bookData.book.coverImage
      });
    }
    */
  }, [bookData?.book]);
  
  // Load preferred reading mode from context on mount
  useEffect(() => {
    setPreferredReadingMode(settings.preferredReadingMode);
  }, [settings.preferredReadingMode]);
  
  // Save preferred reading mode to context
  const handleModeChange = (mode: 'page' | 'scroll') => {
    setPreferredReadingMode(mode);
    updateSettings({ preferredReadingMode: mode });
  };
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-pulse text-muted-foreground">Loading book content...</div>
        </div>
      </div>
    );
  }
  
  // If no book data was found
  if (!bookData) {
    return notFound();
  }
  
  const { book, content } = bookData;
  
  // Render the appropriate reader based on mode
  return (
    <>
      {preferredReadingMode === 'page' ? (
        <PageReader 
          bookId={id} 
          bookTitle={book.title} 
          content={content}
          preferredReadingMode={preferredReadingMode}
          setPreferredReadingMode={handleModeChange}
        />
      ) : (
        <ScrollReader 
          bookId={id} 
          bookTitle={book.title} 
          content={content}
          preferredReadingMode={preferredReadingMode}
          setPreferredReadingMode={handleModeChange}
        />
      )}
    </>
  );
}