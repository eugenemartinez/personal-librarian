import { getLocalStorage, setLocalStorage } from "./localStorage";
import type { Book } from "@/data/books";

// Storage key for reading history
const READING_HISTORY_KEY = "reading-history";

export interface ReadingHistoryEntry {
  bookId: string;
  title: string;
  author?: string;
  coverUrl?: string;
  lastReadAt: number; // timestamp
  percentComplete?: number; // 0-100
}

/**
 * Check if reading history is enabled in user settings
 */
export function isReadingHistoryEnabled(): boolean {
  const userSettings = getLocalStorage<Record<string, any>>("userSettings", {});
  return userSettings.enableReadHistory !== false; // Default to true if not set
}

/**
 * Add or update a book in reading history
 */
export function recordBookReading(
  book: { id: string; title: string; author?: string; coverImage?: string }, 
  percentComplete?: number
): void {
  if (!isReadingHistoryEnabled()) return;
  
  const history = getReadingHistory();
  
  const entry: ReadingHistoryEntry = {
    bookId: book.id,
    title: book.title,
    author: book.author,
    coverUrl: book.coverImage,
    lastReadAt: Date.now(),
    percentComplete: percentComplete ?? undefined
  };
  
  const existingIndex = history.findIndex(item => item.bookId === book.id);
  
  if (existingIndex >= 0) {
    history[existingIndex] = entry;
  } else {
    history.push(entry);
  }
  
  setLocalStorage(READING_HISTORY_KEY, history);
}

/**
 * Get complete reading history
 */
export function getReadingHistory(): ReadingHistoryEntry[] {
  return getLocalStorage<ReadingHistoryEntry[]>(READING_HISTORY_KEY, []);
}

/**
 * Get reading history sorted by most recent
 */
export function getRecentReadingHistory(limit?: number): ReadingHistoryEntry[] {
  const history = getReadingHistory();
  const sortedHistory = [...history].sort((a, b) => b.lastReadAt - a.lastReadAt);
  return limit ? sortedHistory.slice(0, limit) : sortedHistory;
}

/**
 * Clear reading history
 */
export function clearReadingHistory(): void {
  setLocalStorage(READING_HISTORY_KEY, []);
}

/**
 * Remove a specific book from reading history
 */
export function removeFromReadingHistory(bookId: string): void {
  const history = getReadingHistory();
  const updatedHistory = history.filter(item => item.bookId !== bookId);
  setLocalStorage(READING_HISTORY_KEY, updatedHistory);
}