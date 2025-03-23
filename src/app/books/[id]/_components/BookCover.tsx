import Image from 'next/image';
import { BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Book } from '@/data/books';

interface BookCoverProps {
  book: Book;
  hasContent: boolean;
}

export function BookCover({ book, hasContent }: BookCoverProps) {
  return (
    <div className="md:col-span-1">
      <div className="aspect-[2/3] relative rounded-lg overflow-hidden shadow-lg border border-border">
        {/* Read Now badge */}
        {hasContent && (
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="default" className="bg-primary text-primary-foreground font-medium">
              <BookOpen className="h-3 w-3 mr-1" />
              Read Now
            </Badge>
          </div>
        )}
        <Image
          src={book.coverImage}
          alt={book.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
            priority={true} // Add this prop to fix the warning
        />
      </div>
    </div>
  );
}