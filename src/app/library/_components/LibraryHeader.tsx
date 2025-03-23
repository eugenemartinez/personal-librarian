import { ReadingStatus } from "@/utils/libraryUtils";
import { LibraryTabs } from "./LibraryTabs";

interface LibraryHeaderProps {
  activeTab: "all" | ReadingStatus | "history";
  onTabChange: (tab: "all" | ReadingStatus | "history") => void;
  hasBooks: boolean;
}

export function LibraryHeader({ activeTab, onTabChange, hasBooks }: LibraryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-foreground">My Library</h1>
      
      <div className="w-full sm:w-auto">
        <LibraryTabs 
          activeTab={activeTab} 
          onChange={(value) => onTabChange(value)}
          hasBooks={hasBooks} 
        />
      </div>
    </div>
  );
}