"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useGlobalState } from "@/hooks/use-global-state"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn, formatPrice, formatDate } from "@/lib/utils"
import { CheckCircle, Loader2 } from "lucide-react"

interface CheckoutConfirmationProps {
  className?: string
  testId?: string
}

/**
 * CheckoutConfirmation component
 * 
 * A component for the confirmation step of the checkout process.
 */
export function CheckoutConfirmation({
  className,
  testId,
}: CheckoutConfirmationProps) {
  const searchParams = useSearchParams()
  
  // Get order ID from URL
  const orderId = searchParams.get("orderId")
  
  // Get global state
  const { getOrder, currentOrder, isLoading } = useGlobalState()
  
  // Local state
  const [error, setError] = useState<string | null>(null)
  
  // Load order details
  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setError("No order ID provided")
        return
      }
      
      try {
        await getOrder(orderId)
      } catch (err) {
        console.error("Error loading order:", err)
        setError("Failed to load order details")
      }
    }
    
    loadOrder()
  }, [orderId, getOrder])
  
  // If loading, show loading state
  if (isLoading) {
    return (
      <div className={cn("text-center py-12", className)} data-testid={`${testId}-loading`}>
        <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-2xl font-bold mb-2">Loading Order Details</h2>
        <p className="text-muted-foreground">Please wait while we load your order details...</p>
      </div>
    )
  }
  
  // If error, show error state
  if (error) {
    return (
      <div className={cn("text-center py-12", className)} data-testid={`${testId}-error`}>
        <h2 className="text-2xl font-bold mb-2">Error</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Button asChild>
          <Link href="/marketplace">Continue Shopping</Link>
        </Button>
      </div>
    )
  }
  
  // If no order, show not found state
  if (!currentOrder) {
    return (
      <div className={cn("text-center py-12", className)} data-testid={`${testId}-not-found`}>
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find the order you're looking for.</p>
        <Button asChild>
          <Link href="/marketplace">Continue Shopping</Link>
        </Button>
      </div>
    )
  }
  
  return (
    <div className={cn("space-y-6", className)} data-testid={testId}>
      {/* Confirmation Header */}
      <div className="text-center py-8" data-testid={`${testId}-header`}>
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-3xl font-bold mb-2">Order Confirmed!</h2>
        <p className="text-muted-foreground mb-2">
          Thank you for your order. We've received your payment and will process your order shortly.
        </p>
        <p className="font-medium">
          Order #: <span data-testid={`${testId}-order-id`}>{currentOrder.id}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          Placed on {formatDate(new Date(currentOrder.createdAt))}
        </p>
      </div>
      
      {/* Order Details */}
      <Card data-testid={`${testId}-order-details`}>
        <CardHeader>
          <CardTitle>Order Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Order Items */}
          <div className="space-y-4" data-testid={`${testId}-order-items`}>
            <h3 className="font-medium">Items</h3>
            {currentOrder.items.map((item, index) => (
              <div 
                key={index} 
                className="flex justify-between"
                data-testid={`${testId}-order-item-${index}`}
              >
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-medium">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          
          <Separator />
          
          {/* Order Totals */}
          <div className="space-y-1.5" data-testid={`${testId}-order-totals`}>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Subtotal</span>
              <span>{formatPrice(currentOrder.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Shipping</span>
              <span>{formatPrice(currentOrder.shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Tax</span>
              <span>{formatPrice(currentOrder.tax)}</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatPrice(currentOrder.total)}</span>
          </div>
        </CardContent>
      </Card>
      
      {/* Shipping Information */}
      <Card data-testid={`${testId}-shipping-info`}>
        <CardHeader>
          <CardTitle>Shipping Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1" data-testid={`${testId}-shipping-address`}>
            <p className="font-medium">{currentOrder.shippingAddress.name}</p>
            <p>{currentOrder.shippingAddress.street}</p>
            {currentOrder.shippingAddress.street2 && <p>{currentOrder.shippingAddress.street2}</p>}
            <p>
              {currentOrder.shippingAddress.city}, {currentOrder.shippingAddress.state} {currentOrder.shippingAddress.zip}
            </p>
            <p>{currentOrder.shippingAddress.country}</p>
            {currentOrder.shippingAddress.phone && <p>{currentOrder.shippingAddress.phone}</p>}
          </div>
        </CardContent>
      </Card>
      
      {/* Payment Information */}
      <Card data-testid={`${testId}-payment-info`}>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1" data-testid={`${testId}-payment-method`}>
            <p className="font-medium">{currentOrder.paymentMethod.brand}</p>
            <p>**** **** **** {currentOrder.paymentMethod.last4}</p>
            <p>
              Status: <span className="font-medium capitalize">{currentOrder.paymentStatus}</span>
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-center space-x-4">
        <Button 
          variant="outline" 
          asChild
          data-testid={`${testId}-view-orders-button`}
        >
          <Link href="/buyer/orders">View All Orders</Link>
        </Button>
        
        <Button 
          asChild
          data-testid={`${testId}-continue-shopping-button`}
        >
          <Link href="/marketplace">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}
