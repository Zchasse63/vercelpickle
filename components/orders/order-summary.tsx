"use client"

import React from "react"
import { Separator } from "@/components/ui/separator"
import { formatPrice } from "@/lib/utils"
import { Order } from "@/lib/store/order-store"

interface OrderSummaryProps {
  order: Order
  className?: string
  testId?: string
}

/**
 * OrderSummary component
 * 
 * A component for displaying order summary information.
 */
export function OrderSummary({
  order,
  className,
  testId,
}: OrderSummaryProps) {
  return (
    <div className={className} data-testid={testId}>
      <div className="space-y-4">
        <div className="flex justify-between" data-testid={`${testId}-subtotal`}>
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatPrice(order.subtotal)}</span>
        </div>
        <div className="flex justify-between" data-testid={`${testId}-shipping`}>
          <span className="text-muted-foreground">Shipping</span>
          <span>{formatPrice(order.shipping)}</span>
        </div>
        <div className="flex justify-between" data-testid={`${testId}-tax`}>
          <span className="text-muted-foreground">Tax</span>
          <span>{formatPrice(order.tax)}</span>
        </div>
        <Separator />
        <div className="flex justify-between font-medium" data-testid={`${testId}-total`}>
          <span>Total</span>
          <span>{formatPrice(order.total)}</span>
        </div>
      </div>
    </div>
  )
}
