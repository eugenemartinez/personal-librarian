"use client";

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { PageNavigation } from './PageNavigation';

interface ReaderFooterProps {
  currentPage: number;
  totalPages: number;
  onPrevPage: () => void;
  onNextPage: () => void;
  onJumpToPage?: (pageIndex: number) => void;
  isLastPage?: boolean;
  onMarkComplete?: () => void;
}

export function ReaderFooter({ 
  currentPage, 
  totalPages, 
  onPrevPage, 
  onNextPage,
  onJumpToPage,
  isLastPage,
  onMarkComplete
}: ReaderFooterProps) {
  // Handle jumps if direct jump isn't available
  const handleJumpToPage = (pageIndex: number) => {
    if (onJumpToPage) {
      // Use direct jump if available
      onJumpToPage(pageIndex);
    } else {
      // Fallback to incremental navigation (not ideal)
      console.warn("Direct page jumping not available, using incremental navigation");
      if (pageIndex < currentPage) {
        for (let i = 0; i < currentPage - pageIndex; i++) {
          onPrevPage();
        }
      } else {
        for (let i = 0; i < pageIndex - currentPage; i++) {
          onNextPage();
        }
      }
    }
  };

  return (
    <footer className="border-t border-border py-3 px-4 flex items-center justify-between bg-background sticky bottom-0 z-10">
      <div className="w-24">
        <Button 
          onClick={onPrevPage} 
          disabled={currentPage === 0} 
          variant="ghost"
          className="w-full"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>
      </div>
      
      <PageNavigation 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onJumpToPage={handleJumpToPage} 
      />
      
      <div className="w-24">
        <Button
          variant={isLastPage ? "secondary" : "default"}
          onClick={isLastPage && onMarkComplete ? onMarkComplete : onNextPage}
          disabled={isLastPage && !onMarkComplete}
          className="w-full"
        >
          {isLastPage ? "Finish" : "Next"}
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </footer>
  );
}