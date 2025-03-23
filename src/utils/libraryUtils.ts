import { Book } from '@/data/books';
import { deleteDownloadedBook } from '@/utils/indexedDb';
import { getLocalStorage, setLocalStorage } from './localStorage';

// Constants
const LIBRARY_KEY = 'userLibrary';
const API_BOOK_CACHE_KEY = "apiBookCache";

// Helper function to normalize book IDs
function normalizeBookId(id: string): string {
  if (!id.includes('/works/') && id.match(/^OL\d+W$/)) {
    return `/works/${id}`;
  }
  if (id.startsWith('/works/')) {
    return id.replace('/works/', '');
  }
  return id;
}

// Load API book cache
function loadApiBookCache(): Record<string, Book> {
  return getLocalStorage<Record<string, Book>>(API_BOOK_CACHE_KEY, {});
}

// Save a book to the cache
export function saveBookToCache(book: Book): void {
  if (!book || !book.id) return;

  const cache = loadApiBookCache();
  const normalizedId = normalizeBookId(book.id);

  cache[book.id] = book;
  if (normalizedId !== book.id) {
    cache[normalizedId] = book;
  }

  setLocalStorage(API_BOOK_CACHE_KEY, cache);
}

// Get a cached book by ID
export function getCachedBook(bookId: string): Book | null {
  if (!bookId) return null;

  const cache = loadApiBookCache();
  const normalizedId = normalizeBookId(bookId);

  return cache[bookId] || cache[normalizedId] || null;
}

// Define types
export type ReadingStatus = "to-read" | "reading" | "completed";
export type SortOrder = "default" | "title" | "author" | "newest";

export interface LibraryItem {
  bookId: string;
  dateAdded: string;
  status: ReadingStatus;
  progress: number;
  lastRead?: string;
  lastUpdated?: string;
}

export type LibraryBook = Book & {
  status: ReadingStatus;
  progress: number;
};

// Get the user's library
export function getUserLibrary(): LibraryItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const libraryData = localStorage.getItem(LIBRARY_KEY);
    return libraryData ? JSON.parse(libraryData) : [];
  } catch {
    return [];
  }
}

// Check if a book is in the library
export function isBookInLibrary(bookId: string): boolean {
  const library = getUserLibrary();
  return library.some(item => item.bookId === bookId);
}

// Add a book to the library
export function addBookToLibrary(bookId: string): void {
  addBookToLibraryWithStatus(bookId, "to-read", 0);
}

// Add a book to the library with a specific status
export function addBookToLibraryWithStatus(
  bookId: string, 
  status: ReadingStatus = "to-read",
  progress: number = 0
): void {
  if (typeof window === 'undefined') return;

  try {
    const library = getUserLibrary();
    const existingIndex = library.findIndex(book => book.bookId === bookId);

    if (existingIndex !== -1) {
      library[existingIndex].status = status;
      library[existingIndex].progress = progress;
      library[existingIndex].lastUpdated = new Date().toISOString();
    } else {
      library.push({
        bookId,
        dateAdded: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
        status,
        progress
      });
    }

    localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
  } catch {}
}

// Remove a book from the library
export function removeBookFromLibrary(bookId: string): void {
  if (typeof window === 'undefined') return;

  const library = getUserLibrary();
  const updatedLibrary = library.filter(item => item.bookId !== bookId);
  localStorage.setItem(LIBRARY_KEY, JSON.stringify(updatedLibrary));

  try {
    deleteDownloadedBook(bookId).catch(() => {});
  } catch {}
}

// Update a book's status in the library
export function updateBookStatus(bookId: string, status: ReadingStatus, resetProgress = false): void {
  if (typeof window === 'undefined') return;

  const library = getUserLibrary();
  const bookIndex = library.findIndex(item => item.bookId === bookId);

  if (bookIndex >= 0) {
    const prevStatus = library[bookIndex].status;

    library[bookIndex].status = status;

    if (status === "completed") {
      library[bookIndex].progress = 100;
    } else if (status === "reading" && prevStatus === "completed" && resetProgress) {
      library[bookIndex].progress = 0;
    } else if (status === "to-read") {
      library[bookIndex].progress = 0;
    }

    if (status === "reading" || status === "completed") {
      library[bookIndex].lastRead = new Date().toISOString();
    }

    library[bookIndex].lastUpdated = new Date().toISOString();
    localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
  }
}

// Update a book's reading progress
export function updateReadingProgress(bookId: string, progress: number): void {
  if (typeof window === 'undefined') return;

  const library = getUserLibrary();
  const bookIndex = library.findIndex(item => item.bookId === bookId);

  if (bookIndex >= 0) {
    const validProgress = Math.max(0, Math.min(100, progress));

    library[bookIndex].progress = validProgress;

    if (validProgress === 100) {
      library[bookIndex].status = "completed";
    } else if (library[bookIndex].status === "to-read" && validProgress > 0) {
      library[bookIndex].status = "reading";
    }

    library[bookIndex].lastRead = new Date().toISOString();
    library[bookIndex].lastUpdated = new Date().toISOString();

    localStorage.setItem(LIBRARY_KEY, JSON.stringify(library));
  }
}

