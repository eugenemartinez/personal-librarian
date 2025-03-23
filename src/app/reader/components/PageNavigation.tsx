"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PageNavigationProps {
  currentPage: number;
  totalPages: number;
  onJumpToPage: (pageIndex: number) => void;
}

export function PageNavigation({ 
  currentPage, 
  totalPages, 
  onJumpToPage 
}: PageNavigationProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [goToPageInput, setGoToPageInput] = useState((currentPage + 1).toString());
  
  // Update input when currentPage changes
  useEffect(() => {
    setGoToPageInput((currentPage + 1).toString());
  }, [currentPage]);
  
  // Handle page navigation
  const handleGoToPage = () => {
    // Convert the input to a number
    const numValue = parseInt(goToPageInput, 10);
    
    // Check if it's a valid page number
    if (isNaN(numValue) || numValue < 1 || numValue > totalPages) {
      // If invalid, reset to current page
      setGoToPageInput((currentPage + 1).toString());
      return;
    }
    
    // Convert from 1-based (UI) to 0-based (internal)
    const pageIndex = numValue - 1;
    
    // Close dialog
    setIsDialogOpen(false);
    
    // Navigate to the page if different from current
    if (pageIndex !== currentPage) {
      onJumpToPage(pageIndex);
    }
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Allow empty input for easier editing
    setGoToPageInput(e.target.value);
  };

  // When dialog opens, select all text for easy replacement
  const handleDialogOpen = (open: boolean) => {
    setIsDialogOpen(open);
    if (open) {
      // Use setTimeout to ensure the input is rendered before selecting
      setTimeout(() => {
        const input = document.getElementById('page-input') as HTMLInputElement;
        if (input) {
          input.focus();
          input.select();
        }
      }, 50);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={handleDialogOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-sm px-4 hover:bg-secondary"
          title="Go to specific page"
        >
          <span className="font-medium">{currentPage + 1}</span>
          <span className="text-muted-foreground mx-1">/</span>
          <span>{totalPages}</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle>Go to page</DialogTitle>
          <DialogDescription>
            Enter a page number between 1 and {totalPages}
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-center gap-4 py-4">
          <div className="flex items-center gap-3">
            <Input 
              id="page-input"
              type="text" 
              inputMode="numeric"
              pattern="[0-9]*"
              value={goToPageInput}
              onChange={handleInputChange}
              onKeyDown={(e) => e.key === 'Enter' && handleGoToPage()}
              className="w-20"
              autoFocus
            />
            <span className="text-sm text-muted-foreground">of {totalPages}</span>
          </div>
          <Button 
            onClick={handleGoToPage}
            disabled={
              isNaN(parseInt(goToPageInput, 10)) || 
              parseInt(goToPageInput, 10) < 1 || 
              parseInt(goToPageInput, 10) > totalPages
            }
          >
            Go
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}