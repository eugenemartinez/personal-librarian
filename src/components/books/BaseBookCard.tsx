"use client";

import Image from 'next/image';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { Book } from '@/data/books';
import { cn } from '@/lib/utils';

export interface BaseBookCardProps {
  book: Book;
  onClick?: () => void;
  className?: string;
  children?: React.ReactNode;
  coverClassname?: string;
  priority?: boolean;
}

export function BaseBookCard({ 
  book, 
  onClick, 
  className,
  children,
  coverClassname,
  priority = false 
}: BaseBookCardProps) {
  return (
    <Card 
      onClick={onClick}
      className={cn(
        "h-full hover:shadow-lg transition-shadow cursor-pointer border-border group relative",
        className
      )}
    >
      <div className={cn("aspect-[2/3] relative overflow-hidden rounded-t-lg", coverClassname)}>
        {/* Slot for action buttons, badges, etc. */}
        {children}
        
        {/* Book Cover */}
        <Image 
          src={book.coverImage}
          alt={book.title}
          fill
          priority={priority}
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>
      
      <CardHeader className="pb-2">
        <h2 className="font-semibold text-lg line-clamp-2 text-foreground">{book.title}</h2>
        <p className="text-sm text-muted-foreground">{book.author}</p>
      </CardHeader>
      
      <CardContent className="pb-2">
        <StarRating rating={book.averageRating} size="sm" />
      </CardContent>
      
      <CardFooter className="flex flex-wrap gap-2">
        {book.categories.slice(0, 2).map((category) => (
          <Badge key={category} variant="secondary" className="text-xs">
            {category}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
}