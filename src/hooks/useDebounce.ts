"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to debounce a value.
 * Delays updating the value until after the specified delay.
 *
 * @param value - The value to debounce
 * @param delay - The debounce delay in milliseconds
 * @returns The debounced value
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer); // Cleanup the timeout on value or delay change
    };
  }, [value, delay]);

  return debouncedValue;
}