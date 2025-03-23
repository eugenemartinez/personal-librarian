import { ArrowUpDown, Clock, SortAsc, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ViewModeToggle } from "@/components/ui/view-mode-toggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { SortOrder } from "@/hooks/useDisplaySettings";

interface DisplayControlsProps {
  viewMode: "grid" | "list";
  sortOrder: SortOrder;
  onViewModeChange: (mode: "grid" | "list") => void;
  onSortOrderChange: (value: SortOrder) => void;
}

export function DisplayControls({
  viewMode,
  sortOrder,
  onViewModeChange,
  onSortOrderChange,
}: DisplayControlsProps) {
  // Function to get the appropriate icon based on the selected sort order
  const getSortIcon = () => {
    switch (sortOrder) {
      case "title":
        return <SortAsc className="h-3.5 w-3.5" />;
      case "author":
        return <Users className="h-3.5 w-3.5" />;
      case "newest":
        return <Clock className="h-3.5 w-3.5" />;
      case "default":
      default:
        return <ArrowUpDown className="h-3.5 w-3.5" />;
    }
  };
  
  // Function to get the sort label
  const getSortLabel = () => {
    switch (sortOrder) {
      case "title": return "Title";
      case "author": return "Author";
      case "newest": return "Newest";
      case "default": default: return "Sort";
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mt-4">
      <div className="flex items-center gap-2">
        <ViewModeToggle viewMode={viewMode} onChange={onViewModeChange} />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              {getSortIcon()}
              <span className="hidden sm:inline">{getSortLabel()}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuRadioGroup value={sortOrder} onValueChange={(value) => onSortOrderChange(value as SortOrder)}>
              <DropdownMenuRadioItem value="default" className="flex items-center gap-2">
                <ArrowUpDown className="h-3.5 w-3.5" />
                <span>Default</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="newest" className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5" />
                <span>Newest First</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="title" className="flex items-center gap-2">
                <SortAsc className="h-3.5 w-3.5" />
                <span>Title (A-Z)</span>
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="author" className="flex items-center gap-2">
                <Users className="h-3.5 w-3.5" />
                <span>Author (A-Z)</span>
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}