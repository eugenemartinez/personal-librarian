import { LibraryBook, ReadingStatus } from "@/utils/libraryUtils";
import { LibraryBookListItem } from "./LibraryBookListItem";

interface LibraryBooksListProps {
  books: LibraryBook[];
  bookStatuses: Record<string, { status: ReadingStatus, progress: number }>;
  onNavigate: (bookId: string) => void;
  onRemove: (bookId: string) => void;
  onStatusChange: (bookId: string, status: ReadingStatus, progress?: number) => void;
}

export function LibraryBooksList({
  books,
  bookStatuses,
  onNavigate,
  onRemove,
  onStatusChange
}: LibraryBooksListProps) {
  return (
    <div className="space-y-3">
      {books.map((book) => {
        // Get the latest status and progress from our state, or fall back to the book's values
        const currentStatus = bookStatuses[book.id]?.status || book.status;
        const currentProgress = bookStatuses[book.id]?.progress || book.progress;
        
        // Create a book object with the updated status
        const updatedBook = {
          ...book,
          status: currentStatus,
          progress: currentProgress
        };
        
        return (
          <LibraryBookListItem
            key={book.id}
            book={updatedBook}
            onClick={() => onNavigate(book.id)}
            onRemove={onRemove}
            onStatusChange={onStatusChange}
          />
        );
      })}
    </div>
  );
}