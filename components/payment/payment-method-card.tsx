"use client"

import React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CreditCard, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface PaymentMethod {
  id: string
  type: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
  isDefault: boolean
}

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethod
  onDelete?: (id: string) => void
  onSetDefault?: (id: string) => void
  className?: string
  testId?: string
}

/**
 * PaymentMethodCard component
 * 
 * A component for displaying a payment method with actions for deleting and setting as default.
 */
export function PaymentMethodCard({
  paymentMethod,
  onDelete,
  onSetDefault,
  className,
  testId,
}: PaymentMethodCardProps) {
  // Get the appropriate card icon based on the brand
  const getCardIcon = () => {
    return <CreditCard className="h-5 w-5 text-gray-500" />
  }
  
  return (
    <Card 
      className={cn(paymentMethod.isDefault ? "border-green-500" : "", className)} 
      data-testid={testId || "payment-method-card"}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{paymentMethod.brand}</CardTitle>
          {getCardIcon()}
        </div>
        <CardDescription>
          {paymentMethod.isDefault && (
            <span 
              className="text-green-600 font-medium" 
              data-testid={`${testId}-default-badge`}
            >
              Default
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-lg font-mono">**** **** **** {paymentMethod.last4}</p>
          <p className="text-sm text-gray-500">
            Expires {paymentMethod.expMonth}/{paymentMethod.expYear}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        {onSetDefault && !paymentMethod.isDefault && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSetDefault(paymentMethod.id)}
            data-testid={`${testId}-set-default-button`}
          >
            Set as Default
          </Button>
        )}
        {onDelete && (
          paymentMethod.isDefault ? (
            <Button variant="ghost" size="sm" disabled>
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:text-red-600"
              onClick={() => onDelete(paymentMethod.id)}
              data-testid={`${testId}-delete-button`}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Remove
            </Button>
          )
        )}
      </CardFooter>
    </Card>
  )
}
