"use client";

import { useState, useEffect, useCallback } from "react";
import { Book } from '@/data/books';
import { BookCard } from './BookCard';
import { BookListItem } from './BookListItem';
import { ViewModeToggle } from '@/components/ui/view-mode-toggle';
import { useDisplaySettings } from '@/hooks/useDisplaySettings';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import { Loader2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { isBookInLibrary, saveBookToCache } from '@/utils/libraryUtils';
import { searchBooks } from '@/lib/api/openLibraryApi';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { ScrollToTopButton } from '@/components/ui/ScrollToTopButton';

// Number of books to load per page
const BOOKS_PER_PAGE = 12;

// Keys for storing state in session storage
const RANDOMIZATION_KEY = 'books_random_seed';
const BOOKS_TOPIC_KEY = 'books_topic';
const BOOKS_DISPLAYED_KEY = 'books_displayed';
const BOOKS_OFFSET_KEY = 'books_api_offset';
const BOOKS_HAS_MORE_KEY = 'books_has_more';

// Categories to choose from
const POPULAR_TOPICS = [
  "fantasy", "science fiction", "mystery", "thriller", 
  "romance", "biography", "history", "philosophy",
  "self-help", "adventure", "classics", "poetry",
  "fiction", "psychology", "business", "travel"
];

export function BooksPageContent() {
  const [mounted, setMounted] = useState(false);
  const [displayedBooks, setDisplayedBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [randomSeed, setRandomSeed] = useState<number>(0);
  const [topic, setTopic] = useState<string>("");
  const [apiOffset, setApiOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  // Get the display settings
  const { 
    viewMode, 
    changeViewMode,
    saveAsGlobalDefaults
  } = useDisplaySettings("books");
  
  // Initialize scroll restoration with page tracking
  const { updateCurrentPage, getCurrentPage } = useScrollRestoration({
    usePercentage: false,
    trackPage: true
  });
  
  // Simple seeded random number generator
  const seedRandom = (seed: number) => {
    return () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
  };
  
  // Select random topic based on seed
  const getRandomTopic = useCallback((seed: number) => {
    const random = seedRandom(seed);
    const index = Math.floor(random() * POPULAR_TOPICS.length);
    return POPULAR_TOPICS[index];
  }, []);
  
  // Load more books from API based on current topic
  const loadMoreBooks = useCallback(async () => {
    if (loading || !topic || !hasMore) return;
    
    setLoading(true);
    setIsError(false);
    
    try {
      const fetchedBooks = await searchBooks(topic, apiOffset);
      
      // Cache each book (ADD THIS LINE)
      fetchedBooks.forEach(book => saveBookToCache(book));
      
      // Filter out books already in library
      const filteredBooks = fetchedBooks.filter(book => !isBookInLibrary(book.id));
      
      // Add unique keys to avoid React key issues
      const uniqueBooks = filteredBooks.map((book, index) => {
        if (displayedBooks.some(existing => existing.id === book.id)) {
          return { ...book, id: `${book.id}-${apiOffset + index}` };
        }
        return book;
      });
      
      // Check if we've reached the end of results
      if (fetchedBooks.length === 0 || fetchedBooks.length < 20) {
        setHasMore(false);
        sessionStorage.setItem(BOOKS_HAS_MORE_KEY, "false");
      }
      
      // Update offset for next API call
      const newOffset = apiOffset + 20;
      setApiOffset(newOffset);
      sessionStorage.setItem(BOOKS_OFFSET_KEY, newOffset.toString());
      
      // Add new books to displayed books
      const updatedBooks = [...displayedBooks, ...uniqueBooks];
      setDisplayedBooks(updatedBooks);
      sessionStorage.setItem(BOOKS_DISPLAYED_KEY, JSON.stringify(updatedBooks));
      
      // Update pagination
      setPage(prevPage => prevPage + 1);
      updateCurrentPage(page + 1);
      
    } catch (error) {
      console.error("Error loading books:", error);
      setIsError(true);
    } finally {
      setLoading(false);
    }
  }, [loading, topic, apiOffset, displayedBooks, page, updateCurrentPage, hasMore]);
  
  // Handle refresh - force new randomization
  const handleRefresh = async () => {
    setIsRefreshing(true);
    
    // First, clear all state immediately
    setDisplayedBooks([]);
    setLoading(true);
    setIsError(false);
    setApiOffset(0);
    setHasMore(true);
    setPage(1);
    updateCurrentPage(1);
    
    // Reset scroll position
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
    }
    
    try {
      // Generate new seed and get topic directly
      const newSeed = Math.floor(Math.random() * 1000000);
      const newTopic = getRandomTopic(newSeed);
      
      // Clear session storage
      sessionStorage.removeItem(BOOKS_DISPLAYED_KEY);
      sessionStorage.removeItem(BOOKS_TOPIC_KEY);
      sessionStorage.removeItem(BOOKS_OFFSET_KEY);
      sessionStorage.removeItem(BOOKS_HAS_MORE_KEY);
      
      // Save new values
      sessionStorage.setItem(RANDOMIZATION_KEY, newSeed.toString());
      sessionStorage.setItem(BOOKS_TOPIC_KEY, newTopic);
      
      // Set the new seed and topic
      setRandomSeed(newSeed);
      setTopic(newTopic);
      
      // Directly fetch books instead of waiting for effects
      const fetchedBooks = await searchBooks(newTopic, 0);
      
      // Cache each book (ADD THIS LINE)
      fetchedBooks.forEach(book => saveBookToCache(book));
      
      // Process books
      const filteredBooks = fetchedBooks.filter(book => !isBookInLibrary(book.id));
      
      // Update has more state
      const reachedEnd = fetchedBooks.length === 0 || fetchedBooks.length < 20;
      setHasMore(!reachedEnd);
      sessionStorage.setItem(BOOKS_HAS_MORE_KEY, reachedEnd ? "false" : "true");
      
      // Update state with fetched books
      setApiOffset(20);
      sessionStorage.setItem(BOOKS_OFFSET_KEY, "20");
      
      setDisplayedBooks(filteredBooks);
      sessionStorage.setItem(BOOKS_DISPLAYED_KEY, JSON.stringify(filteredBooks));
      
    } catch (error) {
      console.error("Error during refresh:", error);
      setIsError(true);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };
  
  // Simplify initial setup effect
  useEffect(() => {
    setMounted(true);
    
    if (typeof window !== 'undefined') {
      // Check if this is browser refresh (we want to maintain state even on refresh)
      
      // Try to restore from session storage
      const storedSeed = sessionStorage.getItem(RANDOMIZATION_KEY);
      const storedTopic = sessionStorage.getItem(BOOKS_TOPIC_KEY);
      const storedDisplayedBooks = sessionStorage.getItem(BOOKS_DISPLAYED_KEY);
      
      // Only restore if we have the minimum required data
      if (storedSeed && storedTopic && storedDisplayedBooks) {
        try {
          const seed = parseInt(storedSeed, 10);
          const books = JSON.parse(storedDisplayedBooks);
          const offset = parseInt(sessionStorage.getItem(BOOKS_OFFSET_KEY) || "0", 10);
          const hasMoreBooks = sessionStorage.getItem(BOOKS_HAS_MORE_KEY) !== "false";
          
          // Set state in one go to avoid multiple renders
          setRandomSeed(seed);
          setTopic(storedTopic);
          setDisplayedBooks(books);
          setApiOffset(offset);
          setHasMore(hasMoreBooks); 
          setLoading(false);
        } catch (e) {
          console.error("Failed to restore previous session:", e);
          initializeNewSearch();
        }
      } else {
        // No stored state, start fresh
        initializeNewSearch();
      }
    }
  }, []);
  
  // Centralize initialization logic
  const initializeNewSearch = () => {
    const newSeed = Math.floor(Math.random() * 1000000);
    sessionStorage.setItem(RANDOMIZATION_KEY, newSeed.toString());
    
    setRandomSeed(newSeed);
    setApiOffset(0);
    setHasMore(true);
  };
  
  // Effect to get topic when seed changes and we have no topic
  useEffect(() => {
    if (!randomSeed || !mounted) return;
    
    if (!topic) {
      const selectedTopic = getRandomTopic(randomSeed);
      
      setTopic(selectedTopic);
      sessionStorage.setItem(BOOKS_TOPIC_KEY, selectedTopic);
    }
  }, [randomSeed, getRandomTopic, mounted, topic]);
  
  // Effect to load books when topic changes and we have no books
  useEffect(() => {
    if (!topic || !mounted) return;
    
    // Only load if:
    // 1. We have no books yet, OR
    // 2. Topic just changed (detected by displayedBooks not matching current topic)
    // AND we're not in refreshing mode
    if (displayedBooks.length === 0 && !isRefreshing) {
      loadMoreBooks();
    }
  }, [topic, mounted, displayedBooks.length, loadMoreBooks, isRefreshing]);
  
  // Use the infinite scroll hook
  const { sentinelRef } = useInfiniteScroll({
    loading,
    hasMore,
    onLoadMore: loadMoreBooks
  });
  
  // Handle view mode change
  const handleViewModeChange = (mode: typeof viewMode) => {
    changeViewMode(mode);
    saveAsGlobalDefaults();
  };
  
  // Avoid hydration mismatch
  if (!mounted) {
    return <div className="container mx-auto py-6 px-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center justify-between sm:justify-start sm:gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Explore Books: <span className="capitalize">{topic}</span>
          </h1>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="flex sm:hidden items-center gap-1"
            disabled={loading && displayedBooks.length === 0}
          >
            {loading && displayedBooks.length === 0 ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            <span className="sr-only sm:not-sr-only">Refresh</span>
          </Button>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh}
            className="hidden sm:flex items-center gap-1 cursor-pointer"
            disabled={loading && displayedBooks.length === 0}
          >
            {loading && displayedBooks.length === 0 ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <RefreshCw className="h-3.5 w-3.5" />
            )}
            <span>New Topic</span>
          </Button>
          <ViewModeToggle viewMode={viewMode} onChange={handleViewModeChange} />
        </div>
      </div>
      
      {/* Error state */}
      {isError && displayedBooks.length === 0 && (
        <div className="text-center py-8 mb-8">
          <p className="text-red-500">Failed to load books from OpenLibrary.</p>
          <Button 
            variant="secondary" 
            className="mt-4" 
            onClick={handleRefresh}
          >
            Try Again
          </Button>
        </div>
      )}
      
      {/* Book grid or list */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {displayedBooks.map((book, index) => (
            <BookCard
              key={`${book.id}-${index}`}
              book={book}
              hasContent={true}
              priority={index < 12}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {displayedBooks.map((book, index) => (
            <BookListItem
              key={`${book.id}-${index}`}
              book={book}
              hasContent={true}
              priority={index < 8}
            />
          ))}
        </div>
      )}
      
      {/* Empty state */}
      {displayedBooks.length === 0 && !loading && !isError && (
        <div className="text-center py-12 border rounded-lg">
          <p className="text-muted-foreground">No books found for this topic.</p>
        </div>
      )}
      
      {/* Loading indicator and sentinel element for infinite scroll */}
      <div 
        ref={sentinelRef}
        className="mt-8 py-4 text-center"
      >
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm text-muted-foreground">Loading more books...</span>
          </div>
        ) : hasMore && displayedBooks.length > 0 ? (
          <span className="text-sm text-muted-foreground">Scroll for more books</span>
        ) : displayedBooks.length > 0 ? (
          <span className="text-sm text-muted-foreground">You've seen all available books</span>
        ) : null}
      </div>

        {/* Add ScrollToTopButton */}
        <ScrollToTopButton/>
    </div>
  );
}