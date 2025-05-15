"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface ProfileLayoutProps {
  children: React.ReactNode
  sidebar?: React.ReactNode
  header?: React.ReactNode
  className?: string
  testId?: string
}

/**
 * ProfileLayout component
 * 
 * A component for creating consistent profile page layouts with optional sidebar and header.
 */
export function ProfileLayout({
  children,
  sidebar,
  header,
  className,
  testId,
}: ProfileLayoutProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} data-testid={testId}>
      {header && (
        <div className="flex flex-col gap-2" data-testid={`${testId}-header`}>
          {header}
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-6">
        {sidebar && (
          <div className="lg:w-1/4" data-testid={`${testId}-sidebar`}>
            {sidebar}
          </div>
        )}
        
        <div className={cn("flex-1", { "lg:w-3/4": sidebar })} data-testid={`${testId}-content`}>
          {children}
        </div>
      </div>
    </div>
  )
}
