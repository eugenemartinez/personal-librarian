"use client";

import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowUp } from 'lucide-react';

interface ScrollFooterProps {
  scrollProgress: number;
  onScrollToTop: () => void;
  onMarkComplete?: () => void;
}

export function ScrollFooter({
  scrollProgress,
  onScrollToTop,
  onMarkComplete
}: ScrollFooterProps) {
  // Round the scroll progress to a whole number
  const displayProgress = Math.round(scrollProgress);

  return (
    <footer className="border-t border-border py-3 px-4 flex items-center justify-between bg-background sticky bottom-0 z-10">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onScrollToTop}
          className="flex items-center gap-1"
        >
          <ArrowUp className="h-4 w-4" />
          Back to top
        </Button>
      </div>

      <div>
        <span className="text-sm font-medium">{displayProgress}% complete</span>
      </div>

      {displayProgress > 75 && onMarkComplete && (
        <Button
          variant="secondary"
          size="sm"
          onClick={onMarkComplete}
          className="flex items-center gap-1"
        >
          <CheckCircle className="h-4 w-4" />
          Complete
        </Button>
      )}
    </footer>
  );
}