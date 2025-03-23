"use client";

import { ReadingStatus } from '@/utils/libraryUtils';
import { Book } from '@/data/books';
import { BaseBookListItem } from '@/components/books/BaseBookListItem';
import { BookStatusBadge } from './BookStatusBadge';
import { BookActionsMenu } from './BookActionsMenu';
import { useLibraryBookActions } from '@/hooks/useLibraryBookActions';
import { BookProgressBar } from './BookProgressBar';

type LibraryBook = Book & {
  status: ReadingStatus;
  progress: number;
};

interface LibraryBookListItemProps {
  book: LibraryBook;
  onClick: () => void;
  onRemove: (bookId: string) => void;
  onStatusChange?: (bookId: string, status: ReadingStatus) => void;
}

export function LibraryBookListItem({ 
  book, 
  onClick, 
  onRemove,
  onStatusChange 
}: LibraryBookListItemProps) {
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
    <BaseBookListItem 
      book={book}
      onClick={onClick}
      className="relative"
    >
      {/* Status badge - positioned at bottom left of the cover image */}
      <BookStatusBadge
        status={currentStatus}
        progress={currentProgress}
        className="absolute bottom-3 left-3 z-10"
      />
      
      {/* Actions dropdown - positioned at top right of the list item */}
      <div className="absolute top-3 right-3 z-10">
        <BookActionsMenu
          book={book}
          currentStatus={currentStatus}
          hasContent={hasContent}
          onStatusChange={handleStatusChange}
          onReadNow={handleReadNow}
          onRemove={handleRemove}
        />
      </div>
      
      {/* Progress indicator at bottom of list item */}
      <BookProgressBar
        status={currentStatus}
        progress={currentProgress}
        className="absolute bottom-0 left-0 right-0 z-10"
      />
    </BaseBookListItem>
  );
}