"use client"

import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProfileAvatarProps {
  src?: string
  alt?: string
  initials?: string
  size?: "sm" | "md" | "lg" | "xl"
  onChangeAvatar?: () => void
  className?: string
  testId?: string
}

/**
 * ProfileAvatar component
 * 
 * A component for displaying a user's avatar with an optional change button.
 */
export function ProfileAvatar({
  src = "/placeholder.svg",
  alt = "User",
  initials = "",
  size = "lg",
  onChangeAvatar,
  className,
  testId,
}: ProfileAvatarProps) {
  // Size mappings
  const sizeClasses = {
    sm: "h-10 w-10",
    md: "h-16 w-16",
    lg: "h-24 w-24",
    xl: "h-32 w-32",
  }
  
  // Button size mappings
  const buttonSizes = {
    sm: "xs",
    md: "sm",
    lg: "sm",
    xl: "default",
  } as const
  
  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <Avatar className={cn(sizeClasses[size])} data-testid={testId}>
        <AvatarImage 
          src={`${src}${src.includes('?') ? '&' : '?'}height=${size === 'xl' ? 128 : size === 'lg' ? 96 : size === 'md' ? 64 : 40}&width=${size === 'xl' ? 128 : size === 'lg' ? 96 : size === 'md' ? 64 : 40}`} 
          alt={alt} 
        />
        <AvatarFallback>{initials}</AvatarFallback>
      </Avatar>
      {onChangeAvatar && (
        <Button 
          variant="outline" 
          size={buttonSizes[size]} 
          onClick={onChangeAvatar}
          data-testid={`${testId}-change-button`}
        >
          Change Avatar
        </Button>
      )}
    </div>
  )
}
