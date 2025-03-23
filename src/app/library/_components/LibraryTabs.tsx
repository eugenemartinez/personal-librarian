"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReadingStatus } from '@/utils/libraryUtils';
import { BookOpen, BookMarked, BookCheck, Clock, Library } from 'lucide-react';

interface LibraryTabsProps {
  activeTab: "all" | ReadingStatus | "history";
  onChange: (value: "all" | ReadingStatus | "history") => void;
  hasBooks: boolean;
}

export function LibraryTabs({ activeTab, onChange, hasBooks }: LibraryTabsProps) {
  // Define tab configuration with icons and labels
  const tabs = [
    { 
      value: "all", 
      label: "All Books", 
      icon: <Library className="h-4 w-4" />
    },
    { 
      value: "to-read", 
      label: "To Read", 
      icon: <BookMarked className="h-4 w-4" />
    },
    { 
      value: "reading", 
      label: "Reading", 
      icon: <BookOpen className="h-4 w-4" />
    },
    { 
      value: "completed", 
      label: "Completed", 
      icon: <BookCheck className="h-4 w-4" />
    },
    { 
      value: "history", 
      label: "History", 
      icon: <Clock className="h-4 w-4" />
    },
  ];

  return (
    <Tabs value={activeTab} onValueChange={onChange as (value: string) => void} className="w-full">
      <TabsList className="w-full h-auto flex flex-wrap">
        {tabs.map(tab => (
          <TabsTrigger 
            key={tab.value} 
            value={tab.value}
            className={cn(
              "flex-1 py-2",
              !hasBooks && tab.value !== "all" && tab.value !== "history" && "hidden"
            )}
            aria-label={tab.label}
          >
            {/* Show icon only on mobile, icon + text on larger screens */}
            <span className="sm:hidden">{tab.icon}</span>
            <span className="hidden sm:inline-flex items-center gap-1 cursor-pointer">
              <span className="hidden md:inline-block">{tab.icon}</span>
              {tab.label}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}