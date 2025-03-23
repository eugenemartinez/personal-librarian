"use client";

import { useState, useEffect, useCallback, useRef } from "react";

interface UseInfiniteScrollOptions {
  loading: boolean; // Whether data is currently being loaded
  hasMore: boolean; // Whether there is more data to load
  onLoadMore: () => void; // Callback to load more data
  rootMargin?: string; // Margin around the root for triggering the observer
}

/**
 * Custom hook for infinite scrolling using IntersectionObserver.
 */
export function useInfiniteScroll({
  loading,
  hasMore,
  onLoadMore,
  rootMargin = "0px 0px 300px 0px", // Trigger loading 300px before reaching the bottom
}: UseInfiniteScrollOptions) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [sentinel, setSentinel] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    // Disconnect the previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Create a new IntersectionObserver
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasMore && !loading) {
          onLoadMore(); // Trigger the callback when conditions are met
        }
      },
      { rootMargin }
    );

    const currentObserver = observerRef.current;

    // Observe the sentinel element
    if (sentinel) {
      currentObserver.observe(sentinel);
    }

    // Cleanup the observer on unmount or dependency change
    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, [sentinel, loading, hasMore, onLoadMore, rootMargin]);

  // Ref callback for the sentinel element
  const sentinelRef = useCallback((node: HTMLDivElement | null) => {
    setSentinel(node);
  }, []);

  return { sentinelRef };
}