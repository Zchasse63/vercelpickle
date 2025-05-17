import * as React from "react"
import { cn } from "@/lib/utils"

// Type for container size
type ContainerSize = "sm" | "md" | "lg" | "xl" | "full" | "fluid"

// Type for container padding
type ContainerPadding = "none" | "sm" | "md" | "lg" | "xl"

// Props for Container component
interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize
  padding?: ContainerPadding
  centered?: boolean
  className?: string
  children: React.ReactNode
}

// Helper function to get size classes
const getSizeClasses = (size?: ContainerSize): string => {
  switch (size) {
    case "sm": return "max-w-screen-sm"
    case "md": return "max-w-screen-md"
    case "lg": return "max-w-screen-lg"
    case "xl": return "max-w-screen-xl"
    case "full": return "max-w-full"
    case "fluid": return "w-full"
    default: return "max-w-screen-xl" // Default to xl
  }
}

// Helper function to get padding classes
const getPaddingClasses = (padding?: ContainerPadding): string => {
  switch (padding) {
    case "none": return "px-0"
    case "sm": return "px-2 md:px-4"
    case "lg": return "px-6 md:px-8"
    case "xl": return "px-8 md:px-12"
    default: return "px-4 md:px-6" // Default to md
  }
}

/**
 * Container component for creating responsive containers
 */
export function Container({
  size,
  padding,
  centered = true,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <div
      className={cn(
        "container",
        getSizeClasses(size),
        getPaddingClasses(padding),
        centered && "mx-auto",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
