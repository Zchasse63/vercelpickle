"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type OrderStatusType = 
  | "pending" 
  | "processing" 
  | "shipped" 
  | "delivered" 
  | "cancelled"

interface OrderStatusProps {
  status: OrderStatusType
  className?: string
  testId?: string
}

/**
 * OrderStatus component
 * 
 * A component for displaying order status badges with appropriate styling.
 */
export function OrderStatus({
  status,
  className,
  testId,
}: OrderStatusProps) {
  // Define variant based on status
  const variant = 
    status === "delivered" ? "success" :
    status === "shipped" ? "default" :
    status === "processing" ? "outline" :
    status === "pending" ? "secondary" :
    "destructive"
  
  // Format status for display
  const formattedStatus = status.charAt(0).toUpperCase() + status.slice(1)
  
  return (
    <Badge 
      variant={variant as any} 
      className={cn(className)}
      data-testid={testId}
    >
      {formattedStatus}
    </Badge>
  )
}
