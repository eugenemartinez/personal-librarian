import { ViewModeToggle } from '@/components/ui/view-mode-toggle';
import { DisplayControls } from './DisplayControls';
import { SortOrder } from '@/utils/libraryUtils';

interface LibraryDisplayHeaderProps {
  viewMode: 'grid' | 'list';
  sortOrder: SortOrder;
  activeTab: string;
  hasBooks: boolean;
  readingHistory: any[];
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onSortOrderChange: (order: string) => void;
}

export function LibraryDisplayHeader({
  viewMode,
  sortOrder,
  activeTab,
  hasBooks,
  readingHistory,
  onViewModeChange,
  onSortOrderChange
}: LibraryDisplayHeaderProps) {
  return (
    <div className="mb-6">
      {/* Library display controls */}
      {hasBooks && activeTab !== "history" && (
        <DisplayControls
          viewMode={viewMode}
          sortOrder={sortOrder}
          onViewModeChange={onViewModeChange}
          onSortOrderChange={onSortOrderChange}
        />
      )}
      
      {/* History specific display controls */}
      {activeTab === "history" && readingHistory.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {readingHistory.length} {readingHistory.length === 1 ? 'book' : 'books'} in your reading history
          </div>
          <ViewModeToggle 
            viewMode={viewMode} 
            onChange={onViewModeChange}
          />
        </div>
      )}
    </div>
  );
}