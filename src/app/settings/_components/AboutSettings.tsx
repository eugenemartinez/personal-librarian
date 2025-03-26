import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, Heart } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

// Define the version as a constant for easy updating
const APP_VERSION = "1.0.0";
const BUILD_DATE = "March 2025";

export function AboutSettings() {
  return (
    <div className="space-y-6">
      <Card className="border border-border">
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-lg sm:text-xl text-foreground">About Personal Librarian</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Information about this application
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 space-y-6">
          <div>
            <h3 className="font-medium text-lg mb-2 text-foreground">Overview</h3>
            <p className="text-muted-foreground text-sm">
              Personal Librarian is a modern web application designed to help you track your reading journey,
              discover new books, and build your personal digital library in one place.
              All data is stored locally on your device, giving you complete privacy and control.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-lg mb-2 text-foreground">Version</h3>
              <p className="text-muted-foreground text-sm">{APP_VERSION} (Built: {BUILD_DATE})</p>
            </div>
            
            <div>
              <h3 className="font-medium text-lg mb-2 text-foreground">Privacy</h3>
              <p className="text-muted-foreground text-sm">100% client-side with no analytics or tracking</p>
            </div>
          </div>
          
          <Separator className="bg-border my-2" />
          
          <div>
            <h3 className="font-medium text-lg mb-2 text-foreground">Technologies</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              <div className="border border-border rounded-md p-2">
                <p className="text-sm font-medium">Next.js 15</p>
                <p className="text-xs text-muted-foreground"> React Framework</p>
              </div>
              <div className="border border-border rounded-md p-2">
                <p className="text-sm font-medium">React 19</p>
                <p className="text-xs text-muted-foreground">JavaScript Library</p>
              </div>
              <div className="border border-border rounded-md p-2">
                <p className="text-sm font-medium">TypeScript</p>
                <p className="text-xs text-muted-foreground">Programming Language</p>
              </div>
              <div className="border border-border rounded-md p-2">
                <p className="text-sm font-medium">Tailwind CSS</p>
                <p className="text-xs text-muted-foreground">CSS Framework</p>
              </div>
              <div className="border border-border rounded-md p-2">
                <p className="text-sm font-medium">Shadcn UI</p>
                <p className="text-xs text-muted-foreground">UI Components</p>
              </div>
              <div className="border border-border rounded-md p-2">
                <p className="text-sm font-medium">LocalStorage</p>
                <p className="text-xs text-muted-foreground">Data Storage</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-4 sm:px-6 py-4 sm:py-6 border-t border-border">
          <div className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Personal Librarian. All rights reserved.
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <a href="https://github.com/eugenemartinez/personal-librarian" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </a>
            </Button>
          </div>
        </CardFooter>
      </Card>
      
      <Card className="border border-border">
        <CardHeader className="px-4 sm:px-6 py-4 sm:py-6">
          <CardTitle className="text-lg sm:text-xl text-foreground">Credits</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            Acknowledgments and attributions
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 sm:px-6 pb-6">
          <p className="text-muted-foreground mb-4 text-sm">
            This application uses various open-source libraries, tools, and resources:
          </p>
          
          <ul className="list-disc pl-5 text-muted-foreground space-y-1 text-sm">
            <li>Book data and images are used for demonstration purposes only</li>
            <li>UI components from <a href="https://ui.shadcn.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Shadcn UI</a></li>
            <li>Icons from <a href="https://lucide.dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Lucide Icons</a></li>
            <li>Fonts from <a href="https://fonts.google.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google Fonts</a></li>
          </ul>
          
          <div className="mt-6 flex items-center justify-center text-sm text-muted-foreground">
            <Heart className="h-4 w-4 mr-2 text-red-500" /> Built with care for book lovers
          </div>
        </CardContent>
      </Card>
    </div>
  );
}