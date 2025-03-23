"use client";

import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export type ViewMode = 'grid' | 'list';

interface ViewModeToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
  className?: string;
}

export function ViewModeToggle({ 
  viewMode, 
  onChange,
  className = "" 
}: ViewModeToggleProps) {
  return (
    <TooltipProvider>
      <div className={`flex items-center border rounded-lg ${className}`}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              aria-label="Grid view"
              className="rounded-r-none border-r cursor-pointer"
              onClick={() => onChange("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Grid view</TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              aria-label="List view"
              className="rounded-l-none cursor-pointer"
              onClick={() => onChange("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>List view</TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}