"use client"

import React, { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { PlusCircle, CreditCard } from "lucide-react"
import { Label } from "@/components/ui/label"
import { PaymentMethod } from "./payment-method-card"
import { AddPaymentMethodDialog } from "./payment-method-form-dialog"
import { PaymentFormData } from "./payment-method-form"
import { cn } from "@/lib/utils"

interface PaymentMethodSelectorProps {
  paymentMethods: PaymentMethod[]
  selectedPaymentMethodId?: string
  onPaymentMethodSelected: (paymentMethodId: string) => void
  onAddPaymentMethod: (paymentMethod: PaymentFormData) => void
  className?: string
  testId?: string
}

/**
 * PaymentMethodSelector component
 * 
 * A component for selecting a payment method from a list of payment methods.
 */
export function PaymentMethodSelector({
  paymentMethods,
  selectedPaymentMethodId,
  onPaymentMethodSelected,
  onAddPaymentMethod,
  className,
  testId,
}: PaymentMethodSelectorProps) {
  // If no payment method is selected, default to the default payment method
  const [selected, setSelected] = useState<string>(
    selectedPaymentMethodId || paymentMethods.find(p => p.isDefault)?.id || ""
  )
  
  const handleChange = (value: string) => {
    setSelected(value)
    onPaymentMethodSelected(value)
  }
  
  // Process the form data into a payment method object
  const handleAddPaymentMethod = (formData: PaymentFormData) => {
    // Extract card details
    const cardNumber = formData.cardNumber.replace(/\s/g, '');
    const last4 = cardNumber.slice(-4);
    const [expMonth, expYear] = formData.expiry.split('/').map(part => parseInt(part, 10));
    
    // Determine card brand based on first digit
    let brand = 'Unknown';
    if (cardNumber.startsWith('4')) brand = 'Visa';
    else if (cardNumber.startsWith('5')) brand = 'Mastercard';
    else if (cardNumber.startsWith('3')) brand = 'American Express';
    else if (cardNumber.startsWith('6')) brand = 'Discover';
    
    // Create payment method object
    const paymentMethod = {
      id: `pm_${Math.random().toString(36).substring(2, 15)}`,
      type: 'Credit Card',
      brand,
      last4,
      expMonth,
      expYear: expYear < 100 ? 2000 + expYear : expYear,
      isDefault: formData.isDefault
    };
    
    // Call the callback
    onAddPaymentMethod(formData);
  };
  
  return (
    <div className={cn("space-y-4", className)} data-testid={testId}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Select Payment Method</h3>
        <AddPaymentMethodDialog
          onPaymentMethodAdded={handleAddPaymentMethod}
          testId={`${testId}-add-dialog`}
        >
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-1"
            data-testid={`${testId}-add-button`}
          >
            <PlusCircle className="h-4 w-4" />
            Add Payment Method
          </Button>
        </AddPaymentMethodDialog>
      </div>
      
      {paymentMethods.length === 0 ? (
        <div 
          className="text-center p-6 border rounded-md bg-gray-50"
          data-testid={`${testId}-empty`}
        >
          <p className="text-gray-500">You don't have any payment methods yet.</p>
          <AddPaymentMethodDialog
            onPaymentMethodAdded={handleAddPaymentMethod}
            testId={`${testId}-empty-add-dialog`}
          >
            <Button 
              variant="outline" 
              className="mt-4 gap-1"
              data-testid={`${testId}-empty-add-button`}
            >
              <PlusCircle className="h-4 w-4" />
              Add Your First Payment Method
            </Button>
          </AddPaymentMethodDialog>
        </div>
      ) : (
        <RadioGroup 
          value={selected} 
          onValueChange={handleChange}
          className="space-y-3"
          data-testid={`${testId}-radio-group`}
        >
          {paymentMethods.map((paymentMethod) => (
            <div
              key={paymentMethod.id}
              className={cn(
                "flex items-start space-x-3 rounded-md border p-3",
                selected === paymentMethod.id && "border-primary bg-primary/5"
              )}
              data-testid={`${testId}-option-${paymentMethod.id}`}
            >
              <RadioGroupItem 
                value={paymentMethod.id} 
                id={`payment-${paymentMethod.id}`}
                data-testid={`${testId}-radio-${paymentMethod.id}`}
              />
              <div className="flex-1 space-y-1">
                <Label 
                  htmlFor={`payment-${paymentMethod.id}`}
                  className="flex items-center gap-2 font-medium"
                >
                  <CreditCard className="h-4 w-4" />
                  {paymentMethod.brand}
                  {paymentMethod.isDefault && (
                    <span 
                      className="ml-2 text-sm text-green-600 font-normal"
                      data-testid={`${testId}-default-badge-${paymentMethod.id}`}
                    >
                      Default
                    </span>
                  )}
                </Label>
                <div className="text-sm text-gray-500">
                  <p className="font-mono">**** **** **** {paymentMethod.last4}</p>
                  <p>Expires {paymentMethod.expMonth}/{paymentMethod.expYear}</p>
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  )
}
