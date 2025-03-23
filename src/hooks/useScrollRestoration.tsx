"use client";

import { useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";

export function useScrollRestoration(options?: {
  usePercentage?: boolean; // Save position as a percentage of total scroll height
  trackPage?: boolean; // Track which "page" of content the user was viewing
}) {
  const pathname = usePathname();
  const savedPosition = useRef(0);
  const savedPage = useRef(1);
  const isRestored = useRef(false);
  const { usePercentage = false, trackPage = false } = options || {};

  // Save the current scroll position
  const saveScrollPosition = useCallback(() => {
    if (typeof window === "undefined") return;

    const routeKey = `scroll_${pathname}`;
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight;
    const windowHeight = window.innerHeight;

    if (usePercentage) {
      const scrollPercent = (scrollTop / (scrollHeight - windowHeight)) * 100;
      if (scrollPercent > 0) {
        sessionStorage.setItem(routeKey, String(scrollPercent));
      }
    } else {
      if (scrollTop > 0) {
        sessionStorage.setItem(routeKey, String(scrollTop));
      }
    }

    if (trackPage) {
      const pageKey = `page_${pathname}`;
      sessionStorage.setItem(pageKey, String(savedPage.current));
    }
  }, [pathname, usePercentage, trackPage]);

  // Update the current page number
  const updateCurrentPage = useCallback(
    (page: number) => {
      savedPage.current = page;

      if (trackPage && typeof window !== "undefined") {
        const pageKey = `page_${pathname}`;
        sessionStorage.setItem(pageKey, String(page));
      }
    },
    [pathname, trackPage]
  );

  // Get the current tracked page number
  const getCurrentPage = useCallback((): number => {
    if (!trackPage || typeof window === "undefined") return 1;

    const pageKey = `page_${pathname}`;
    const savedPageString = sessionStorage.getItem(pageKey);
    return savedPageString ? parseInt(savedPageString, 10) : 1;
  }, [pathname, trackPage]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const routeKey = `scroll_${pathname}`;

    // Restore scroll position on mount
    if (!isRestored.current) {
      const savedScrollString = sessionStorage.getItem(routeKey);

      if (savedScrollString) {
        const applyScroll = () => {
          const scrollHeight = document.documentElement.scrollHeight;
          const windowHeight = window.innerHeight;

          if (usePercentage) {
            const scrollPercent = parseFloat(savedScrollString);
            const targetScroll = ((scrollHeight - windowHeight) * scrollPercent) / 100;
            window.scrollTo(0, targetScroll);
          } else {
            const savedScroll = parseInt(savedScrollString, 10);
            window.scrollTo(0, savedScroll);
          }

          isRestored.current = true;
        };

        setTimeout(() => {
          requestAnimationFrame(applyScroll);
        }, 100);
      }

      if (trackPage) {
        const pageKey = `page_${pathname}`;
        const pageString = sessionStorage.getItem(pageKey);
        if (pageString) {
          savedPage.current = parseInt(pageString, 10);
        }
      }
    }

    // Throttle scroll events for performance
    let timeoutId: NodeJS.Timeout | null = null;
    const throttledScroll = () => {
      if (timeoutId === null) {
        timeoutId = setTimeout(() => {
          saveScrollPosition();
          timeoutId = null;
        }, 200);
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledScroll);
      saveScrollPosition(); // Save final position before unmounting
    };
  }, [pathname, saveScrollPosition, usePercentage, trackPage]);

  return {
    saveScrollPosition,
    updateCurrentPage,
    getCurrentPage,
  };
}