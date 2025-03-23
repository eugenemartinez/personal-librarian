import { Book } from "@/data/books";

const OPEN_LIBRARY_API_URL = "https://openlibrary.org";

export type OpenLibraryBook = {
  key: string;
  title: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
  number_of_pages_median?: number;
  subject?: string[];
  description?: string;
};

/**
 * Search for books using the Open Library API.
 */
export async function searchBooks(
  query: string,
  offset: number = 0,
  limit: number = 20
): Promise<Book[]> {
  const response = await fetch(
    `${OPEN_LIBRARY_API_URL}/search.json?q=${encodeURIComponent(query)}&offset=${offset}&limit=${limit}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch books");
  }

  const data = await response.json();
  return data.docs.map(mapToBook);
}

/**
 * Fetch a book by its ID from the Open Library API.
 */
export async function getBookById(id: string): Promise<Book> {
  const response = await fetch(`${OPEN_LIBRARY_API_URL}/works/${id}.json`);

  if (!response.ok) {
    throw new Error("Failed to fetch book");
  }

  const data = await response.json();
  return mapWorkToBook(data);
}

/**
 * Generate a random rating between 2.5 and 5.0.
 */
function generateRandomRating(): number {
  return Number((Math.random() * 2.5 + 2.5).toFixed(1));
}

/**
 * Generate a random ratings count between 50 and 5000.
 */
function generateRandomRatingsCount(): number {
  return Math.floor(Math.random() * 4950) + 50;
}

/**
 * Map an Open Library book object to the Book type.
 */
function mapToBook(item: OpenLibraryBook): Book {
  return {
    id: item.key?.replace("/works/", "") || "",
    title: item.title || "Unknown Title",
    author: item.author_name?.[0] || "Unknown Author",
    coverImage: item.cover_i
      ? `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`
      : "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400",
    description: item.description || "No description available",
    publishedDate: item.first_publish_year ? `${item.first_publish_year}` : "Unknown",
    pageCount: item.number_of_pages_median || 0,
    categories: item.subject?.slice(0, 5) || ["Fiction"],
    averageRating: generateRandomRating(),
    ratingsCount: generateRandomRatingsCount(),
  };
}

/**
 * Map a work object from the Open Library API to the Book type.
 */
function mapWorkToBook(work: any): Book {
  return {
    id: work.key?.replace("/works/", "") || "",
    title: work.title || "Unknown Title",
    author: work.authors?.[0]?.name || "Unknown Author",
    coverImage: work.covers?.[0]
      ? `https://covers.openlibrary.org/b/id/${work.covers[0]}-M.jpg`
      : "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?q=80&w=400",
    description:
      typeof work.description === "string"
        ? work.description
        : work.description?.value || "No description available",
    publishedDate: work.first_publish_date || "Unknown",
    pageCount: work.number_of_pages || 0,
    categories: work.subjects?.slice(0, 5) || ["Fiction"],
    averageRating: generateRandomRating(),
    ratingsCount: generateRandomRatingsCount(),
  };
}

/**
 * Check if a book is available for reading.
 */
export async function isBookReadable(id: string): Promise<boolean> {
  return id.startsWith("OL") && (id.endsWith("W") || id.endsWith("M"));
}

/**
 * Get the reading URL for a book.
 */
export function getBookReadUrl(id: string): string {
  if (id.endsWith("W")) {
    return `https://openlibrary.org/works/${id}/read`;
  } else if (id.endsWith("M")) {
    return `https://archive.org/details/olid-${id}`;
  } else {
    return `https://openlibrary.org/works/${id}/read`;
  }
}

/**
 * Fetch the detailed reading URL for a book.
 */
export async function fetchBookReadUrl(id: string): Promise<string | null> {
  try {
    const readApiUrl = `${OPEN_LIBRARY_API_URL}/api/volumes/brief/olid/${id}.json`;
    const readApiResponse = await fetch(readApiUrl);

    if (readApiResponse.ok) {
      const data = await readApiResponse.json();

      if (data.items && data.items.length > 0) {
        for (const item of data.items) {
          if (item.itemURL) {
            return item.itemURL;
          }
        }
      }
    }

    return getBookReadUrl(id);
  } catch {
    return getBookReadUrl(id);
  }
}

/**
 * Get a book with additional readability information.
 */
export async function getBookWithReadability(id: string): Promise<BookWithReadability> {
  const book = await getBookById(id);
  const isReadable = await isBookReadable(id);

  return {
    ...book,
    isReadable,
    readUrl: isReadable ? getBookReadUrl(id) : undefined,
  };
}

export interface BookWithReadability extends Book {
  isReadable: boolean;
  readUrl?: string;
}