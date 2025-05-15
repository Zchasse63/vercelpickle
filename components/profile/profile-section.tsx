"use client"

import React from "react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface ProfileSectionProps {
  title?: string
  description?: string
  children: React.ReactNode
  className?: string
  testId?: string
  withSeparator?: boolean
}

/**
 * ProfileSection component
 * 
 * A component for organizing profile content into sections with optional titles and separators.
 */
export function ProfileSection({
  title,
  description,
  children,
  className,
  testId,
  withSeparator = false,
}: ProfileSectionProps) {
  return (
    <div className={cn("space-y-4", className)} data-testid={testId}>
      {withSeparator && <Separator className="my-6" />}
      
      {(title || description) && (
        <div className="space-y-1">
          {title && <h3 className="text-lg font-medium">{title}</h3>}
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>
      )}
      
      <div className="space-y-4">
        {children}
      </div>
    </div>
  )
}