// Get reading progress for a book
export function getReadingProgress(bookId: string): number {
  const library = getUserLibrary();
  const book = library.find(item => item.bookId === bookId);
  return book ? book.progress : 0;
}

// Get reading status for a book
export function getReadingStatus(bookId: string): ReadingStatus | null {
  const library = getUserLibrary();
  const book = library.find(item => item.bookId === bookId);
  return book ? book.status : null;
}

// Get recently read books
export function getRecentlyReadBooks(limit: number = 5): LibraryItem[] {
  const library = getUserLibrary();
  return library
    .filter(item => item.lastRead && item.status === "reading")
    .sort((a, b) => new Date(b.lastRead!).getTime() - new Date(a.lastRead!).getTime())
    .slice(0, limit);
}

// Get books by status
export function getBooksByStatus(status: ReadingStatus): LibraryItem[] {
  const library = getUserLibrary();
  return library.filter(item => item.status === status);
}

// Get all books in the library with metadata
export function getLibraryBooks(): LibraryBook[] {
  const userLibrary = getUserLibrary();
  const cache = loadApiBookCache();

  return userLibrary.map(item => {
    const normalizedId = normalizeBookId(item.bookId);
    const cachedBook = cache[item.bookId] || cache[normalizedId];

    if (cachedBook) {
      return {
        ...cachedBook,
        status: item.status,
        progress: item.progress
      };
    }

    return {
      id: item.bookId,
      title: item.bookId.includes('OL') ? `Book ${item.bookId.split('/').pop()}` : `Book ${item.bookId}`,
      author: "Unknown Author",
      coverImage: "",
      description: "Book details will appear once you view this book.",
      publishedDate: new Date().toISOString().split('T')[0],
      pageCount: 0,
      categories: [],
      averageRating: 0,
      ratingsCount: 0,
      status: item.status,
      progress: item.progress
    };
  });
}

// Filter books by status
export function filterBooksByStatus(books: LibraryBook[], status: ReadingStatus | "all"): LibraryBook[] {
  if (status === "all") return books;
  return books.filter(book => book.status === status);
}

// Sort books by order
export function sortBooks(books: LibraryBook[], sortOrder: SortOrder): LibraryBook[] {
  return [...books].sort((a, b) => {
    switch (sortOrder) {
      case 'title':
        return (a.title || '').localeCompare(b.title || '');
      case 'author':
        return (a.author || '').localeCompare(b.author || '');
      case 'newest':
        const aLibrary = getUserLibrary().find(item => item.bookId === a.id);
        const bLibrary = getUserLibrary().find(item => item.bookId === b.id);
        const aDate = aLibrary?.dateAdded || a.publishedDate || '';
        const bDate = bLibrary?.dateAdded || b.publishedDate || '';
        const aTime = aDate ? new Date(aDate).getTime() : 0;
        const bTime = bDate ? new Date(bDate).getTime() : 0;
        return bTime - aTime;
      case 'default':
      default:
        return 0;
    }
  });
}

// Get reading status for a book from history
export function getReadingStatusFromHistory(
  historyItem: any, 
  libraryBooks: LibraryBook[],
  bookStatuses?: Record<string, { status: ReadingStatus, progress: number }>
): {
  status: ReadingStatus,
  progress: number
} {
  const libraryBook = libraryBooks.find(book => book.id === historyItem.bookId);

  if (libraryBook) {
    return {
      status: bookStatuses?.[historyItem.bookId]?.status || libraryBook.status,
      progress: bookStatuses?.[historyItem.bookId]?.progress || libraryBook.progress
    };
  } else {
    return {
      status: historyItem.percentComplete === 100 ? "completed" : 
             historyItem.percentComplete > 0 ? "reading" : "to-read",
      progress: historyItem.percentComplete || 0
    };
  }
}

/**
 * Get appropriate button text and icon based on reading status
 */
export function getReadingActionInfo(status: ReadingStatus, progress: number): {
  buttonText: string;
  iconType: "book" | "book-open";
} {
  if (status === "completed") {
    return {
      buttonText: "Read Again",
      iconType: "book"
    };
  } else if (progress > 0 || status === "reading") {
    return {
      buttonText: "Continue",
      iconType: "book-open"
    };
  } else {
    return {
      buttonText: "Start Reading",
      iconType: "book"
    };
  }
}

/**
 * Creates an empty library component message
 */
export function getEmptyStateMessage(type: "library" | "category" | "history"): {
  title: string;
  description: string;
  actionText?: string;
} {
  switch (type) {
    case "library":
      return {
        title: "Your library is empty",
        description: "Add books to your library to keep track of what you're reading, what you've read, and what you want to read.",
        actionText: "Browse Books"
      };
    case "category":
      return {
        title: "No books in this category",
        description: "Add books to this category by changing their status."
      };
    case "history":
      return {
        title: "Your reading history is empty",
        description: "Books you read will appear here automatically."
      };
  }
}