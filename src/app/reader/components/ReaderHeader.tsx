import Link from 'next/link';
import { ArrowLeft, Settings, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetTrigger } from "@/components/ui/sheet";
import { ReaderSettings } from './ReaderSettings';
import { calculateProgressPercentage } from '@/utils/readerProgress';
import { KeyboardShortcutsHelp } from './KeyboardShortcutsHelp';

interface ReaderHeaderProps {
  bookId: string;
  bookTitle: string;
  currentPage: number;
  totalPages: number;
  progress: number;
  fontSize: number;
  setFontSize: (size: number) => void;
  lineHeight: string;
  setLineHeight: (height: string) => void;
  fontFamily: string;
  setFontFamily: (family: string) => void;
  preferredReadingMode: 'page' | 'scroll';
  setPreferredReadingMode: (mode: 'page' | 'scroll') => void;
  onMarkComplete?: () => void;
}

export function ReaderHeader({
  bookId,
  bookTitle,
  currentPage,
  totalPages,
  progress,
  fontSize,
  setFontSize,
  lineHeight,
  setLineHeight,
  fontFamily,
  setFontFamily,
  preferredReadingMode,
  setPreferredReadingMode,
  onMarkComplete
}: ReaderHeaderProps) {
  const displayProgress = calculateProgressPercentage(currentPage + 1, totalPages);

  return (
    <header className="border-b border-border py-2 px-4 flex justify-between items-center shadow-sm bg-background sticky top-0 z-10">
      <div className="flex items-center">
        <Button 
          asChild 
          variant="ghost" 
          size="sm" 
          className="mr-2"
        >
          <Link href={`/books/${bookId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h2 className="text-sm font-medium truncate max-w-[200px] text-foreground">{bookTitle}</h2>
      </div>
      
      <div className="flex items-center gap-1">
        {onMarkComplete && (
          <Button
            variant="outline"
            size="sm"
            onClick={onMarkComplete}
            className="hidden md:flex items-center gap-1"
          >
            <CheckCircle className="h-4 w-4" />
            Mark Complete
          </Button>
        )}

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <ReaderSettings
            fontSize={fontSize}
            setFontSize={setFontSize}
            lineHeight={lineHeight}
            setLineHeight={setLineHeight}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
            preferredReadingMode={preferredReadingMode}
            setPreferredReadingMode={setPreferredReadingMode}
          />
        </Sheet>
        
        {/* Show KeyboardShortcutsHelp only on medium screens and above */}
        <div className="hidden md:flex">
          <KeyboardShortcutsHelp mode={preferredReadingMode} />
        </div>
      </div>
    </header>
  );
}