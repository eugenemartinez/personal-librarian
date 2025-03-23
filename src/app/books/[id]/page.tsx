import { notFound } from 'next/navigation';
import { BookDetails } from './BookDetails';
import { getBookById } from '@/lib/api/openLibraryApi';

// Make this a dynamic page to fetch fresh data
export const dynamic = 'force-dynamic';

export default async function BookDetailPage({ params }: { params: { id: string } }) {
  try {
    // Await the params object to access its properties
    const { id } = await params;

    // Fetch book data from Open Library API
    const book = await getBookById(id);

    // In our demo, all books have content via our mock reader
    const hasContent = true;

    // Use our internal reader URL for all books
    const readUrl = `/reader/${id}`;

    return <BookDetails book={book} hasContent={hasContent} readUrl={readUrl} />;
  } catch (error) {
    console.error("Failed to fetch book:", error);
    notFound();
  }
}