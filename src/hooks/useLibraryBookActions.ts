import { useState } from "react";
import { useRouter } from "next/navigation";
import { ReadingStatus, updateBookStatus } from "@/utils/libraryUtils";
import { toast } from "sonner";
import { bookContent } from "@/data/bookContent";

/**
 * Hook to manage library book actions such as removing, reading, and updating status.
 */
export function useLibraryBookActions(
  bookId: string,
  bookTitle: string,
  initialStatus: ReadingStatus,
  initialProgress: number,
  onRemove: (bookId: string) => void,
  onStatusChange?: (bookId: string, status: ReadingStatus, progress: number) => void
) {
  const router = useRouter();
  const hasContent = Boolean(bookContent[bookId]);

  // Local state for immediate UI updates
  const [currentStatus, setCurrentStatus] = useState<ReadingStatus>(initialStatus);
  const [currentProgress, setCurrentProgress] = useState<number>(initialProgress);

  /**
   * Remove the book from the library.
   */
  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemove(bookId);
  };

  /**
   * Navigate to the book reader.
   */
  const handleReadNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/reader/${bookId}`);
  };

  /**
   * Update the reading status of the book.
   */
  const handleStatusChange = (newStatus: ReadingStatus) => {
    const wasCompleted = currentStatus === "completed";
    const resetProgress = wasCompleted && newStatus === "reading";

    // Calculate new progress
    const newProgress =
      newStatus === "completed" ? 100 : resetProgress ? 0 : currentProgress;

    // Update local state for better UX
    setCurrentStatus(newStatus);
    setCurrentProgress(newProgress);

    // Update in localStorage
    updateBookStatus(bookId, newStatus, resetProgress);

    // Notify parent component if callback is provided
    if (onStatusChange) {
      onStatusChange(bookId, newStatus, newProgress);
    }

    // Show success toast
    toast.success(`Status updated`, {
      description: `"${bookTitle}" marked as ${
        newStatus === "reading"
          ? "Currently Reading"
          : newStatus === "completed"
          ? "Completed"
          : "To Read"
      }`,
    });
  };

  return {
    currentStatus,
    currentProgress,
    hasContent,
    handleRemove,
    handleReadNow,
    handleStatusChange,
  };
}