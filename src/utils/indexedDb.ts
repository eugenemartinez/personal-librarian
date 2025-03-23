import { bookContent, BookContent } from '@/data/bookContent';
import { mockBooks } from '@/data/books';

// Define constants
const DB_NAME = 'personalLibraryDB';
const DB_VERSION = 1;
const BOOKS_STORE = 'books';

// Store books in the same format as your static data
interface StoredBook extends BookContent {
  id: string;
  coverImage: string;
  author: string;
  dateDownloaded: string;
  lastAccessed?: string;
}

// Initialize the database
export function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (!window.indexedDB) {
      reject(new Error('IndexedDB is not supported in this browser'));
      return;
    }

    const request = window.indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error('Error opening IndexedDB'));
    };

    request.onsuccess = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Create object store for books
      if (!db.objectStoreNames.contains(BOOKS_STORE)) {
        const store = db.createObjectStore(BOOKS_STORE, { keyPath: 'id' });
        store.createIndex('by_title', 'title', { unique: false });
        store.createIndex('by_date', 'dateDownloaded', { unique: false });
      }
    };
  });
}

// Check if a book exists in IndexedDB
export async function bookExists(bookId: string): Promise<boolean> {
  try {
    const db = await initDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(BOOKS_STORE, 'readonly');
      const store = transaction.objectStore(BOOKS_STORE);
      const request = store.get(bookId);

      request.onsuccess = () => {
        resolve(!!request.result);
      };

      request.onerror = () => {
        resolve(false);
      };
    });
  } catch {
    return false;
  }
}

// Save a book to IndexedDB for offline access
export async function saveBook(storedBook: StoredBook): Promise<boolean> {
  try {
    const db = await initDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(BOOKS_STORE, 'readwrite');
      const store = transaction.objectStore(BOOKS_STORE);
      const request = store.put(storedBook);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = () => {
        resolve(false);
      };
    });
  } catch {
    return false;
  }
}

// Get a book from IndexedDB
export async function getStoredBook(bookId: string): Promise<StoredBook | null> {
  try {
    const db = await initDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(BOOKS_STORE, 'readonly');
      const store = transaction.objectStore(BOOKS_STORE);
      const request = store.get(bookId);

      request.onsuccess = () => {
        if (request.result) {
          const book = request.result as StoredBook;

          // Update last accessed time
          const updateTx = db.transaction(BOOKS_STORE, 'readwrite');
          const updateStore = updateTx.objectStore(BOOKS_STORE);
          book.lastAccessed = new Date().toISOString();
          updateStore.put(book);

          resolve(book);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        resolve(null);
      };
    });
  } catch {
    return null;
  }
}

// Download (cache) book content for offline use
export async function downloadBook(bookId: string, bookTitle: string): Promise<boolean> {
  try {
    // First check if book already exists in IndexedDB
    const exists = await bookExists(bookId);
    if (exists) {
      return true;
    }

    // Get book content from static data
    const content = bookContent[bookId];
    if (!content) {
      throw new Error('Book content not found');
    }

    // Get book metadata
    const book = mockBooks.find(b => b.id === bookId);
    if (!book) {
      throw new Error('Book metadata not found');
    }

    // Create stored book object with all needed data
    const storedBook: StoredBook = {
      id: bookId,
      title: book.title,
      pages: content.pages,
      author: book.author,
      coverImage: book.coverImage,
      dateDownloaded: new Date().toISOString()
    };

    // Save to IndexedDB
    return await saveBook(storedBook);
  } catch {
    return false;
  }
}

// Function to get cached book content (for use in Reader components)
export async function getBookContent(bookId: string): Promise<BookContent | null> {
  try {
    const storedBook = await getStoredBook(bookId);
    if (storedBook) {
      return {
        title: storedBook.title,
        pages: storedBook.pages
      };
    }
    return null;
  } catch {
    return null;
  }
}

// Delete a downloaded book
export async function deleteDownloadedBook(bookId: string): Promise<boolean> {
  try {
    const db = await initDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(BOOKS_STORE, 'readwrite');
      const store = transaction.objectStore(BOOKS_STORE);
      const request = store.delete(bookId);

      request.onsuccess = () => {
        resolve(true);
      };

      request.onerror = () => {
        resolve(false);
      };
    });
  } catch {
    return false;
  }
}