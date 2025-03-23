import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Book as BookIcon, BookOpen, BookOpenCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getReaderProgress } from '@/utils/readerProgress';
import { BookProgressBar } from './BookProgressBar';
import { getCachedBook } from '@/utils/libraryUtils'; // Add this import

interface ReadingHistoryContentProps {
  readingHistory: any[];
  viewMode: 'grid' | 'list';
  isHistoryEnabled: boolean;
  onNavigate: (bookId: string) => void;
}

export function ReadingHistoryContent({
  readingHistory,
  viewMode,
  isHistoryEnabled,
  onNavigate
}: ReadingHistoryContentProps) {
  const router = useRouter();
  // Add state for enhanced history items
  const [enhancedHistory, setEnhancedHistory] = useState<any[]>([]);
  
  // Add effect to enhance history items with cached metadata
  useEffect(() => {
    const enhanced = readingHistory.map(item => {
      // Try to get cached book data
      const cachedBook = getCachedBook(item.bookId);
      
      if (cachedBook) {
        return {
          ...item,
          title: cachedBook.title || item.title,
          author: cachedBook.author || item.author,
          coverUrl: cachedBook.coverImage || item.coverUrl
        };
      }
      
      return item;
    });
    
    setEnhancedHistory(enhanced);
  }, [readingHistory]);

  if (!isHistoryEnabled) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-muted-foreground">Reading history is disabled in settings.</p>
        <Button onClick={() => router.push('/settings')}>
          Enable in Settings
        </Button>
      </div>
    );
  }

  // Use enhancedHistory instead of readingHistory throughout the component
  if (enhancedHistory.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Your reading history is empty.</p>
        <p className="text-sm text-muted-foreground mt-1">
          Books you read will appear here automatically.
        </p>
      </div>
    );
  }

  return (
    <>
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {enhancedHistory.map((item) => {
            const actualProgress = getReaderProgress(item.bookId);
            
            return (
              <div 
                key={`${item.bookId}-${item.lastReadAt}`}
                className="group cursor-pointer"
                onClick={() => onNavigate(item.bookId)}
              >
                <div className="aspect-[2/3] relative border border-border overflow-hidden rounded-md mb-2">
                  {item.coverUrl ? (
                    <img 
                      src={item.coverUrl} 
                      alt={item.title}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-muted">
                      <span className="text-2xl font-bold text-muted-foreground">
                        {item.title.charAt(0)}
                      </span>
                    </div>
                  )}
                  
                  <BookProgressBar
                    status={actualProgress > 0 ? "reading" : "to-read"} 
                    progress={actualProgress || 0}
                    className="absolute bottom-0 left-0 right-0 z-10"
                  />
                </div>
                
                <h3 className="font-medium text-sm line-clamp-2 group-hover:underline">
                  {item.title}
                </h3>
                {item.author && (
                  <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                    {item.author}
                  </p>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Read {new Date(item.lastReadAt).toLocaleDateString()}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {enhancedHistory.map((item) => {
            const actualProgress = getReaderProgress(item.bookId);
            const isCompleted = actualProgress >= 100;
            const hasStarted = actualProgress > 0;
            
            const getButtonText = () => {
              if (isCompleted) return "Read Again";
              if (hasStarted) return "Continue Reading";
              return "Start Reading";
            };
            
            const ButtonIcon = isCompleted ? BookOpenCheck : 
                              hasStarted ? BookOpen : BookIcon;
            
            return (
              <div 
                key={`${item.bookId}-${item.lastReadAt}`}
                className="flex items-center gap-4 p-3 rounded-lg border border-border hover:bg-accent/50 group cursor-pointer relative"
                onClick={() => onNavigate(item.bookId)}
              >
                <div className="h-16 w-12 relative flex-shrink-0 overflow-hidden rounded">
                  {item.coverUrl ? (
                    <img 
                      src={item.coverUrl} 
                      alt={item.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-muted">
                      <span className="text-lg font-bold text-muted-foreground">
                        {item.title.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium line-clamp-1 group-hover:underline">
                    {item.title}
                  </h3>
                  {item.author && (
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {item.author}
                    </p>
                  )}
                  <div className="flex items-center text-xs text-muted-foreground mt-1">
                    <span>
                      Read {new Date(item.lastReadAt).toLocaleDateString()}
                    </span>
                    {actualProgress > 0 && (
                      <span className="ml-2 flex items-center gap-1">
                        • {actualProgress}% completed
                      </span>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="ml-auto hidden sm:flex cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(item.bookId);
                  }}
                >
                  <ButtonIcon className="h-4 w-4 mr-2" />
                  {getButtonText()}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="ml-auto sm:hidden"
                  onClick={(e) => {
                    e.stopPropagation();
                    onNavigate(item.bookId);
                  }}
                  aria-label={getButtonText()}
                >
                  <ButtonIcon className="h-4 w-4" />
                </Button>
                
                <BookProgressBar
                  status={actualProgress > 0 ? "reading" : "to-read"} 
                  progress={actualProgress || 0}
                  className="absolute bottom-0 left-0 right-0 z-10"
                />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}