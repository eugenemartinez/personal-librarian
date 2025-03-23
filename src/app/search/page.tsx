import { Suspense } from 'react';
import SearchPageContent from './_components/SearchPageContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Search Books | Personal Librarian",
  description: "Search for books in your personal library",
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="container mx-auto py-6 px-4">Loading search...</div>}>
      <SearchPageContent />
    </Suspense>
  );
}