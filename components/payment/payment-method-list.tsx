"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { PaymentMethodCard, PaymentMethod } from "./payment-method-card"
import { AddPaymentMethodDialog } from "./payment-method-form-dialog"
import { PaymentFormData } from "./payment-method-form"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

interface PaymentMethodListProps {
  paymentMethods: PaymentMethod[]
  onAddPaymentMethod: (paymentMethod: PaymentFormData) => void
  onDeletePaymentMethod: (id: string) => void
  onSetDefaultPaymentMethod: (id: string) => void
  emptyMessage?: string
  className?: string
  testId?: string
}

/**
 * PaymentMethodList component
 * 
 * A component for displaying a list of payment methods with actions for adding, deleting, and setting as default.
 */
export function PaymentMethodList({
  paymentMethods,
  onAddPaymentMethod,
  onDeletePaymentMethod,
  onSetDefaultPaymentMethod,
  emptyMessage = "You don't have any payment methods yet.",
  className,
  testId,
}: PaymentMethodListProps) {
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
    <div className={cn("space-y-6", className)} data-testid={testId}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Payment Methods</h3>
        <AddPaymentMethodDialog
          onPaymentMethodAdded={handleAddPaymentMethod}
          testId={`${testId}-add-dialog`}
        >
          <Button 
            variant="outline" 
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
          <p className="text-gray-500">{emptyMessage}</p>
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
        <div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          data-testid={`${testId}-grid`}
        >
          {paymentMethods.map((paymentMethod) => (
            <PaymentMethodCard
              key={paymentMethod.id}
              paymentMethod={paymentMethod}
              onDelete={onDeletePaymentMethod}
              onSetDefault={onSetDefaultPaymentMethod}
              testId={`${testId}-card-${paymentMethod.id}`}
            />
          ))}
          
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center p-6">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <PlusCircle className="h-6 w-6 text-gray-600" />
                </div>
                <h3 className="text-lg font-medium">Add Payment Method</h3>
                <p className="text-center text-sm text-gray-500">Add a new credit card or other payment method.</p>
                <AddPaymentMethodDialog
                  onPaymentMethodAdded={handleAddPaymentMethod}
                  testId={`${testId}-card-add-dialog`}
                >
                  <Button 
                    className="mt-2" 
                    data-testid={`${testId}-card-add-button`}
                  >
                    Add Method
                  </Button>
                </AddPaymentMethodDialog>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
