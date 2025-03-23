import { Button } from '@/components/ui/button';
import { ReadingStatus } from '@/utils/libraryUtils';
import { Book } from '@/data/books';
import { BookOpenCheck, BookOpen, BookMarked, X, MoreHorizontal, RefreshCw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { MouseEvent } from 'react';
import { startReadAgain } from '@/utils/readerProgress';
import { toast } from 'sonner'; // Add this import

interface BookActionsMenuProps {
  book: Book;
  currentStatus: ReadingStatus;
  hasContent: boolean;
  onStatusChange: (status: ReadingStatus) => void;
  onReadNow: (e: MouseEvent) => void;
  onRemove: (e: MouseEvent) => void;
}

export function BookActionsMenu({ 
  book,
  currentStatus,
  hasContent,
  onStatusChange,
  onReadNow,
  onRemove
}: BookActionsMenuProps) {
  // Helper function to get status icon
  const getStatusIcon = (status: ReadingStatus) => {
    switch (status) {
      case "reading":
        return <BookOpen className="h-4 w-4" />;
      case "completed":
        return <BookOpenCheck className="h-4 w-4" />;
      case "to-read":
        return <BookMarked className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const preventBubbling = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div onClick={preventBubbling}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            size="icon"
            variant="secondary"
            className="h-8 w-8 rounded-full bg-background shadow-md border border-border"
            onClick={preventBubbling}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">Book actions</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56" onCloseAutoFocus={(e) => e.preventDefault()}>
          <DropdownMenuLabel>Book Actions</DropdownMenuLabel>
          
          {/* Reading status submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="cursor-pointer">
              <div className="flex items-center">
                {getStatusIcon(currentStatus)}
                <span className="ml-2">Change Status</span>
              </div>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup 
                value={currentStatus} 
                onValueChange={(value) => {
                  onStatusChange(value as ReadingStatus);
                }}
              >
                <DropdownMenuRadioItem value="to-read" className="cursor-pointer">
                  <BookMarked className="mr-2 h-4 w-4 text-chart-4" />
                  <span>To Read</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="reading" className="cursor-pointer">
                  <BookOpen className="mr-2 h-4 w-4 text-chart-3" />
                  <span>Currently Reading</span>
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="completed" className="cursor-pointer">
                  <BookOpenCheck className="mr-2 h-4 w-4 text-chart-1" />
                  <span>Completed</span>
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          
          {/* Read action (if book has content) */}
          {hasContent && (
            <>
              <DropdownMenuItem 
                onSelect={(e) => {
                  e.preventDefault();
                  if (currentStatus === "completed") {
                    // Start reading again with reset progress
                    startReadAgain(book.id);
                    toast.success("Starting over", {
                      description: "Progress has been reset. Enjoy reading again!"
                    });
                  }
                  onReadNow(e as unknown as MouseEvent);
                }}
              >
                {currentStatus === "completed" ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Read Again
                  </>
                ) : (
                  <>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Read Now
                  </>
                )}
              </DropdownMenuItem>
            </>
          )}
          
          <DropdownMenuSeparator />
          
          {/* Remove from library */}
          <DropdownMenuItem 
            onSelect={(e) => {
              e.preventDefault();
              onRemove(e as unknown as MouseEvent);
            }}
            className="text-destructive focus:text-destructive cursor-pointer"
          >
            <X className="h-4 w-4 mr-2" />
            Remove from Library
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}