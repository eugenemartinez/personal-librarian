"use client";

import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Check, Library } from 'lucide-react'; // Removed BookOpen import
import { setNavigationContext } from '@/utils/localStorage';
import { isBookInLibrary, addBookToLibrary, removeBookFromLibrary } from '@/utils/libraryUtils';
import { Book } from '@/data/books';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { BaseBookCard } from '@/components/books/BaseBookCard';

interface BookCardProps {
  book: Book;
  hasContent: boolean; // Keep this prop for backward compatibility
  priority?: boolean;
  onClick?: () => void;
  isSearch?: boolean;
}

export function BookCard({ 
  book, 
  hasContent, 
  priority = false, 
  onClick,
  isSearch = false
}: BookCardProps) {
  const router = useRouter();
  const [isInLibrary, setIsInLibrary] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  // Check if the book is already in the library
  useEffect(() => {
    setMounted(true);
    setIsInLibrary(isBookInLibrary(book.id));
  }, [book.id]);
  
  // Modified handler that uses the provided onClick or falls back to default behavior
  const handleBookClick = () => {
    if (onClick) {
      onClick();
    } else {
      // Default behavior - only used when no onClick is provided
      setNavigationContext("/books");
      router.push(`/books/${book.id}`);
    }
  };
  
  const handleLibraryToggle = (e: React.MouseEvent) => {
    // Prevent card click from triggering
    e.stopPropagation();
    
    if (isInLibrary) {
      removeBookFromLibrary(book.id);
      setIsInLibrary(false);
      toast.success(`Removed from library`, {
        description: `"${book.title}" has been removed from your library`
      });
    } else {
      addBookToLibrary(book.id);
      setIsInLibrary(true);
      toast.success(`Added to library`, {
        description: `"${book.title}" has been added to your library`
      });
    }
  };
  
  // Keep this function for potential future use but it's not being used now
  const handleReadNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    router.push(`/reader/${book.id}`);
  };
  
  return (
    <BaseBookCard 
      book={book}
      onClick={handleBookClick}
      priority={priority}
    >
      {/* Action badges at the top right */}
      <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-2">
        {/* Library badge */}
        {mounted && (
          <button
            type="button"
            onClick={handleLibraryToggle}
            className="p-0 bg-transparent border-0"
          >
            <Badge 
              variant={isInLibrary ? "secondary" : "default"}
              className={cn(
                "cursor-pointer flex items-center gap-1 shadow-md transition-transform hover:scale-105",
                isInLibrary ? "bg-secondary text-secondary-foreground" : "bg-primary text-primary-foreground"
              )}
            >
              {isInLibrary ? (
                <>
                  <Check className="h-3 w-3" />
                  In Library
                </>
              ) : (
                <>
                  <Library className="h-3 w-3" />
                  Add to Library
                </>
              )}
            </Badge>
          </button>
        )}
        
        {/* Read Now button has been removed */}
        
        {/* View Details badge - only show in search context */}
        {isSearch && (
          <Badge 
            variant="outline"
            className="font-medium shadow-md bg-background"
          >
            View Details
          </Badge>
        )}
      </div>
    </BaseBookCard>
  );
}