"use client";

import { useEffect } from 'react';
import { StarRating } from '@/components/ui/star-rating';
import { Badge } from '@/components/ui/badge';
import { Book } from '@/data/books';
import { BookDetailsHeader } from './_components/BookDetailsHeader';
import { BookCover } from './_components/BookCover';
import { BookActions } from './_components/BookActions';
import { ReadingProgressBar } from './_components/ReadingProgressBar';
import { isBookInLibrary } from '@/utils/libraryUtils';
import { useState } from 'react';

interface BookDetailsProps {
  book: Book;
  hasContent: boolean;
  readUrl?: string | null;
}

export function BookDetails({ book, hasContent, readUrl }: BookDetailsProps) {
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Share book data with child components via window object
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize if not exists
      if (!window.bookDetailsData) {
        window.bookDetailsData = {};
      }
      
      // Store this book's data
      window.bookDetailsData[book.id] = {
        id: book.id,
        title: book.title,
        author: book.author,
        coverImage: book.coverImage
      };
      
      // Cleanup
      return () => {
        if (window.bookDetailsData) {
          delete window.bookDetailsData[book.id];
        }
      };
    }
  }, [book]);
  
  // Check if book is in library on mount
  useEffect(() => {
    setMounted(true);
    setIsInLibrary(isBookInLibrary(book.id));
  }, [book.id]);
  
  const publishDate = new Date(book.publishedDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="container mx-auto py-6 px-4">
      {/* Pass readUrl to BookDetailsHeader and other components as needed */}
      <BookDetailsHeader 
        bookId={book.id} 
        bookTitle={book.title}
        hasContent={hasContent}
        readUrl={readUrl}  // Pass it down if needed
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
        {/* Book Cover */}
        <BookCover book={book} hasContent={hasContent} />
        
        {/* Book Details */}
        <div className="md:col-span-2">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2 text-foreground">{book.title}</h1>
          <p className="text-lg sm:text-xl text-muted-foreground mb-3 sm:mb-4">by {book.author}</p>
          
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="flex items-center mr-3 sm:mr-4">
              <StarRating rating={book.averageRating} size="md" ratingsCount={book.ratingsCount} />
            </div>
          </div>

          
          <div className="flex flex-wrap gap-2 mb-5 sm:mb-6">
            {book.categories.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-5 sm:mb-6">
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Published</p>
              <p className="text-foreground">{publishDate}</p>
            </div>
            <div>
              <p className="text-xs sm:text-sm text-muted-foreground">Pages</p>
              <p className="text-foreground">{book.pageCount}</p>
            </div>
          </div>
          
          <div className="mb-5 sm:mb-6">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">Description</h2>
            <p className="text-sm sm:text-base text-foreground">{book.description}</p>
          </div>

            {/* Enhanced Reading Progress - Show regardless of library status */}
            {mounted && (
            <div className="mb-5 sm:mb-6">
              <ReadingProgressBar 
                bookId={book.id}
                showReset={true}  // Always show reset 
                showDetails={true}
                hasContent={hasContent}  // Pass hasContent to control visibility at 0%
              />
            </div>
          )}
          
          {/* Pass readUrl to BookActions */}
          <BookActions 
            bookId={book.id} 
            hasContent={hasContent} 
            readUrl={readUrl}  // Pass it down
          />
        </div>
      </div>
    </div>
  );
}