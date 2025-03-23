"use client";

import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { KeyboardIcon } from 'lucide-react';

interface KeyboardShortcutsHelpProps {
  mode: 'page' | 'scroll';
}

export function KeyboardShortcutsHelp({ mode }: KeyboardShortcutsHelpProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          title="Keyboard shortcuts"
        >
          <KeyboardIcon className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Keyboard Shortcuts</DialogTitle>
          <DialogDescription>
            Use these keyboard shortcuts for faster navigation
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {mode === 'page' && (
            <>
              <div className="flex justify-between items-center">
                <span>Previous page</span>
                <kbd className="px-2 py-1 bg-muted rounded">←</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Next page</span>
                <kbd className="px-2 py-1 bg-muted rounded">→</kbd>
              </div>
            </>
          )}
          {mode === 'scroll' && (
            <>
              <div className="flex justify-between items-center">
                <span>Scroll up</span>
                <kbd className="px-2 py-1 bg-muted rounded">↑</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Scroll down</span>
                <kbd className="px-2 py-1 bg-muted rounded">↓</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Page up</span>
                <kbd className="px-2 py-1 bg-muted rounded">Page Up</kbd>
              </div>
              <div className="flex justify-between items-center">
                <span>Page down</span>
                <kbd className="px-2 py-1 bg-muted rounded">Page Down</kbd>
              </div>
            </>
          )}
          <div className="flex justify-between items-center">
            <span>Exit reader</span>
            <kbd className="px-2 py-1 bg-muted rounded">Esc</kbd>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}