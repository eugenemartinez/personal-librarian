"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useFormStatus } from "react-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Save, X } from "lucide-react";

interface FormActionBarProps {
  isDirty: boolean;
  onSave?: () => void;
  onCancel?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  className?: string;
  showIcons?: boolean;
}

export function FormActionBar({
  isDirty,
  onSave,
  onCancel,
  saveLabel = "Save",
  cancelLabel = "Cancel",
  className,
  showIcons = true,
}: FormActionBarProps) {
  const { pending } = useFormStatus();
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  return (
    <AnimatePresence>
      {isDirty && (
        <motion.div 
          className={cn(
            isMobile
              ? "fixed bottom-16 left-0 right-0 z-50" 
              : "flex justify-end mt-6",
            className
          )}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        >
          {/* Mobile backdrop */}
          {isMobile && (
            <motion.div 
              className="absolute inset-0 -z-10 bg-background/90 backdrop-blur-sm border-t border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
          )}
          
          <div 
            className={cn(
              "p-3 flex justify-end gap-2",
              isMobile ? "container mx-auto" : "",
              isMobile ? "" : "bg-card border border-border rounded-md shadow-sm"
            )}
          >
            <Button
              type={onSave ? "button" : "submit"}
              onClick={onSave}
              disabled={pending}
              size={isMobile ? "default" : "sm"}
              className={cn(
                "transition-all font-medium",
                isMobile ? "flex-1" : ""
              )}
            >
              {showIcons && <Save className="w-4 h-4 mr-2" />}
              {pending ? "Saving..." : saveLabel}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              size={isMobile ? "default" : "sm"}
              className={cn(
                "transition-all",
                isMobile ? "flex-1" : ""
              )}
            >
              {showIcons && <X className="w-4 h-4 mr-2" />}
              {cancelLabel}
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}