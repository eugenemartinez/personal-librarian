"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ModeToggleProps {
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
  className?: string
  iconSize?: number
}

export function ModeToggle({
  variant = "outline",
  size = "icon",
  className = "",
  iconSize = 1.2
}: ModeToggleProps) {
  const { setTheme } = useTheme()
  const iconClassName = `h-[${iconSize}rem] w-[${iconSize}rem]`

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size={size} className={className}>
          <Sun className={`${iconClassName} rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0`} />
          <Moon className={`absolute ${iconClassName} rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100`} />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem className="cursor-pointer" onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// This is a square version specifically for the homepage
export function SquareModeToggle() {
  return (
    <ModeToggle 
      variant="ghost" 
      className="rounded-md cursor-pointer" 
      iconSize={1.1}
    />
  )
}