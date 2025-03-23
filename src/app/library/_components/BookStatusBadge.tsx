import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { ReadingStatus } from '@/utils/libraryUtils';
import { BookOpenCheck, BookOpen, BookMarked } from 'lucide-react';

interface BookStatusBadgeProps {
  status: ReadingStatus;
  progress: number;
  className?: string;
}

export function BookStatusBadge({ status, progress, className }: BookStatusBadgeProps) {
  // Helper function to get status badge class
  const getStatusBadgeClass = (status: ReadingStatus) => {
    switch (status) {
      case "reading":
        return "bg-chart-3 text-white";
      case "completed":
        return "bg-chart-1 text-white";
      case "to-read":
        return "bg-chart-4 text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };
  
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
  
  // Get label text based on status and progress
  const getStatusLabel = () => {
    switch (status) {
      case "reading":
        return progress > 0 ? `${progress}%` : "Reading";
      case "completed":
        return "Completed";
      case "to-read":
        return "To Read";
      default:
        return "";
    }
  };

  return (
    <Badge
      className={cn(
        "shadow-md",
        getStatusBadgeClass(status),
        className
      )}
    >
      <span className="flex items-center gap-1.5">
        {getStatusIcon(status)}
        <span className="text-xs font-medium">
          {getStatusLabel()}
        </span>
      </span>
    </Badge>
  );
}