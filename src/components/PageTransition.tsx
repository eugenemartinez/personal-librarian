"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

type PageTransitionProps = {
  children: React.ReactNode;
};

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  
  // Determine transition type based on route
  const isReaderPage = pathname.includes("/reader/");
  const isBookDetailPage = pathname.startsWith("/books/") && !pathname.endsWith("/books/");
  
  // Define transition variants
  const getTransitionVariants = () => {
    // Book detail to reader transition (slide up)
    if (isReaderPage) {
      return {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: 20 },
        transition: { type: "spring", stiffness: 500, damping: 30 }
      };
    }
    
    // List to detail transition (slide horizontally)
    else if (isBookDetailPage) {
      return {
        initial: { opacity: 0, x: 20 },
        animate: { opacity: 1, x: 0 },
        exit: { opacity: 0, x: -20 },
        transition: { type: "spring", stiffness: 400, damping: 35 }
      };
    }
    
    // Default transitions (subtle fade)
    return {
      initial: { opacity: 0 },
      animate: { opacity: 1 },
      exit: { opacity: 0 },
      transition: { duration: 0.2 }
    };
  };
  
  const variants = getTransitionVariants();
  
  return (
    <motion.div
      key={pathname}
      initial={variants.initial}
      animate={variants.animate}
      exit={variants.exit}
      transition={variants.transition}
    >
      {children}
    </motion.div>
  );
}