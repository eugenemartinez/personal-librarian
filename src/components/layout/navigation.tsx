"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, Library, Settings, BookOpen } from "lucide-react";
import { SquareModeToggle } from "@/components/ui/mode-toggle";
import { useEffect, useState } from "react";
import { getNavigationContext } from "@/utils/localStorage";

export function Navigation() {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  
  // Hide navigation on reader pages
  if (pathname.includes("/reader/")) {
    return null;
  }

  // Check if we're on the settings page
  const isSettingsPage = pathname.startsWith('/settings');
  
  // Mark component as mounted to safely access localStorage
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Check if we're on a book detail page and set active section
  useEffect(() => {
    if (!mounted) return;
    
    const isBookDetailPage = pathname.match(/^\/books\/[^\/]+$/);
    
    if (isBookDetailPage) {
      const navigationContext = getNavigationContext();
      
      if (navigationContext.startsWith("/search")) {
        setActiveSection("/search");
      } else if (navigationContext.startsWith("/library")) {
        setActiveSection("/library");
      } else if (navigationContext.startsWith("/books")) {
        setActiveSection("/books");
      } else {
        // Default to books if context is missing or invalid
        setActiveSection("/books");
      }
    } else {
      // Not on a book detail page, reset the active section
      setActiveSection(null);
    }
  }, [pathname, mounted]);
  
  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/books", icon: BookOpen, label: "Books" },
    { href: "/library", icon: Library, label: "Library" },
    { href: "/search", icon: Search, label: "Search" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ];
  
  return (
    <>
      {/* Mobile Navigation (Bottom) */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0 bg-background border-t border-border flex justify-around items-center h-16 px-2 lg:hidden z-40"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 500, damping: 30 }}
      >
        {navItems.map((item) => {
          // Determine if this item should be active
          let isActive = false;
          
          // Only check context-based activation if we're mounted
          if (mounted && pathname.match(/^\/books\/[^\/]+$/) && activeSection) {
            // On book detail page, use the stored context
            isActive = activeSection === item.href;
          } else {
            // Normal path-based active state
            isActive = item.href === "/" 
              ? pathname === "/" 
              : pathname.startsWith(item.href);
          }
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="flex flex-col items-center justify-center w-full h-full relative"
            >
              <div className="relative">
                {isActive && (
                  <motion.div
                    layoutId="navigation-pill"
                    className="absolute inset-0 h-1 w-full bg-primary rounded-full bottom-0 -mb-2"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <item.icon 
                  className={`h-5 w-5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} 
                />
              </div>
              <span className={`text-xs mt-1 ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </motion.div>
      
      {/* Desktop Navigation (Top) */}
      <div className="hidden lg:block sticky top-0 z-40 bg-background border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo and Title */}
          <Link href="/" className="flex items-center gap-2">
            <Library className="h-6 w-6 text-foreground" />
            <span className="text-lg font-bold text-foreground">Personal Librarian</span>
          </Link>
          
          {/* Desktop Navigation Links */}
          <div className="flex items-center gap-6">
            <nav className="flex items-center gap-6">
              {navItems.map((item) => {
                let isActive = false;
                
                if (pathname.match(/^\/books\/[^\/]+$/) && activeSection) {
                  isActive = activeSection === item.href;
                } else {
                  isActive = item.href === "/" 
                    ? pathname === "/" 
                    : pathname.startsWith(item.href);
                }
                
                return (
                  <Link 
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 text-sm font-medium ${
                      isActive ? 'text-primary' : 'text-foreground hover:text-primary'
                    } transition-colors`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            
            {/* Theme Toggle - Hide on settings page */}
            {!isSettingsPage && (
              <div className="ml-2">
                <SquareModeToggle />
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}