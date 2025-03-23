"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, ToasterProps } from "sonner"
import { useEffect, useState } from "react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()
  const [position, setPosition] = useState<ToasterProps["position"]>("bottom-right")
  const [mounted, setMounted] = useState(false)
  
  // Only run on client-side
  useEffect(() => {
    setMounted(true)
    
    const handleResize = () => {
      // Consider devices smaller than 1024px as mobile/tablet
      if (window.innerWidth < 1024) {
        setPosition("top-center")
      } else {
        setPosition("bottom-right")
      }
    }

    // Set initial position
    handleResize()

    // Update on resize
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Don't access window during SSR
  const isMobile = mounted ? window.innerWidth < 640 : false
  
  if (!mounted) {
    return null // Return null on server-side
  }

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position={position}
      // Expand notifications on mobile for better readability
      expand={isMobile}
      // Add extra offset for mobile to avoid status bar
      offset={isMobile ? 16 : 32}
      style={{
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)",
      } as React.CSSProperties}
      {...props}
    />
  )
}

export { Toaster }
