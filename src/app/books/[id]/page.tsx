import { notFound } from 'next/navigation';
import { BookDetails } from './BookDetails';
import { getBookById } from '@/lib/api/openLibraryApi';

// Make this a dynamic page to fetch fresh data
export const dynamic = 'force-dynamic';

interface BookDetailPageProps {
  params: Promise<{ id: string }>; // Mark params as a Promise
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  // Await params before destructuring
  const { id } = await params;

  try {
    // Fetch book data from Open Library API
    const book = await getBookById(id);

    const hasContent = true;
    const readUrl = `/reader/${id}`;

    return <BookDetails book={book} hasContent={hasContent} readUrl={readUrl} />;
  } catch (error) {
    console.error("Failed to fetch book:", error);
    notFound();
  }
}