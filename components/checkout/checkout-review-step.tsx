"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { useGlobalState } from "@/hooks/use-global-state"
import { useGlobalCart } from "@/hooks/use-global-cart"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { cn, formatPrice } from "@/lib/utils"
import { toast } from "@/components/ui/use-toast"
import { Loader2 } from "lucide-react"

interface CheckoutReviewStepProps {
  onBack: () => void
  className?: string
  testId?: string
}

/**
 * CheckoutReviewStep component
 * 
 * A component for the review step of the checkout process.
 */
export function CheckoutReviewStep({
  onBack,
  className,
  testId,
}: CheckoutReviewStepProps) {
  const router = useRouter()
  
  // Get global state
  const {
    checkout,
    addresses,
    paymentMethods,
    createOrder,
    cartItems,
    cartTotals,
  } = useGlobalState()
  
  // Get cart state
  const { emptyCart } = useGlobalCart()
  
  // Local state
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [termsError, setTermsError] = useState<string | null>(null)
  
  // Get selected address and payment method
  const shippingAddress = addresses.find(a => a.id === checkout.shippingAddressId)
  const billingAddress = addresses.find(a => a.id === checkout.billingAddressId)
  const paymentMethod = paymentMethods.find(p => p.id === checkout.paymentMethodId)
  
  // Handle terms checkbox change
  const handleTermsChange = (checked: boolean) => {
    setTermsAccepted(checked)
    
    // Clear terms error if terms are accepted
    if (checked && termsError) {
      setTermsError(null)
    }
  }
  
  // Handle place order button click
  const handlePlaceOrder = async () => {
    // Validate terms acceptance
    if (!termsAccepted) {
      setTermsError("You must accept the terms and conditions to place an order")
      return
    }
    
    // Validate that we have all required data
    if (!shippingAddress || !billingAddress || !paymentMethod || cartItems.length === 0) {
      toast({
        title: "Error",
        description: "Missing required information. Please go back and complete all steps.",
        variant: "destructive",
      })
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Create order
      const orderId = await createOrder(
        cartItems,
        shippingAddress,
        billingAddress,
        paymentMethod,
        checkout.shippingMethod,
        checkout.notes
      )
      
      // Empty cart
      await emptyCart()
      
      // Redirect to confirmation page
      router.push(`/checkout/confirmation?orderId=${orderId}`)
    } catch (error) {
      console.error("Error creating order:", error)
      
      toast({
        title: "Error",
        description: "There was an error placing your order. Please try again.",
        variant: "destructive",
      })
      
      setIsSubmitting(false)
    }
  }
  
  // Format shipping method for display
  const formatShippingMethod = (method: string) => {
    switch (method) {
      case "standard":
        return "Standard Shipping (5-7 business days)"
      case "express":
        return "Express Shipping (2-3 business days)"
      case "overnight":
        return "Overnight Shipping (next business day)"
      default:
        return method
    }
  }
  
  return (
    <div className={cn("space-y-6", className)} data-testid={testId}>
      {/* Shipping Information */}
      <Card data-testid={`${testId}-shipping-info`}>
        <CardHeader>
          <CardTitle>Shipping Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {shippingAddress ? (
            <div className="space-y-1" data-testid={`${testId}-shipping-address`}>
              <p className="font-medium">{shippingAddress.name}</p>
              <p>{shippingAddress.street}</p>
              {shippingAddress.street2 && <p>{shippingAddress.street2}</p>}
              <p>
                {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
              </p>
              <p>{shippingAddress.country}</p>
              {shippingAddress.phone && <p>{shippingAddress.phone}</p>}
            </div>
          ) : (
            <p className="text-muted-foreground">No shipping address selected</p>
          )}
          
          <Separator />
          
          <div data-testid={`${testId}-shipping-method`}>
            <p className="font-medium">Shipping Method</p>
            <p>{formatShippingMethod(checkout.shippingMethod)}</p>
          </div>
          
          {checkout.notes && (
            <>
              <Separator />
              
              <div data-testid={`${testId}-order-notes`}>
                <p className="font-medium">Order Notes</p>
                <p className="text-muted-foreground">{checkout.notes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Payment Information */}
      <Card data-testid={`${testId}-payment-info`}>
        <CardHeader>
          <CardTitle>Payment Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {paymentMethod ? (
            <div className="space-y-1" data-testid={`${testId}-payment-method`}>
              <p className="font-medium">{paymentMethod.brand}</p>
              <p>**** **** **** {paymentMethod.last4}</p>
              <p>Expires {paymentMethod.expMonth}/{paymentMethod.expYear}</p>
            </div>
          ) : (
            <p className="text-muted-foreground">No payment method selected</p>
          )}
          
          <Separator />
          
          <div data-testid={`${testId}-billing-address`}>
            <p className="font-medium">Billing Address</p>
            {billingAddress ? (
              <div className="space-y-1">
                <p>{billingAddress.name}</p>
                <p>{billingAddress.street}</p>
                {billingAddress.street2 && <p>{billingAddress.street2}</p>}
                <p>
                  {billingAddress.city}, {billingAddress.state} {billingAddress.zip}
                </p>
                <p>{billingAddress.country}</p>
                {billingAddress.phone && <p>{billingAddress.phone}</p>}
              </div>
            ) : (
              <p className="text-muted-foreground">No billing address selected</p>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Order Summary */}
      <Card data-testid={`${testId}-order-summary`}>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span data-testid={`${testId}-total`}>
              {formatPrice(cartTotals.total)}
            </span>
          </div>
        </CardContent>
      </Card>
      
      {/* Terms and Conditions */}
      <div className="space-y-2" data-testid={`${testId}-terms`}>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="terms"
            checked={termsAccepted}
            onCheckedChange={handleTermsChange}
            data-testid={`${testId}-terms-checkbox`}
          />
          <Label htmlFor="terms">
            I agree to the terms and conditions and privacy policy
          </Label>
        </div>
        
        {termsError && (
          <p className="text-destructive text-sm" data-testid={`${testId}-terms-error`}>
            {termsError}
          </p>
        )}
      </div>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          disabled={isSubmitting}
          data-testid={`${testId}-back-button`}
        >
          Back to Payment
        </Button>
        
        <Button 
          onClick={handlePlaceOrder}
          disabled={isSubmitting}
          data-testid={`${testId}-place-order-button`}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Place Order"
          )}
        </Button>
      </div>
    </div>
  )
}
