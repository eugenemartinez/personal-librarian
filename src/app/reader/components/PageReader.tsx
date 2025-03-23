"use client";

import { useEffect } from 'react'; // Add this import
import { BookContent } from '@/data/bookContent';
import { useReader } from '../hooks/useReader';
import { ReaderHeader } from './ReaderHeader';
import { ReaderContent } from './ReaderContent';
import { ReaderFooter } from './ReaderFooter';
import { useRouter } from 'next/navigation';
import { markBookAsCompleted } from '@/utils/readerProgress';
import { toast } from 'sonner';

interface PageReaderProps {
  bookId: string;
  bookTitle: string;
  content: BookContent;
  preferredReadingMode: 'page' | 'scroll';
  setPreferredReadingMode: (mode: 'page' | 'scroll') => void;
}

export function PageReader({
  bookId, 
  bookTitle, 
  content,
  preferredReadingMode,
  setPreferredReadingMode
}: PageReaderProps) {
  const router = useRouter();
  
  const reader = useReader(bookId, content);
  
  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Left arrow - previous page
      if (e.key === 'ArrowLeft') {
        reader.prevPage();
      }
      
      // Right arrow - next page
      else if (e.key === 'ArrowRight') {
        reader.nextPage();
      }
      
      // Escape - exit reader
      else if (e.key === 'Escape') {
        router.back();
      }
    };
    
    // Add event listener
    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [reader, router]);
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ReaderHeader 
        bookId={bookId}
        bookTitle={bookTitle}
        currentPage={reader.currentPage}
        totalPages={reader.totalPages}
        progress={reader.progress}
        fontSize={reader.fontSize}
        setFontSize={reader.setFontSize}
        lineHeight={reader.lineHeight}
        setLineHeight={reader.setLineHeight}
        fontFamily={reader.fontFamily}
        setFontFamily={reader.setFontFamily}
        preferredReadingMode={preferredReadingMode}
        setPreferredReadingMode={setPreferredReadingMode}
        onMarkComplete={reader.handleMarkComplete}
      />
      
      <ReaderContent 
        content={content}
        currentPage={reader.currentPage}
        bookId={bookId}
      />
      
      <ReaderFooter 
        currentPage={reader.currentPage}
        totalPages={reader.totalPages}
        onPrevPage={reader.prevPage}
        onNextPage={reader.nextPage}
        onJumpToPage={reader.handleJumpToPage}
        isLastPage={reader.currentPage === reader.totalPages - 1}
        onMarkComplete={() => {
          markBookAsCompleted(bookId);
          toast.success("Book completed! 🎉");
          router.push(`/books/${bookId}`);
        }}
      />
    </div>
  );
}