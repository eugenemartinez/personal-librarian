import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner"; // Update this import
import { Navigation } from '@/components/layout/navigation';
import { RouteTransitionProvider } from "@/components/RouteTransitionProvider";
import { ReadingSettingsProvider } from '@/contexts/ReadingSettingsContext';
import { BookStatusProvider } from '@/contexts/BookStatusContext';
import { ScrollPositionProvider } from '@/contexts/ScrollPositionContext';
import "./globals.css";

// Font setup
const fontSans = GeistSans;
const fontMono = GeistMono;

export const metadata: Metadata = {
  title: "Personal Librarian",
  description: "Track, discover, and share your reading journey",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "hsl(0 0% 100%)" }, // Use HSL format for consistency
    { media: "(prefers-color-scheme: dark)", color: "hsl(20 14.3% 4.1%)" } // Match stone-950 from Tailwind
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${fontSans.variable} ${fontMono.variable}`}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ReadingSettingsProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <RouteTransitionProvider>
              <BookStatusProvider>
                <ScrollPositionProvider>
                  <div className="relative flex min-h-screen flex-col">
                    <Navigation />
                    <main className="flex-grow pb-16 lg:pb-0">
                      {children}
                    </main>
                  </div>
                  <Toaster richColors closeButton />
                </ScrollPositionProvider>
              </BookStatusProvider>
            </RouteTransitionProvider>
          </ThemeProvider>
        </ReadingSettingsProvider>
      </body>
    </html>
  );
}