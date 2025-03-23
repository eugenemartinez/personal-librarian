"use client";

import Image from 'next/image';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { Book } from '@/data/books';
import { cn } from '@/lib/utils';

export interface BaseBookListItemProps {
  book: Book;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  priority?: boolean;
}

export function BaseBookListItem({ 
  book, 
  onClick, 
  className,
  children,
  priority = false 
}: BaseBookListItemProps) {
  // Safe date formatting function
  const formatYear = (dateString: string): string => {
    if (!dateString) return 'Unknown';
    
    try {
      // If it's a year only (4 digits)
      const yearMatch = dateString.match(/^\d{4}$/);
      if (yearMatch) {
        return yearMatch[0];
      }
      
      // Try parsing as full date
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.getFullYear().toString();
      }
      
      // Extract year from other formats like "2005-06" or text with a year
      const yearExtract = dateString.match(/\b(18|19|20)\d{2}\b/);
      if (yearExtract) {
        return yearExtract[0];
      }
      
      // If all else fails, return the raw string or a default
      return dateString.length > 10 ? 'Unknown year' : dateString;
    } catch (error) {
      // Fallback for any errors
      return 'Unknown year';
    }
  };
  
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "flex hover:shadow-md flex-row transition-shadow cursor-pointer border-border group relative p-3",
        className
      )}
    >
      {/* Slot for action buttons, badges, etc. */}
      {children}
      
      {/* Book Cover */}
      <div className="relative w-[90px] h-[135px] mr-4 flex-shrink-0">
        <Image 
          src={book.coverImage || "/images/placeholder-cover.png"}
          alt={book.title}
          fill
          priority={priority}
          className="object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
          sizes="90px"
        />
      </div>
      
      {/* Book Info */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Title and Author section */}
        <div>
          <h2 className="font-semibold text-lg line-clamp-2 text-foreground group-hover:text-primary transition-colors">
            {book.title}
          </h2>
          <p className="text-sm text-muted-foreground">{book.author}</p>
        </div>
        
        {/* Rating and Published Date */}
        <div className="flex items-center gap-3 mt-2">
          <StarRating rating={book.averageRating} size="sm" />
          {book.publishedDate && (
            <span className="text-xs text-muted-foreground">
              {formatYear(book.publishedDate)}
            </span>
          )}
        </div>
        
        {/* Description */}
        {book.description && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2 max-w-2xl">
            {book.description}
          </p>
        )}
        
        {/* Categories */}
        <div className="mt-auto pt-2 flex flex-wrap gap-1">
          {book.categories && book.categories.length > 0 ? (
            book.categories.slice(0, 3).map((category, index) => (
              <Badge key={`${category}-${index}`} variant="secondary" className="text-xs">
                {category}
              </Badge>
            ))
          ) : (
            <Badge variant="secondary" className="text-xs">Uncategorized</Badge>
          )}
        </div>
      </div>
    </Card>
  );
}