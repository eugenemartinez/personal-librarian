import { useState, useEffect } from 'react';
import { Book } from '@/data/books';
import { 
  searchBooks, 
  getBookById, 
  isBookReadable, 
  getBookReadUrl 
} from '@/lib/api/openLibraryApi';
import { saveBookToCache } from '@/utils/libraryUtils';

export function useBooks(query: string = '') {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      if (!query) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await searchBooks(query);
        
        // Cache all books from search results
        data.forEach(book => saveBookToCache(book));
        
        setBooks(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [query]);

  return { books, loading, error };
}

export function useBook(id: string) {
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const data = await getBookById(id);
        
        // Cache the book when fetched
        saveBookToCache(data);
        
        setBook(data);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  return { book, loading, error };
}

/**
 * Hook to check if a book is available for reading
 */
export function useBookContent(bookId: string) {
  const [isReadable, setIsReadable] = useState<boolean>(false);
  const [readUrl, setReadUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const checkReadability = async () => {
      if (!bookId) {
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);
      
      try {
        const readable = await isBookReadable(bookId);
        setIsReadable(readable);
        
        if (readable) {
          setReadUrl(getBookReadUrl(bookId));
        } else {
          setReadUrl(null);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to check book readability'));
        setIsReadable(false);
        setReadUrl(null);
      } finally {
        setLoading(false);
      }
    };

    checkReadability();
  }, [bookId]);

  return { isReadable, readUrl, loading, error };
}