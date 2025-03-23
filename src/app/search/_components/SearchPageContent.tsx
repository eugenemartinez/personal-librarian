"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search as SearchIcon, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BookCard } from '../../books/_components/BookCard';
import { BookListItem } from '../../books/_components/BookListItem';
import { ViewModeToggle } from '@/components/ui/view-mode-toggle';
import { ScrollToTopButton } from '@/components/ui/ScrollToTopButton'; // Import the ScrollToTopButton
import { useDisplaySettings } from '@/hooks/useDisplaySettings';
import { setNavigationContext } from '@/utils/localStorage';
import { useScrollRestoration } from '@/hooks/useScrollRestoration';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useDebounce } from '@/hooks/useDebounce';
import { useBooks } from '@/hooks/useBooksApi';

// Number of books to load per page
const BOOKS_PER_PAGE = 12;

// Key for storing search term
const SEARCH_TERM_KEY = 'lastSearchTerm';

// Debounce delay in ms
const DEBOUNCE_DELAY = 300;

// Add these keys for storing search state
const SEARCH_RESULTS_KEY = 'lastSearchResults';
const SEARCH_DISPLAYED_BOOKS_KEY = 'lastSearchDisplayedBooks';
const SEARCH_PAGE_KEY = 'lastSearchPage';
const SEARCH_HAS_MORE_KEY = 'lastSearchHasMore';

