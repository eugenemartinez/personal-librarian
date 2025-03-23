import { LibraryBook, ReadingStatus } from "@/utils/libraryUtils";
import { LibraryBookCard } from "./LibraryBookCard";

interface LibraryBooksGridProps {
  books: LibraryBook[];
  bookStatuses: Record<string, { status: ReadingStatus, progress: number }>;
  onNavigate: (bookId: string) => void;
  onRemove: (bookId: string) => void;
  onStatusChange: (bookId: string, status: ReadingStatus, progress?: number) => void;
}

export function LibraryBooksGrid({
  books,
  bookStatuses,
  onNavigate,
  onRemove,
  onStatusChange
}: LibraryBooksGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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
          <LibraryBookCard
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