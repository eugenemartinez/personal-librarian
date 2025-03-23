import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function showCompletionToast(bookId: string, router: ReturnType<typeof useRouter>) {
  toast.success("Book completed!", {
    description: "This book has been marked as completed in your library.",
    action: {
      label: "View Library",
      onClick: () => router.push('/library')
    }
  });
}