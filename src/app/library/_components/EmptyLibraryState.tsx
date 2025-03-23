import { Library } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { getEmptyStateMessage } from "@/utils/libraryUtils";

export function EmptyLibraryState() {
  const router = useRouter();
  const emptyState = getEmptyStateMessage("library");
  
  return (
    <div className="text-center py-16">
      <Library className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-20" />
      <h2 className="text-2xl font-medium mb-2 text-foreground">{emptyState.title}</h2>
      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
        {emptyState.description}
      </p>
      <Button onClick={() => router.push('/books')}>{emptyState.actionText}</Button>
    </div>
  );
}