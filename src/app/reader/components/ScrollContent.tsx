"use client";

import { useEffect, useRef } from 'react';
import { BookContent } from '@/data/bookContent';
import { Card } from '@/components/ui/card';

interface ScrollContentProps {
  content: BookContent;
  scrollPosition: number;
  setScrollPosition: (position: number) => void;
  bookId: string;
}

export function ScrollContent({
  content,
  scrollPosition,
  setScrollPosition,
  bookId
}: ScrollContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Apply saved scroll position on initial render
  useEffect(() => {
    if (containerRef.current && scrollPosition > 0) {
      const scrollableHeight = containerRef.current.scrollHeight - containerRef.current.clientHeight;
      const targetScroll = (scrollPosition / 100) * scrollableHeight;
      containerRef.current.scrollTop = targetScroll;
    }
  }, [scrollPosition]);

  // Track scroll position as the user scrolls
  const handleScroll = () => {
    if (containerRef.current) {
      const scrollableHeight = containerRef.current.scrollHeight - containerRef.current.clientHeight;
      if (scrollableHeight > 0) {
        const currentScrollPosition = (containerRef.current.scrollTop / scrollableHeight) * 100;
        // Only update if significantly changed (to reduce excessive updates)
        if (Math.abs(currentScrollPosition - scrollPosition) > 0.5) {
          setScrollPosition(currentScrollPosition);
        }
      }
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex-1 container mx-auto px-4 py-6 md:py-8 md:px-0 max-w-3xl overflow-y-auto"
      onScroll={handleScroll}
    >
      <Card className="p-6 sm:p-8 md:p-10 shadow-lg mb-8">
        <div className="reader-content">
          {/* Render title as H1 */}
          {content.pages[0] && (
            <h1 
              className="text-2xl font-bold mb-8" 
              dangerouslySetInnerHTML={{ __html: content.pages[0] }} 
            />
          )}
          
          {/* Render all other pages in one continuous flow */}
          <div className="space-y-8">
            {content.pages.slice(1).map((page, index) => (
              <div 
                key={`page-${index+1}`}
                dangerouslySetInnerHTML={{ __html: page }}
                className="min-h-[20vh]"
              />
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}