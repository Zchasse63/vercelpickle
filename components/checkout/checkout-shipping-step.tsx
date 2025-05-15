"use client"

import React, { useState } from "react"
import { useGlobalState } from "@/hooks/use-global-state"
import { BuyerAddressSelector } from "@/components/buyer/buyer-address-selector"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"

interface CheckoutShippingStepProps {
  onNext: () => void
  className?: string
  testId?: string
}

/**
 * CheckoutShippingStep component
 * 
 * A component for the shipping step of the checkout process.
 */
export function CheckoutShippingStep({
  onNext,
  className,
  testId,
}: CheckoutShippingStepProps) {
  // Get global state
  const {
    checkout,
    setShippingAddress,
    setShippingMethod,
    setNotes,
    hasAddresses,
    selectedAddress,
  } = useGlobalState()
  
  // Local state for validation
  const [errors, setErrors] = useState<{
    address?: string;
    shippingMethod?: string;
  }>({})
  
  // Handle address selection
  const handleAddressSelected = (addressId: string) => {
    setShippingAddress(addressId)
    
    // Clear address error if an address is selected
    if (errors.address) {
      setErrors(prev => ({ ...prev, address: undefined }))
    }
  }
  
  // Handle shipping method selection
  const handleShippingMethodChange = (value: string) => {
    setShippingMethod(value as "standard" | "express" | "overnight")
    
    // Clear shipping method error if a method is selected
    if (errors.shippingMethod) {
      setErrors(prev => ({ ...prev, shippingMethod: undefined }))
    }
  }
  
  // Handle notes change
  const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value)
  }
  
  // Handle continue button click
  const handleContinue = () => {
    // Validate form
    const newErrors: typeof errors = {}
    
    if (!checkout.shippingAddressId) {
      newErrors.address = "Please select a shipping address"
    }
    
    if (!checkout.shippingMethod) {
      newErrors.shippingMethod = "Please select a shipping method"
    }
    
    // If there are errors, show them and don't proceed
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }
    
    // If no errors, proceed to next step
    onNext()
  }
  
  return (
    <div className={cn("space-y-6", className)} data-testid={testId}>
      {/* Shipping Address */}
      <Card data-testid={`${testId}-address`}>
        <CardHeader>
          <CardTitle>Shipping Address</CardTitle>
        </CardHeader>
        <CardContent>
          <BuyerAddressSelector
            onAddressSelected={handleAddressSelected}
            selectedAddressId={checkout.shippingAddressId || undefined}
            testId={`${testId}-address-selector`}
          />
          
          {errors.address && (
            <p className="text-destructive text-sm mt-2" data-testid={`${testId}-address-error`}>
              {errors.address}
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Shipping Method */}
      <Card data-testid={`${testId}-shipping-method`}>
        <CardHeader>
          <CardTitle>Shipping Method</CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup
            value={checkout.shippingMethod}
            onValueChange={handleShippingMethodChange}
            className="space-y-3"
            data-testid={`${testId}-shipping-method-options`}
          >
            <div className="flex items-start space-x-3 rounded-md border p-3">
              <RadioGroupItem 
                value="standard" 
                id="standard"
                data-testid={`${testId}-shipping-method-standard`}
              />
              <div className="flex-1 space-y-1">
                <Label htmlFor="standard" className="font-medium">
                  Standard Shipping
                </Label>
                <p className="text-sm text-muted-foreground">
                  Delivery in 5-7 business days
                </p>
                <p className="text-sm font-medium">$10.00</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 rounded-md border p-3">
              <RadioGroupItem 
                value="express" 
                id="express"
                data-testid={`${testId}-shipping-method-express`}
              />
              <div className="flex-1 space-y-1">
                <Label htmlFor="express" className="font-medium">
                  Express Shipping
                </Label>
                <p className="text-sm text-muted-foreground">
                  Delivery in 2-3 business days
                </p>
                <p className="text-sm font-medium">$20.00</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 rounded-md border p-3">
              <RadioGroupItem 
                value="overnight" 
                id="overnight"
                data-testid={`${testId}-shipping-method-overnight`}
              />
              <div className="flex-1 space-y-1">
                <Label htmlFor="overnight" className="font-medium">
                  Overnight Shipping
                </Label>
                <p className="text-sm text-muted-foreground">
                  Delivery next business day
                </p>
                <p className="text-sm font-medium">$30.00</p>
              </div>
            </div>
          </RadioGroup>
          
          {errors.shippingMethod && (
            <p className="text-destructive text-sm mt-2" data-testid={`${testId}-shipping-method-error`}>
              {errors.shippingMethod}
            </p>
          )}
        </CardContent>
      </Card>
      
      {/* Order Notes */}
      <Card data-testid={`${testId}-notes`}>
        <CardHeader>
          <CardTitle>Order Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            placeholder="Add any special instructions or notes about your order..."
            className="min-h-[100px]"
            value={checkout.notes}
            onChange={handleNotesChange}
            data-testid={`${testId}-notes-input`}
          />
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button 
          onClick={handleContinue}
          disabled={!hasAddresses}
          data-testid={`${testId}-continue-button`}
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  )
}
