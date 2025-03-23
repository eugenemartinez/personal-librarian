import { updateReadingProgress, addBookToLibrary, updateBookStatus, getReadingStatus, isBookInLibrary, ReadingStatus } from './libraryUtils';

// Store page position and track highest page
interface PagePosition {
  highestPage: number;
  currentPage: number;
  totalPages: number;
  lastAccessed: string;
  resetTimestamp?: string; // To track when progress was reset
}

// Get the progress key for localStorage
const getProgressKey = (bookId: string) => `book_progress_${bookId}`;

/**
 * Calculate progress percentage in a standardized way
 */
export function calculateProgressPercentage(currentPage: number, totalPages: number): number {
  if (totalPages <= 0) return 0;
  return Math.min(Math.floor((currentPage / totalPages) * 100), 100);
}

// Get the page position data from localStorage
export function getPagePosition(bookId: string): PagePosition | null {
  if (typeof window === 'undefined') return null;

  try {
    const progressKey = getProgressKey(bookId);
    const positionData = localStorage.getItem(progressKey);
    if (!positionData) return null;
    return JSON.parse(positionData);
  } catch {
    return null;
  }
}

// Get reading progress directly from page position
export function getReaderProgress(bookId: string): number {
  const position = getPagePosition(bookId);
  if (!position) return 0;

  if (wasProgressReset(bookId, position) && isBookInLibrary(bookId)) {
    return 0;
  }

  if (wasProgressReset(bookId, position) && !isBookInLibrary(bookId) && position.highestPage > 0) {
    return calculateProgressPercentage(position.highestPage, position.totalPages);
  }

  return calculateProgressPercentage(position.highestPage, position.totalPages);
}

// Get the current page (last read position)
export function getCurrentPage(bookId: string): number {
  const position = getPagePosition(bookId);
  return position?.currentPage || 0;
}

// Get highest page reached
export function getHighestPage(bookId: string): number {
  const position = getPagePosition(bookId);
  if (!position) return 0;
  if (wasProgressReset(bookId, position)) return 0;
  return position.highestPage;
}

// Get total pages
export function getTotalPages(bookId: string): number {
  const position = getPagePosition(bookId);
  return position?.totalPages || 0;
}

// Check if reading progress was reset
export function wasProgressReset(bookId: string, position?: PagePosition | null): boolean {
  if (!position) position = getPagePosition(bookId);
  if (!position || !position.resetTimestamp) return false;
  if (!isBookInLibrary(bookId)) return false;
  return !!position.resetTimestamp;
}

// Calculate and save reading progress
export function updateReaderPosition(
  bookId: string,
  currentPage: number,
  totalPages: number
): void {
  if (typeof window === 'undefined') return;

  try {
    const progressKey = getProgressKey(bookId);
    let position = getPagePosition(bookId);
    const isInLibrary = isBookInLibrary(bookId);
    const currentStatus = isInLibrary ? getReadingStatus(bookId) : null;
    const progressWasReset = wasProgressReset(bookId, position);

    if (!position || progressWasReset) {
      position = {
        highestPage: currentPage,
        currentPage,
        totalPages,
        lastAccessed: new Date().toISOString()
      };
    } else {
      position.currentPage = currentPage;
      position.totalPages = totalPages;
      position.lastAccessed = new Date().toISOString();
      delete position.resetTimestamp;

      if (currentPage > position.highestPage && 
          !(currentStatus === "reading" && position.highestPage >= position.totalPages)) {
        position.highestPage = currentPage;
      }
    }

    localStorage.setItem(progressKey, JSON.stringify(position));

    if (isInLibrary) {
      const isReadingAgain = currentStatus === "reading" && position.highestPage >= position.totalPages;
      const progressPage = isReadingAgain ? currentPage : position.highestPage;
      const progressPercentage = calculateProgressPercentage(progressPage, totalPages);
      const cappedProgress = Math.min(progressPercentage, 100);

      if (currentPage >= totalPages || cappedProgress >= 100) {
        updateBookStatus(bookId, "completed");
      } else if (cappedProgress > 0) {
        updateBookStatus(bookId, "reading");
        updateReadingProgress(bookId, cappedProgress);
      }
    }
  } catch {}
}

