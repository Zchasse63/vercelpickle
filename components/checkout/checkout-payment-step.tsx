"use client"

import React, { useState } from "react"
import { useGlobalState } from "@/hooks/use-global-state"
import { BuyerPaymentMethodSelector } from "@/components/buyer/buyer-payment-method-selector"
import { BuyerAddressSelector } from "@/components/buyer/buyer-address-selector"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CheckoutPaymentStepProps {
  onNext: () => void
  onBack: () => void
  className?: string
  testId?: string
}

/**
 * CheckoutPaymentStep component
 * 
 * A component for the payment step of the checkout process.
 */
export function CheckoutPaymentStep({
  onNext,
  onBack,
  className,
  testId,
}: CheckoutPaymentStepProps) {
  // Get global state
  const {
    checkout,
    setPaymentMethod,
    setBillingAddress,
    hasPaymentMethods,
    hasAddresses,
    addresses,
  } = useGlobalState()
  
  // Local state
  const [sameAsShipping, setSameAsShipping] = useState(true)
  
  // Local state for validation
  const [errors, setErrors] = useState<{
    paymentMethod?: string;
    billingAddress?: string;
  }>({})
  
  // Handle payment method selection
  const handlePaymentMethodSelected = (paymentMethodId: string) => {
    setPaymentMethod(paymentMethodId)
    
    // Clear payment method error if a payment method is selected
    if (errors.paymentMethod) {
      setErrors(prev => ({ ...prev, paymentMethod: undefined }))
    }
  }
  
  // Handle billing address selection
  const handleBillingAddressSelected = (addressId: string) => {
    setBillingAddress(addressId)
    
    // Clear billing address error if an address is selected
    if (errors.billingAddress) {
      setErrors(prev => ({ ...prev, billingAddress: undefined }))
    }
  }
  
  // Handle same as shipping checkbox change
  const handleSameAsShippingChange = (checked: boolean) => {
    setSameAsShipping(checked)
    
    if (checked && checkout.shippingAddressId) {
      // If same as shipping is checked, set billing address to shipping address
      setBillingAddress(checkout.shippingAddressId)
      
      // Clear billing address error if an address is selected
      if (errors.billingAddress) {
        setErrors(prev => ({ ...prev, billingAddress: undefined }))
      }
    } else {
      // If same as shipping is unchecked, clear billing address
      setBillingAddress(null)
    }
  }
  
  // Handle continue button click
  const handleContinue = () => {
    // Validate form
    const newErrors: typeof errors = {}
    
    if (!checkout.paymentMethodId) {
      newErrors.paymentMethod = "Please select a payment method"
    }
    
    if (!checkout.billingAddressId) {
      newErrors.billingAddress = "Please select a billing address"
    }
    
    // If there are errors, show them and don't proceed
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // If no errors, proceed to next step
    onNext()
  }
  
  // Effect to set billing address to shipping address when component mounts
  React.useEffect(() => {
    if (sameAsShipping && checkout.shippingAddressId) {
      setBillingAddress(checkout.shippingAddressId)
    }
  }, [sameAsShipping, checkout.shippingAddressId, setBillingAddress])
  
  return (
    <div className={cn("space-y-6", className)} data-testid={testId}>
      {/* Payment Method */}
      <Card data-testid={`${testId}-payment-method`}>
        <CardHeader>
          <CardTitle>Payment Method</CardTitle>
        </CardHeader>
        <CardContent>
          <BuyerPaymentMethodSelector
            onPaymentMethodSelected={handlePaymentMethodSelected}
            selectedPaymentMethodId={checkout.paymentMethodId || undefined}
            testId={`${testId}-payment-method-selector`}
          />
          
          {errors.paymentMethod && (
            <p className="text-destructive text-sm mt-2" data-testid={`${testId}-payment-method-error`}>
              {errors.paymentMethod}
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Billing Address */}
      <Card data-testid={`${testId}-billing-address`}>
        <CardHeader>
          <CardTitle>Billing Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="same-as-shipping"
              checked={sameAsShipping}
              onCheckedChange={handleSameAsShippingChange}
              data-testid={`${testId}-same-as-shipping`}
            />
            <Label htmlFor="same-as-shipping">
              Same as shipping address
            </Label>
          </div>
          
          {!sameAsShipping && (
            <div className="mt-4">
              <BuyerAddressSelector
                onAddressSelected={handleBillingAddressSelected}
                selectedAddressId={checkout.billingAddressId || undefined}
                testId={`${testId}-billing-address-selector`}
              />
              
              {errors.billingAddress && (
                <p className="text-destructive text-sm mt-2" data-testid={`${testId}-billing-address-error`}>
                  {errors.billingAddress}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={onBack}
          data-testid={`${testId}-back-button`}
        >
          Back to Shipping
        </Button>
        
        <Button 
          onClick={handleContinue}
          disabled={!hasPaymentMethods || !hasAddresses}
          data-testid={`${testId}-continue-button`}
        >
          Continue to Review
        </Button>
      </div>
    </div>
  )
}
