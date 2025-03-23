"use client";

import { Card } from '@/components/ui/card';
import { BookContent } from '@/data/bookContent';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ReaderContentProps {
  content: BookContent;
  currentPage: number;
  bookId: string;
}

export function ReaderContent({ 
  content, 
  currentPage,
  bookId
}: ReaderContentProps) {
  const [direction, setDirection] = useState(0); // 1 for forward, -1 for backward
  const [prevPage, setPrevPage] = useState(currentPage);
  
  // Detect direction of page transition
  useEffect(() => {
    if (currentPage > prevPage) {
      setDirection(1); // Moving forward
    } else if (currentPage < prevPage) {
      setDirection(-1); // Moving backward
    }
    setPrevPage(currentPage);
  }, [currentPage, prevPage]);
  
  return (
    <div className="flex-1 container mx-auto px-4 py-6 md:py-8 md:px-0 max-w-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ 
            opacity: 0,
            x: direction * 20 // Slight movement in the direction of travel
          }}
          animate={{ 
            opacity: 1,
            x: 0
          }}
          exit={{ 
            opacity: 0,
            x: direction * -20 // Exit in the opposite direction
          }}
          transition={{ 
            opacity: { duration: 0.2 }, 
            x: { duration: 0.2 }
          }}
        >
          <Card className="p-6 sm:p-8 md:p-10 shadow-lg">
            <div className="reader-content">
              {currentPage === 0 && (
                <h1 dangerouslySetInnerHTML={{ __html: content.pages[0] }} />
              )}
              {currentPage > 0 && (
                <div dangerouslySetInnerHTML={{ __html: content.pages[currentPage] }} />
              )}
            </div>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}