// Mark a book as completed
export function markBookAsCompleted(bookId: string): void {
  try {
    const position = getPagePosition(bookId);
    const totalPages = position?.totalPages || 100;

    if (position) {
      position.highestPage = totalPages;
      position.currentPage = totalPages;
      position.lastAccessed = new Date().toISOString();
      localStorage.setItem(getProgressKey(bookId), JSON.stringify(position));
    }

    updateBookStatus(bookId, "completed");
    updateReadingProgress(bookId, 100);
  } catch {}
}

// Reset reading progress
export function resetReadingProgress(
  bookId: string, 
  onReset?: (bookId: string, status: ReadingStatus | null, progress: number) => void
): void {
  if (typeof window === 'undefined') return;

  try {
    const progressKey = getProgressKey(bookId);
    const position = getPagePosition(bookId);
    const isInLib = isBookInLibrary(bookId);

    if (position) {
      const newPosition: PagePosition = {
        highestPage: 0,
        currentPage: 0,
        totalPages: position.totalPages,
        lastAccessed: new Date().toISOString(),
        resetTimestamp: new Date().toISOString()
      };

      localStorage.setItem(progressKey, JSON.stringify(newPosition));

      if (isInLib) {
        updateBookStatus(bookId, "to-read", true);
        updateReadingProgress(bookId, 0);
      }

      if (onReset) {
        onReset(bookId, isInLib ? "to-read" : null, 0);
      }
    }
  } catch {}
}

// Get the highest page reached
export function getHighestPageReached(bookId: string, totalPages: number): number {
  const position = getPagePosition(bookId);
  if (!position) return 0;
  if (wasProgressReset(bookId, position)) return 0;
  return Math.min(position.highestPage, totalPages);
}

// Backwards compatibility with old functions
export function saveHighestPage(bookId: string, currentPage: number, totalPages: number): void {
  updateReaderPosition(bookId, currentPage, totalPages);
}

export function trackReadingProgress(bookId: string, currentPage: number, totalPages: number): void {
  updateReaderPosition(bookId, currentPage, totalPages);
}

// Start reading again
export function startReadAgain(bookId: string, setAsToRead: boolean = false): void {
  if (typeof window === 'undefined') return;

  try {
    const progressKey = getProgressKey(bookId);
    const position = getPagePosition(bookId);

    if (position) {
      const newPosition: PagePosition = {
        highestPage: 0,
        currentPage: 0,
        totalPages: position.totalPages,
        lastAccessed: new Date().toISOString(),
        resetTimestamp: new Date().toISOString()
      };

      localStorage.setItem(progressKey, JSON.stringify(newPosition));
    }

    const newStatus = setAsToRead ? "to-read" : "reading";
    updateBookStatus(bookId, newStatus, true);
    updateReadingProgress(bookId, 0);
  } catch {}
}

// Update scroll progress
function updateScrollProgress(scrollTop: number, scrollHeight: number, clientHeight: number) {
  const scrollableHeight = Math.max(0, scrollHeight - clientHeight);

  if (scrollableHeight === 0) {
    return scrollHeight > 0 ? 100 : 0;
  }

  return Math.min(100, Math.max(0, Math.floor((scrollTop / scrollableHeight) * 100)));
}

// Check if a book has any reading progress
export function hasReadingProgress(bookId: string): boolean {
  const progress = getReaderProgress(bookId);
  return progress > 0;
}

// Get reading progress regardless of library status
export function getBookProgress(bookId: string): {
  progress: number;
  currentPage: number;
  totalPages: number;
  isInLibrary: boolean;
} {
  const progress = getReaderProgress(bookId);
  const currentPage = getCurrentPage(bookId);
  const totalPages = getTotalPages(bookId);
  const isInLibrary = isBookInLibrary(bookId);

  return {
    progress,
    currentPage,
    totalPages,
    isInLibrary
  };
}
