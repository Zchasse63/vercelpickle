"use client"

import React from "react"
import Image from "next/image"
import Link from "next/link"
import { formatPrice } from "@/lib/utils"
import { useGlobalCart } from "@/hooks/use-global-cart"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart } from "lucide-react"

interface CheckoutOrderSummaryProps {
  showDiscountForm?: boolean
  showCheckoutButton?: boolean
  className?: string
  testId?: string
}

/**
 * CheckoutOrderSummary component
 * 
 * A component to display the order summary during checkout.
 */
export function CheckoutOrderSummary({
  showDiscountForm = false,
  showCheckoutButton = false,
  className,
  testId,
}: CheckoutOrderSummaryProps) {
  const { 
    items: cartItems, 
    totals: cartTotals, 
    isLoading,
    isEmpty
  } = useGlobalCart()
  
  // If loading, show loading state
  if (isLoading) {
    return (
      <Card className={className} data-testid={`${testId}-loading`}>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-16 w-16 rounded-md" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            ))}
          </div>
          <Separator />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <Separator />
          <Skeleton className="h-6 w-full" />
        </CardContent>
      </Card>
    )
  }
  
  // If cart is empty, show empty state
  if (isEmpty) {
    return (
      <Card className={className} data-testid={`${testId}-empty`}>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <ShoppingCart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Your cart is empty</p>
          <Button asChild>
            <Link href="/marketplace">Browse Products</Link>
          </Button>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className={className} data-testid={testId}>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Order Items */}
        <div className="space-y-4" data-testid={`${testId}-items`}>
          {cartItems.map((item) => (
            <div 
              key={item.id} 
              className="flex gap-4"
              data-testid={`${testId}-item-${item.id}`}
            >
              <div className="relative h-16 w-16 overflow-hidden rounded-md bg-muted">
                <Image
                  src={item.product?.images?.[0] || "/placeholder.svg"}
                  alt={item.product?.name || "Product"}
                  fill
                  className="object-cover"
                  data-testid={`${testId}-item-image-${item.id}`}
                />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <Link
                    href={`/marketplace/products/${item.productId}`}
                    className="font-medium hover:underline"
                    data-testid={`${testId}-item-name-${item.id}`}
                  >
                    {item.product?.name}
                  </Link>
                  <div 
                    className="font-medium"
                    data-testid={`${testId}-item-total-${item.id}`}
                  >
                    {formatPrice((item.product?.price || 0) * item.quantity)}
                  </div>
                </div>
                <div className="mt-1 text-sm text-muted-foreground">
                  <span data-testid={`${testId}-item-quantity-${item.id}`}>
                    Qty: {item.quantity}
                  </span>
                  <span className="mx-2">•</span>
                  <span data-testid={`${testId}-item-price-${item.id}`}>
                    {formatPrice(item.product?.price || 0)} each
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Discount Code */}
        {showDiscountForm && (
          <div className="flex gap-2" data-testid={`${testId}-discount`}>
            <Input 
              placeholder="Discount code" 
              className="flex-1"
              data-testid={`${testId}-discount-input`}
            />
            <Button 
              variant="outline"
              data-testid={`${testId}-discount-button`}
            >
              Apply
            </Button>
          </div>
        )}
        
        <Separator />
        
        {/* Order Totals */}
        <div className="space-y-1.5" data-testid={`${testId}-totals`}>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span data-testid={`${testId}-subtotal`}>
              {formatPrice(cartTotals.subtotal)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span data-testid={`${testId}-shipping`}>
              {formatPrice(cartTotals.shipping)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax</span>
            <span data-testid={`${testId}-tax`}>
              {formatPrice(cartTotals.tax)}
            </span>
          </div>
        </div>
        
        <Separator />
        
        {/* Total */}
        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span data-testid={`${testId}-total`}>
            {formatPrice(cartTotals.total)}
          </span>
        </div>
      </CardContent>
      
      {/* Checkout Button */}
      {showCheckoutButton && (
        <CardFooter>
          <Button 
            className="w-full"
            asChild
            data-testid={`${testId}-checkout-button`}
          >
            <Link href="/checkout">
              Proceed to Checkout
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
