"use client";

import { ArrowLeft, Link as LinkIcon, Download, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useState, useEffect, useCallback } from 'react';
import { getNavigationContext, getContextSectionName } from "@/utils/localStorage";
import { toast } from 'sonner';
import { bookExists, downloadBook, deleteDownloadedBook } from '@/utils/indexedDb';
import { useRouter } from 'next/navigation';
import { isBookInLibrary } from '@/utils/libraryUtils';

interface BookDetailsHeaderProps {
  bookId: string;
  bookTitle: string;
  hasContent: boolean;
  readUrl?: string | null;  // Add this prop
}

export function BookDetailsHeader({ 
  bookId, 
  bookTitle, 
  hasContent,
  readUrl  // Include it in destructuring
}: BookDetailsHeaderProps) {
  const [mounted, setMounted] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isInLibrary, setIsInLibrary] = useState(false);
  const router = useRouter();

  // Create a reusable function to check statuses
  const checkStatuses = useCallback(async () => {
    if (typeof window !== 'undefined') {
      const exists = await bookExists(bookId);
      setIsDownloaded(exists);
      setIsInLibrary(isBookInLibrary(bookId));
    }
  }, [bookId]);
  
  // Initial check on mount
  useEffect(() => {
    setMounted(true);
    checkStatuses();
    
    // Set up event listener for storage changes
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'userLibrary' || event.key === null) {
        checkStatuses();
      }
    };
    
    // Set up event listener for focus
    const handleFocus = () => {
      checkStatuses();
    };
    
    // Add event listeners
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('focus', handleFocus);
    
    // Set up polling for changes every 2 seconds
    const intervalId = setInterval(checkStatuses, 2000);
    
    // Clean up
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
      clearInterval(intervalId);
    };
  }, [checkStatuses]);

  useEffect(() => {
    if (mounted) {
      const context = getNavigationContext();
    }
  }, [mounted]);

  // Get context-aware return path and label
  const returnPath = mounted ? getNavigationContext() : "/books";
  const returnLabel = mounted ? `Back to ${getContextSectionName()}` : "Back";

  // Handle copying URL to clipboard
  const handleCopyUrl = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard", {
        description: "You can now share this link with others"
      });
    }
  };
  
  // Handle downloading book for offline reading
  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      
      // Show progress toast
      toast.promise(
        downloadBook(bookId, bookTitle),
        {
          loading: 'Downloading book for offline reading...',
          success: () => {
            setIsDownloaded(true);
            return 'Book downloaded successfully! Now available offline.';
          },
          error: 'Download failed. Please try again.'
        }
      );
      
      const success = await downloadBook(bookId, bookTitle);
      
      if (success) {
        setIsDownloaded(true);
      }
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed', {
        description: 'There was an error downloading this book for offline reading.'
      });
    } finally {
      setIsDownloading(false);
    }
  };
  
  // Handle removing offline version of the book
  const handleDeleteDownload = async () => {
    try {
      setIsDeleting(true);
      
      toast.promise(
        deleteDownloadedBook(bookId),
        {
          loading: 'Removing offline version...',
          success: () => {
            setIsDownloaded(false);
            return 'Offline version removed';
          },
          error: 'Failed to remove offline version'
        }
      );
      
      await deleteDownloadedBook(bookId);
      setIsDownloaded(false);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle reading the book now
  const handleReadNow = () => {
    if (readUrl) {
      window.open(readUrl, '_blank');
    } else {
      // Fallback behavior
      router.push(`/reader/${bookId}`);
    }
  };

  return (
    <div className="flex justify-between items-center mb-6">
      {/* Back Button - Arrow only on mobile, text+arrow on tablet+ */}
      <Button 
        asChild 
        variant="ghost" 
        size="sm" 
        className="flex items-center gap-1"
      >
        <Link href={returnPath}>
          <ArrowLeft className="h-4 w-4" />
          <span className="hidden sm:inline">{returnLabel}</span>
        </Link>
      </Button>
      
      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1"
          onClick={handleCopyUrl}
        >
          <LinkIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Copy Link</span>
        </Button>
        
        {/* Only show Download/Delete button if the book has content AND is in library */}
        {hasContent && isInLibrary && (
          isDownloaded ? (
            <Button 
              size="sm" 
              variant="outline"
              className="flex items-center gap-1 text-muted-foreground hover:text-destructive" 
              onClick={handleDeleteDownload}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isDeleting ? "Removing..." : "Remove Offline"}
              </span>
            </Button>
          ) : (
            <Button 
              size="sm" 
              variant="outline"
              className="flex items-center gap-1"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isDownloading ? "Downloading..." : "Download Offline"}
              </span>
            </Button>
          )
        )}
      </div>
    </div>
  );
}