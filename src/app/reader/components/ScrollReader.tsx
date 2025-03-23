"use client";

import { useState, useEffect, useRef } from 'react';
import { BookContent } from '@/data/bookContent';
import { useReader } from '../hooks/useReader';
import { ReaderHeader } from './ReaderHeader';
import { ScrollFooter } from './ScrollFooter';
import { useRouter } from 'next/navigation';
import { markBookAsCompleted, updateReaderPosition } from '@/utils/readerProgress';
import { toast } from 'sonner';
import { debounce } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface ScrollReaderProps {
  bookId: string;
  bookTitle: string;
  content: BookContent;
  preferredReadingMode: 'page' | 'scroll';
  setPreferredReadingMode: (mode: 'page' | 'scroll') => void;
}

export function ScrollReader({
  bookId, 
  bookTitle, 
  content,
  preferredReadingMode,
  setPreferredReadingMode
}: ScrollReaderProps) {
  const router = useRouter();
  const contentRef = useRef<HTMLDivElement>(null);
  
  const reader = useReader(bookId, content);
  const { 
    fontSize, 
    lineHeight, 
    fontFamily, 
    scrollPosition,
    totalPages,
    setFontSize,
    setLineHeight,
    setFontFamily,
    setScrollPosition,
    handleMarkComplete 
  } = reader;

  // Calculate approximated current page based on scroll position
  const approximateCurrentPage = Math.floor((scrollPosition / 100) * (totalPages - 1));
  
  // Update scroll position on scroll
  useEffect(() => {
    const handleScroll = debounce(() => {
      if (!contentRef.current) return;
      
      const { scrollTop, scrollHeight, clientHeight } = contentRef.current;
      const scrolled = scrollTop / (scrollHeight - clientHeight) * 100;
      
      // Only update if there's a significant change
      if (Math.abs(scrolled - scrollPosition) > 0.5) {
        setScrollPosition(scrolled);
        
        // Update reader position
        const approximatePage = Math.ceil((scrolled / 100) * totalPages);
        if (approximatePage > 0) {
          updateReaderPosition(bookId, approximatePage, totalPages);
        }
      }
    }, 50);
    
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      
      // Set initial scroll position based on stored progress
      if (scrollPosition > 0 && contentElement.scrollHeight > contentElement.clientHeight) {
        const scrollTarget = (scrollPosition / 100) * (contentElement.scrollHeight - contentElement.clientHeight);
        contentElement.scrollTop = scrollTarget;
      }
    }
    
    return () => {
      contentElement?.removeEventListener('scroll', handleScroll);
    };
  }, [bookId, scrollPosition, setScrollPosition, totalPages]);
  
  // Scroll to top function
  const scrollToTop = () => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    }
  };

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!contentRef.current) return;

      // Escape - exit reader
      if (e.key === 'Escape') {
        router.back();
      }
      
      // Arrow Up - scroll up
      else if (e.key === 'ArrowUp') {
        contentRef.current.scrollBy({
          top: -100,
          behavior: 'smooth'
        });
      }
      
      // Arrow Down - scroll down
      else if (e.key === 'ArrowDown') {
        contentRef.current.scrollBy({
          top: 100,
          behavior: 'smooth'
        });
      }
      
      // Page Up - scroll up by a larger amount
      else if (e.key === 'PageUp') {
        contentRef.current.scrollBy({
          top: -window.innerHeight * 0.8,
          behavior: 'smooth'
        });
      }
      
      // Page Down - scroll down by a larger amount
      else if (e.key === 'PageDown') {
        contentRef.current.scrollBy({
          top: window.innerHeight * 0.8,
          behavior: 'smooth'
        });
      }
    };

    // Add event listener
    window.addEventListener('keydown', handleKeyDown);

    // Clean up
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [router]);

  return (
    <div className="flex flex-col h-screen bg-background reader-container">
      <ReaderHeader 
        bookId={bookId}
        bookTitle={bookTitle}
        currentPage={approximateCurrentPage} 
        totalPages={totalPages}
        progress={reader.progress}
        fontSize={fontSize}
        setFontSize={setFontSize}
        lineHeight={lineHeight}
        setLineHeight={setLineHeight}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        preferredReadingMode={preferredReadingMode}
        setPreferredReadingMode={setPreferredReadingMode}
        onMarkComplete={handleMarkComplete}
      />
      
      {/* Scroll reader content */}
      <div 
        ref={contentRef}
        className={cn(
          "flex-1 px-4 sm:px-6 md:px-8 py-6 overflow-y-auto reader-content",
          fontFamily === 'serif' && "font-serif",
          fontFamily === 'sans-serif' && "font-sans",
          fontFamily === 'monospace' && "font-mono"
        )}
      >
        {/* Render all content in one scrollable view */}
        {content.pages.map((page, index) => (
          <div key={index} className="max-w-2xl mx-auto mb-6">
            {page}
          </div>
        ))}
      </div>
      
      <ScrollFooter 
        scrollProgress={scrollPosition}
        onScrollToTop={scrollToTop}
        onMarkComplete={() => {
          markBookAsCompleted(bookId);
          toast.success("Book completed! 🎉");
          router.push(`/books/${bookId}`);
        }}
      />
    </div>
  );
}