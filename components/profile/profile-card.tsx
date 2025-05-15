"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ProfileCardProps {
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  isEditing?: boolean
  onEdit?: () => void
  onCancel?: () => void
  onSave?: () => void
  isLoading?: boolean
  className?: string
  testId?: string
}

/**
 * ProfileCard component
 * 
 * A reusable card component for profile sections with standardized header, content, and footer.
 */
export function ProfileCard({
  title,
  description,
  children,
  footer,
  isEditing = false,
  onEdit,
  onCancel,
  onSave,
  isLoading = false,
  className,
  testId,
}: ProfileCardProps) {
  return (
    <Card className={cn("", className)} data-testid={testId}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle>{title}</CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>
        {onEdit && !isEditing && (
          <Button 
            onClick={onEdit} 
            variant="outline" 
            size="sm"
            data-testid={`${testId}-edit-button`}
          >
            Edit
          </Button>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        {children}
      </CardContent>
      {(footer || (isEditing && (onCancel || onSave))) && (
        <div className="flex justify-end gap-2 p-6 pt-0">
          {footer}
          {isEditing && (
            <>
              {onCancel && (
                <Button 
                  onClick={onCancel} 
                  variant="outline" 
                  disabled={isLoading}
                  data-testid={`${testId}-cancel-button`}
                >
                  Cancel
                </Button>
              )}
              {onSave && (
                <Button 
                  onClick={onSave} 
                  disabled={isLoading}
                  data-testid={`${testId}-save-button`}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </>
          )}
        </div>
      )}
    </Card>
  )
}
