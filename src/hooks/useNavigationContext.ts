"use client";

import { useRouter, usePathname } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { getNavigationContext, setNavigationContext } from "@/utils/localStorage";

/**
 * Custom hook to manage navigation context.
 * Stores the current page context in localStorage and provides utilities for navigation.
 */
export function useNavigationContext() {
  const router = useRouter();
  const pathname = usePathname();

  // Store context in state for reactivity
  const [currentContext, setCurrentContext] = useState<string>("/books");

  // Load and update context
  useEffect(() => {
    // Load the context from localStorage
    const storedContext = getNavigationContext();
    setCurrentContext(storedContext);

    // Store the current path as context if on a relevant page
    if (
      pathname === "/library" ||
      pathname === "/books" ||
      pathname.startsWith("/search")
    ) {
      setNavigationContext(pathname);
      setCurrentContext(pathname);
    }
  }, [pathname]);

  /**
   * Navigate to a book while storing the current context.
   */
  const navigateToBook = useCallback(
    (bookId: string) => {
      setNavigationContext(pathname);
      setCurrentContext(pathname);
      router.push(`/books/${bookId}`);
    },
    [pathname, router]
  );

  /**
   * Get the stored navigation context (where to go back to).
   */
  const getReturnPath = useCallback((): string => {
    return getNavigationContext();
  }, []);

  /**
   * Navigate back to the stored context.
   */
  const returnToContext = useCallback(() => {
    const returnPath = getReturnPath();
    router.push(returnPath);
  }, [getReturnPath, router]);

  return {
    navigateToBook,
    getReturnPath,
    returnToContext,
    currentContext,
  };
}