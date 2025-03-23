import { cn } from '@/lib/utils';
import { ReadingStatus } from '@/utils/libraryUtils';

interface BookProgressBarProps {
  status: ReadingStatus;
  progress: number;
  className?: string;
}

export function BookProgressBar({ status, progress, className }: BookProgressBarProps) {
  if (status !== "reading" || progress <= 0) {
    return null;
  }
  
  // Helper function to get progress width class
  const getProgressWidthClass = (progress: number) => {
    // Create width classes for percentages
    const widthClasses = {
      0: "w-0",
      5: "w-[5%]",
      10: "w-[10%]",
      15: "w-[15%]",
      20: "w-[20%]",
      25: "w-[25%]",
      30: "w-[30%]",
      35: "w-[35%]",
      40: "w-[40%]",
      45: "w-[45%]",
      50: "w-[50%]",
      55: "w-[55%]",
      60: "w-[60%]",
      65: "w-[65%]",
      70: "w-[70%]",
      75: "w-[75%]",
      80: "w-[80%]",
      85: "w-[85%]",
      90: "w-[90%]",
      95: "w-[95%]",
      100: "w-full",
    };
    
    // Round to nearest 5
    const roundedProgress = Math.round(progress / 5) * 5;
    // Get the class for this progress level or default to w-0
    return widthClasses[roundedProgress as keyof typeof widthClasses] || "w-0";
  };
  
  const getProgressColorClass = (progress: number) => {
    if (progress < 25) return "bg-chart-4";
    if (progress < 75) return "bg-chart-3";
    return "bg-chart-1";
  };

  return (
    <div className={cn("w-full", className)}>
      <div className="h-1.5 w-full bg-black/50">
        <div 
          className={cn(
            "h-full", 
            getProgressWidthClass(progress),
            getProgressColorClass(progress)
          )}
        />
      </div>
    </div>
  );
}