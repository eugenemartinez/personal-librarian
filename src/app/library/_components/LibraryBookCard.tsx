"use client";

import { ReadingStatus } from '@/utils/libraryUtils';
import { Book } from '@/data/books';
import { BaseBookCard } from '@/components/books/BaseBookCard';
import { BookStatusBadge } from './BookStatusBadge';
import { BookProgressBar } from './BookProgressBar';
import { BookActionsMenu } from './BookActionsMenu';
import { useLibraryBookActions } from '@/hooks/useLibraryBookActions';

type LibraryBook = Book & {
  status: ReadingStatus;
  progress: number;
};

interface LibraryBookCardProps {
  book: LibraryBook;
  onClick: () => void;
  onRemove: (bookId: string) => void;
  onStatusChange?: (bookId: string, status: ReadingStatus) => void;
}

export function LibraryBookCard({ 
  book, 
  onClick, 
  onRemove,
  onStatusChange 
}: LibraryBookCardProps) {
  const {
    currentStatus,
    currentProgress,
    hasContent,
    handleRemove,
    handleReadNow,
    handleStatusChange
  } = useLibraryBookActions(
    book.id,
    book.title,
    book.status,
    book.progress,
    onRemove,
    onStatusChange
  );

  return (
    <BaseBookCard 
      book={book}
      onClick={onClick}
    >
      {/* Reading progress indicator */}
      <BookProgressBar
        status={currentStatus}
        progress={currentProgress}
        className="absolute top-0 left-0 right-0 z-10"
      />
      
      {/* Status badge */}
      <BookStatusBadge
        status={currentStatus}
        progress={currentProgress}
        className="absolute top-2 left-2 z-10"
      />
      
      {/* Actions Menu */}
      <div className="absolute top-2 right-2 z-10">
        <BookActionsMenu
          book={book}
          currentStatus={currentStatus}
          hasContent={hasContent}
          onStatusChange={handleStatusChange}
          onReadNow={handleReadNow}
          onRemove={handleRemove}
        />
      </div>
    </BaseBookCard>
  );
}