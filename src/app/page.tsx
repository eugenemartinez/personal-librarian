"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, Search, BookmarkIcon, LibraryIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [hasVisitedBefore, setHasVisitedBefore] = useState(true);

  useEffect(() => {
    // Check if user has visited before
    const visited = localStorage.getItem("hasVisitedBefore");
    setHasVisitedBefore(!!visited);
    
    // Set flag for future visits
    localStorage.setItem("hasVisitedBefore", "true");
    
    // Simulate loading time (remove this in production if not needed)
    const timer = setTimeout(() => {
      setLoading(false);
    }, hasVisitedBefore ? 500 : 2000); // Shorter loading time for returning users
    
    return () => clearTimeout(timer);
  }, [hasVisitedBefore]);

  // Loading screen
  if (loading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ 
            scale: [0.8, 1.2, 1], 
            opacity: 1,
            rotate: [0, 10, 0, -10, 0] 
          }}
          transition={{ 
            duration: 1.5, 
            repeat: Infinity,
            repeatType: "reverse" 
          }}
          className="relative"
        >
          <LibraryIcon className="h-16 w-16 text-primary" />
          <motion.div 
            className="absolute inset-0"
            animate={{ 
              boxShadow: ["0px 0px 0px rgba(0, 0, 0, 0)", "0px 0px 20px rgba(0, 0, 0, 0.3)", "0px 0px 0px rgba(0, 0, 0, 0)"] 
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>
        <motion.h2 
          className="mt-4 text-xl font-medium text-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Personal Librarian
        </motion.h2>
        <motion.p
          className="text-sm text-muted-foreground mt-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          {hasVisitedBefore ? "Loading your library..." : "Welcome to your personal library..."}
        </motion.p>
      </div>
    );
  }

  // Main content with animations
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-6 md:py-12"
    >
      {/* Logo for Mobile Only */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="lg:hidden flex justify-center mb-8"
      >
        <div className="flex flex-col items-center">
          <LibraryIcon className="h-12 w-12 text-primary mb-2" />
          <h1 className="font-bold text-lg">Personal Librarian</h1>
        </div>
      </motion.div>
      
      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="text-2xl sm:text-4xl font-bold text-center mb-6 text-foreground"
      >
        Welcome to Your Personal Library
      </motion.h1>
      
      <motion.p 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.3 }}
        className="text-center mb-8 text-muted-foreground max-w-xl mx-auto"
      >
        Track your reading journey, discover new books, and build your personal collection in one place.
      </motion.p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
        {[
          {
            icon: <BookOpen className="h-6 w-6 text-primary" />,
            title: "Browse Books",
            description: "Explore our collection of books across various genres.",
            link: "/books",
            linkText: "Browse Books",
            delay: 0.4
          },
          {
            icon: <BookmarkIcon className="h-6 w-6 text-primary" />,
            title: "My Library",
            description: "Access your personal collection and reading history.",
            link: "/library",
            linkText: "My Library",
            delay: 0.5
          },
          {
            icon: <Search className="h-6 w-6 text-primary" />,
            title: "Search",
            description: "Find specific books or discover new recommendations.",
            link: "/search",
            linkText: "Search Books",
            delay: 0.6
          }
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: item.delay }}
            whileHover={{ 
              y: -5, 
              boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.1)",
              borderColor: "var(--primary)" 
            }}
            className="bg-card border rounded-lg p-6 flex flex-col items-center text-center"
          >
            <motion.div 
              className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center mb-4"
              whileHover={{ 
                scale: 1.1,
                backgroundColor: "var(--primary)",
                color: "white"
              }}
            >
              {item.icon}
            </motion.div>
            <h2 className="text-lg font-semibold mb-2 text-foreground">{item.title}</h2>
            <p className="text-sm text-muted-foreground mb-4">{item.description}</p>
            <Button 
              asChild 
              variant="outline" 
              size="sm" 
              className="mt-auto group"
            >
              <Link href={item.link}>
                <span className="group-hover:translate-x-1 transition-transform inline-block">
                  {item.linkText}
                </span>
              </Link>
            </Button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}