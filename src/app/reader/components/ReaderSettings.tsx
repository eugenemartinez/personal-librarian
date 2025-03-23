"use client";

import { useEffect } from 'react';
import {
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";
import { useReadingSettings } from '@/contexts/ReadingSettingsContext';
import { Badge } from "@/components/ui/badge";

interface ReaderSettingsProps {
  fontSize: number;
  setFontSize: (size: number) => void;
  lineHeight: string;
  setLineHeight: (height: string) => void;
  fontFamily: string;
  setFontFamily: (family: string) => void;
  preferredReadingMode: 'page' | 'scroll';
  setPreferredReadingMode: (mode: 'page' | 'scroll') => void;
}

export function ReaderSettings({
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight,
  fontFamily,
  setFontFamily,
  preferredReadingMode,
  setPreferredReadingMode,
}: ReaderSettingsProps) {
  const { theme, setTheme } = useTheme();
  const { settings, updateSettings } = useReadingSettings();
  
  // Sync settings from context to local state on mount and when context changes
  useEffect(() => {
    setFontSize(settings.fontSize);
    setLineHeight(settings.lineHeight);
    setFontFamily(settings.fontFamily);
    setPreferredReadingMode(settings.preferredReadingMode);
  }, [settings, setFontSize, setLineHeight, setFontFamily, setPreferredReadingMode]);
  
  // Update both local state and context
  const handleFontSizeChange = (newSize: number) => {
    setFontSize(newSize);
    updateSettings({ fontSize: newSize });
  };
  
  const handleLineHeightChange = (newHeight: string) => {
    setLineHeight(newHeight);
    updateSettings({ lineHeight: newHeight });
  };
  
  const handleFontFamilyChange = (newFamily: string) => {
    setFontFamily(newFamily);
    updateSettings({ fontFamily: newFamily as any });
  };
  
  const handleReadingModeChange = (newMode: string) => {
    const mode = newMode as 'page' | 'scroll';
    setPreferredReadingMode(mode);
    updateSettings({ preferredReadingMode: mode });
  };

  // Get display name for line height
  const getLineHeightDisplayName = () => {
    if (lineHeight === '1.5') return 'Compact';
    if (lineHeight === '1.8') return 'Normal';
    if (lineHeight === '2.2') return 'Relaxed';
    if (lineHeight === '2.5') return 'Spacious';
    return 'Normal';
  };

  return (
    <SheetContent className="w-[340px] sm:w-[400px] px-6">
      <SheetHeader className="mb-2">
        <SheetTitle className="text-xl">Reading Settings</SheetTitle>
        <SheetDescription>
          Customize your reading experience
        </SheetDescription>
      </SheetHeader>
      <div className="py-6 space-y-8">
        {/* Font Size section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground block">Font Size</label>
          <div className="flex items-center gap-4 px-1">
            <span className="text-xs text-muted-foreground">A</span>
            <Slider 
              value={[fontSize]}
              min={14}
              max={28}
              step={1}
              onValueChange={(value) => handleFontSizeChange(value[0])}
              className="flex-1"
            />
            <span className="text-lg text-muted-foreground">A</span>
          </div>
          <div className="text-xs text-muted-foreground mt-1 text-center">
            {fontSize}px
          </div>
        </div>
        
        {/* Line Spacing section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground block">Line Spacing</label>
          <Select 
            value={lineHeight} 
            onValueChange={handleLineHeightChange}
          >
            <SelectTrigger className="w-full">
              <SelectValue>
                {getLineHeightDisplayName()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1.5">Compact</SelectItem>
              <SelectItem value="1.8">Normal</SelectItem>
              <SelectItem value="2.2">Relaxed</SelectItem>
              <SelectItem value="2.5">Spacious</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Font Family section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground block">Font Family</label>
          <Select value={fontFamily} onValueChange={handleFontFamilyChange}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {fontFamily === 'serif' ? 'Serif' : 
                 fontFamily === 'sans-serif' ? 'Sans Serif' : 
                 fontFamily === 'monospace' ? 'Monospace' : 'Select font'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="sans-serif">Sans Serif</SelectItem>
              <SelectItem value="monospace">Monospace</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Reading Mode section */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground block">Reading Mode</label>
          <Select value={preferredReadingMode} onValueChange={handleReadingModeChange}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {preferredReadingMode === 'page' ? 'Page Mode' : 'Scroll Mode'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="page">Page Mode</SelectItem>
              <SelectItem value="scroll" className="flex items-center gap-2">
                <span>Scroll Mode</span>
                <Badge variant="outline" className="ml-1 text-xs font-normal bg-yellow-100/10 text-yellow-600 dark:text-yellow-400 border-yellow-200 dark:border-yellow-900">
                  Beta
                </Badge>
              </SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            {preferredReadingMode === 'page' 
              ? 'Traditional page-by-page reading experience.' 
              : 'Continuous scrolling experience (beta).'}
          </p>
        </div>
        
        {/* Theme Switcher as a dropdown */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground block">Theme</label>
          <Select value={theme || "system"} onValueChange={setTheme}>
            <SelectTrigger className="w-full">
              <SelectValue>
                {theme === 'light' ? 'Light' : 
                 theme === 'dark' ? 'Dark' : 'System'}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground mt-1">
            {theme === 'light' ? 'Light background with dark text' : 
             theme === 'dark' ? 'Dark background with light text' : 
             'Follow your system preferences'}
          </p>
        </div>
      </div>
    </SheetContent>
  );
}