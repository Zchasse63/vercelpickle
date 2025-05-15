"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface ProfileFieldProps {
  label: string
  value?: string | React.ReactNode
  className?: string
  testId?: string
}

/**
 * ProfileField component
 * 
 * A component for displaying a field label and value in a profile view.
 */
export function ProfileField({
  label,
  value,
  className,
  testId,
}: ProfileFieldProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base" data-testid={testId}>
        {value || <span className="text-gray-400 italic">Not provided</span>}
      </p>
    </div>
  )
}

interface ProfileLinkFieldProps extends ProfileFieldProps {
  href?: string
}

/**
 * ProfileLinkField component
 * 
 * A component for displaying a field with a link value.
 */
export function ProfileLinkField({
  label,
  value,
  href,
  className,
  testId,
}: ProfileLinkFieldProps) {
  if (!value || !href) {
    return <ProfileField label={label} value={value} className={className} testId={testId} />
  }
  
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p className="text-base" data-testid={testId}>
        <a 
          href={href} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-blue-600 hover:underline"
        >
          {value}
        </a>
      </p>
    </div>
  )
}
