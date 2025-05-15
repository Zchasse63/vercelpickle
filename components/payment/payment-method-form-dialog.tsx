"use client"

import React, { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { PaymentMethodForm, PaymentFormData } from "./payment-method-form"

interface PaymentMethodFormDialogProps {
  children: React.ReactNode
  title?: string
  description?: string
  initialData?: Partial<PaymentFormData>
  onSubmit: (data: PaymentFormData) => void
  testId?: string
}

/**
 * PaymentMethodFormDialog component
 * 
 * A dialog for adding or editing a payment method.
 */
export function PaymentMethodFormDialog({
  children,
  title,
  description,
  initialData,
  onSubmit,
  testId,
}: PaymentMethodFormDialogProps) {
  const [open, setOpen] = useState(false)
  
  const handleSubmit = (data: PaymentFormData) => {
    onSubmit(data)
    
    // Close the dialog after a short delay
    setTimeout(() => {
      setOpen(false)
    }, 1500)
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title || "Add Payment Method"}</DialogTitle>
          <DialogDescription>
            {description || "Enter your card details to add a new payment method."}
          </DialogDescription>
        </DialogHeader>
        
        <PaymentMethodForm
          initialData={initialData}
          onSubmit={handleSubmit}
          testId={`${testId}-form`}
        />
        
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            data-testid={`${testId}-cancel-button`}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/**
 * AddPaymentMethodDialog component
 * 
 * A specialized dialog for adding a new payment method.
 */
export function AddPaymentMethodDialog({
  children,
  onPaymentMethodAdded,
  testId,
}: {
  children: React.ReactNode
  onPaymentMethodAdded: (paymentMethod: PaymentFormData) => void
  testId?: string
}) {
  return (
    <PaymentMethodFormDialog
      title="Add Payment Method"
      description="Enter your card details to add a new payment method."
      onSubmit={onPaymentMethodAdded}
      testId={testId || "add-payment-dialog"}
    >
      {children}
    </PaymentMethodFormDialog>
  )
}