export default function SearchPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Get initial search term from URL or sessionStorage
  const initialSearchTerm = searchParams.get('q') || 
    (typeof window !== 'undefined' ? sessionStorage.getItem(SEARCH_TERM_KEY) || '' : '');
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  
  // Add debounced search term to prevent too many API calls during typing
  const debouncedSearchTerm = useDebounce(searchTerm, DEBOUNCE_DELAY);
  
  // Use the API hook instead of mock data
  const { books: allBooks, loading: apiLoading, error } = useBooks(debouncedSearchTerm);
  
  // State to hold displayed results
  const [displayedBooks, setDisplayedBooks] = useState(allBooks.slice(0, BOOKS_PER_PAGE));
  
  // Initialize scroll restoration with page tracking
  const { updateCurrentPage, getCurrentPage } = useScrollRestoration({
    usePercentage: true,
    trackPage: true
  });
  
  // Get the display settings
  const { 
    viewMode, 
    changeViewMode,
    saveAsGlobalDefaults
  } = useDisplaySettings("search");
  
  // Load more books function for infinite scroll
  const loadMoreBooks = useCallback(() => {
    if (apiLoading || !debouncedSearchTerm) return;
    
    // Calculate indices for pagination
    const startIndex = (page - 1) * BOOKS_PER_PAGE;
    const endIndex = page * BOOKS_PER_PAGE;
    const newBooks = allBooks.slice(startIndex, endIndex);
    
    setDisplayedBooks(prev => [...prev, ...newBooks]);
    setPage(prevPage => prevPage + 1);
    updateCurrentPage(page + 1);
    
    // Check if we've reached the end of the results
    if (endIndex >= allBooks.length) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, [page, apiLoading, allBooks, updateCurrentPage, debouncedSearchTerm]);
  
  // Initialize infinite scroll with a stable reference
  const infiniteScrollOptions = useMemo(() => ({
    loading: apiLoading,
    hasMore: hasMore && displayedBooks.length < allBooks.length,
    onLoadMore: loadMoreBooks
  }), [apiLoading, hasMore, displayedBooks.length, allBooks.length, loadMoreBooks]);
  
  const { sentinelRef } = useInfiniteScroll(infiniteScrollOptions);
  
  // Load initial books function - separated from the effect
  const loadInitialBooks = useCallback((savedPage: number, currentBooks: typeof allBooks) => {
    // Load all pages up to the saved page
    const booksToLoad = [];
    const pagesCount = Math.min(savedPage, Math.ceil(currentBooks.length / BOOKS_PER_PAGE));
    
    for (let i = 1; i <= pagesCount; i++) {
      const startIndex = (i - 1) * BOOKS_PER_PAGE;
      const endIndex = i * BOOKS_PER_PAGE;
      booksToLoad.push(...currentBooks.slice(startIndex, endIndex));
    }
    
    setDisplayedBooks(booksToLoad);
    setPage(pagesCount + 1);
    
    // Check if we've reached the end
    if (pagesCount * BOOKS_PER_PAGE >= currentBooks.length) {
      setHasMore(false);
    } else {
      setHasMore(true);
    }
  }, []);
  
  // Set mounted state and restore search term and results
  useEffect(() => {
    setMounted(true);
    
    // If there's a search term in URL, update sessionStorage
    if (searchParams.get('q')) {
      sessionStorage.setItem(SEARCH_TERM_KEY, searchParams.get('q') || '');
    }
    
    // Try to restore previous search state from session storage
    if (typeof window !== 'undefined') {
      const storedResults = sessionStorage.getItem(SEARCH_RESULTS_KEY);
      const storedDisplayed = sessionStorage.getItem(SEARCH_DISPLAYED_BOOKS_KEY);
      const storedPage = sessionStorage.getItem(SEARCH_PAGE_KEY);
      const storedHasMore = sessionStorage.getItem(SEARCH_HAS_MORE_KEY);
      
      // Only restore if we have stored results and the search term matches
      if (storedResults && storedDisplayed && storedPage && debouncedSearchTerm) {
        try {
          const parsedResults = JSON.parse(storedResults);
          const parsedDisplayed = JSON.parse(storedDisplayed);
          const parsedPage = parseInt(storedPage, 10);
          const parsedHasMore = storedHasMore === 'true';
          
          // Override the default states with stored values
          // We'll do this in a way that doesn't conflict with the useBooks hook
          if (Array.isArray(parsedResults) && Array.isArray(parsedDisplayed)) {
            // Use a ref to avoid refetching
            setDisplayedBooks(parsedDisplayed);
            setPage(parsedPage);
            setHasMore(parsedHasMore);
          }
        } catch (e) {
          console.error("Failed to parse stored search state:", e);
        }
      }
    }
  }, [searchParams, debouncedSearchTerm]);

  // Handle initial book loading when books data changes
  useEffect(() => {
    if (!mounted || apiLoading) return;
    
    // Get saved page from scroll restoration
    const savedPage = getCurrentPage();
    
    // Reset displayed books when search term changes
    setDisplayedBooks([]);
    setPage(1);
    setHasMore(true);
    
    // Load initial books based on saved page
    loadInitialBooks(savedPage, allBooks);
  }, [mounted, allBooks, apiLoading, getCurrentPage, loadInitialBooks]);
  
  // Save search state whenever it changes
  useEffect(() => {
    if (!mounted) return;
    
    // Store the current search state in sessionStorage
    if (typeof window !== 'undefined' && debouncedSearchTerm && allBooks.length > 0) {
      sessionStorage.setItem(SEARCH_RESULTS_KEY, JSON.stringify(allBooks));
      sessionStorage.setItem(SEARCH_DISPLAYED_BOOKS_KEY, JSON.stringify(displayedBooks));
      sessionStorage.setItem(SEARCH_PAGE_KEY, page.toString());
      sessionStorage.setItem(SEARCH_HAS_MORE_KEY, hasMore.toString());
    }
  }, [mounted, allBooks, displayedBooks, page, hasMore, debouncedSearchTerm]);

  // Update search term and URL
  const handleSearchChange = useCallback((term: string) => {
    setSearchTerm(term);
    
    // Reset pagination when search changes
    setPage(1);
    setDisplayedBooks([]);
    
    // Save to sessionStorage
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SEARCH_TERM_KEY, term);
      
      // Clear previous search results when search term changes
      if (term !== searchTerm) {
        sessionStorage.removeItem(SEARCH_RESULTS_KEY);
        sessionStorage.removeItem(SEARCH_DISPLAYED_BOOKS_KEY);
        sessionStorage.removeItem(SEARCH_PAGE_KEY);
        sessionStorage.removeItem(SEARCH_HAS_MORE_KEY);
      }
      
      // Update URL without page reload - but only if there's a term
      if (term) {
        const newUrl = `/search?q=${encodeURIComponent(term)}`;
        window.history.replaceState({}, '', newUrl);
      } else {
        window.history.replaceState({}, '', '/search');
      }
      
      // Reset scroll position when search changes
      window.scrollTo(0, 0);
      updateCurrentPage(1);
    }
  }, [searchTerm, updateCurrentPage]);
  
  // Custom handler for book clicks
  const handleBookClick = useCallback((bookId: string) => {
    // Set navigation context to search before navigating
    setNavigationContext("/search");
    
    // Navigate to book details page
    router.push(`/books/${bookId}`);
  }, [router]);
  
  // Handle view mode change
  const handleViewModeChange = useCallback((mode: typeof viewMode) => {
    changeViewMode(mode);
    saveAsGlobalDefaults();
  }, [changeViewMode, saveAsGlobalDefaults]);

  // Avoid hydration mismatch
  if (!mounted) {
    return <div className="container mx-auto py-6 px-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-0 text-foreground">Search Books</h1>
        
        <div className="flex items-center gap-2">
          <ViewModeToggle viewMode={viewMode} onChange={handleViewModeChange} />
        </div>
      </div>
      
      <div className="relative mb-6 sm:mb-8 max-w-2xl mx-auto">
        <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4 sm:h-5 sm:w-5" />
        <Input
          type="text"
          placeholder="Search by title, author, or category..."
          className="pl-10 pr-10 text-foreground"
          value={searchTerm}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        {searchTerm && (
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8"
            onClick={() => handleSearchChange('')}
            aria-label="Clear search"
          >
            <X className="h-4 w-4 text-muted-foreground" />
          </Button>
        )}
      </div>
      
      {/* Error state */}
      {error && (
        <div className="text-center py-12">
          <p className="text-red-500">Failed to load books. Please try again later.</p>
        </div>
      )}
      
      {/* Empty state when no search term */}
      {!debouncedSearchTerm && !error ? (
        <div className="text-center py-16">
          <SearchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h2 className="text-xl font-medium text-foreground mb-2">Search for books</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Enter a search term above to find books by title, author, or category.
          </p>
        </div>
      ) : (
        !error && <>
          {/* Results count - only show when search is performed */}
          <div className="mb-4 sm:mb-6 text-sm text-muted-foreground">
            Found {allBooks.length} {allBooks.length === 1 ? 'result' : 'results'}
            {debouncedSearchTerm && ` for "${debouncedSearchTerm}"`}
          </div>
          
          {/* Display books or no results message */}
          {allBooks.length === 0 && !apiLoading ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No books found matching your search.</p>
              <p className="text-sm text-muted-foreground mt-2">Try using different keywords or browse our collection.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {displayedBooks.map((book) => (
                <BookCard 
                  key={book.id}
                  book={book}
                  hasContent={true} // Updated: All books now have mock content available
                  isSearch={true}   
                  priority={false}
                  onClick={() => handleBookClick(book.id)}
                />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {displayedBooks.map((book) => (
                <BookListItem
                  key={book.id}
                  book={book}
                  hasContent={true} // Updated: All books now have mock content available
                  isSearch={true}   
                  priority={false}
                  onClick={() => handleBookClick(book.id)}
                />
              ))}
            </div>
          )}
          
          {/* Loading indicator and sentinel */}
          <div 
            ref={sentinelRef}
            className="mt-8 py-4 text-center"
          >
            {apiLoading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="text-sm text-muted-foreground">Loading results...</span>
              </div>
            ) : hasMore ? (
              <span className="text-sm text-muted-foreground">Scroll for more results</span>
            ) : (
              <span className="text-sm text-muted-foreground">End of search results</span>
            )}
          </div>
        </>
      )}
      {/* Add ScrollToTopButton */}
      <ScrollToTopButton/>
    </div>
  );
}