"use client"

import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { useCurrentUser, useUserPaymentMethods } from "@/lib/data/exports"
import { PaymentMethodList, PaymentFormData } from "@/components/payment"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

/**
 * BuyerPaymentMethodManager component
 * 
 * A component for managing a buyer's payment methods.
 */
export function BuyerPaymentMethodManager({ testId }: { testId?: string }) {
  // Get the current user from our data access layer
  const { userId } = useCurrentUser()
  
  // Fetch the user's payment methods using our data access layer
  const { data: paymentMethods = [], isLoading } = useUserPaymentMethods(userId)
  
  // State for optimistic updates
  const [optimisticPaymentMethods, setOptimisticPaymentMethods] = useState(paymentMethods)
  
  // State for delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [paymentMethodToDelete, setPaymentMethodToDelete] = useState<string | null>(null)
  
  // Update optimistic payment methods when the data is loaded
  if (paymentMethods.length > 0 && optimisticPaymentMethods.length === 0) {
    setOptimisticPaymentMethods(paymentMethods)
  }
  
  // Handle adding a new payment method
  const handleAddPaymentMethod = async (formData: PaymentFormData) => {
    if (!userId) return
    
    try {
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
      
      // Generate a temporary ID for optimistic updates
      const tempId = `temp-${Date.now()}`
      
      // Create the new payment method object
      const newPaymentMethod = {
        id: tempId,
        type: 'Credit Card',
        brand,
        last4,
        expMonth,
        expYear: expYear < 100 ? 2000 + expYear : expYear,
        isDefault: formData.isDefault
      }
      
      // If this is the first payment method or it's set as default, update other payment methods
      if (optimisticPaymentMethods.length === 0 || formData.isDefault) {
        // Update optimistic payment methods
        setOptimisticPaymentMethods(prev => 
          prev.map(p => ({ ...p, isDefault: false })).concat([newPaymentMethod])
        )
      } else {
        // Add the new payment method to the list
        setOptimisticPaymentMethods(prev => [...prev, newPaymentMethod])
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success toast
      toast({
        title: "Payment method added",
        description: "Your payment method has been added successfully.",
      })
    } catch (error) {
      // Show error toast
      toast({
        title: "Failed to add payment method",
        description: "There was an error adding your payment method. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  // Handle deleting a payment method
  const handleDeleteClick = (id: string) => {
    setPaymentMethodToDelete(id)
    setDeleteDialogOpen(true)
  }
  
  const confirmDelete = async () => {
    if (!paymentMethodToDelete || !userId) return
    
    try {
      // Update optimistic payment methods
      setOptimisticPaymentMethods(prev => prev.filter(p => p.id !== paymentMethodToDelete))
      
      // Close the dialog
      setDeleteDialogOpen(false)
      setPaymentMethodToDelete(null)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success toast
      toast({
        title: "Payment method removed",
        description: "Your payment method has been removed successfully.",
      })
    } catch (error) {
      // Show error toast
      toast({
        title: "Failed to remove payment method",
        description: "There was an error removing your payment method. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  // Handle setting a payment method as default
  const handleSetDefaultPaymentMethod = async (id: string) => {
    if (!userId) return
    
    try {
      // Update optimistic payment methods
      setOptimisticPaymentMethods(prev => 
        prev.map(p => ({
          ...p,
          isDefault: p.id === id,
        }))
      )
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success toast
      toast({
        title: "Default payment method updated",
        description: "Your default payment method has been updated successfully.",
      })
    } catch (error) {
      // Show error toast
      toast({
        title: "Failed to update default payment method",
        description: "There was an error updating your default payment method. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  // Show loading state
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4" data-testid={`${testId}-loading`}>
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
        <div className="h-40 bg-gray-200 rounded"></div>
      </div>
    )
  }
  
  return (
    <>
      <PaymentMethodList
        paymentMethods={optimisticPaymentMethods}
        onAddPaymentMethod={handleAddPaymentMethod}
        onDeletePaymentMethod={handleDeleteClick}
        onSetDefaultPaymentMethod={handleSetDefaultPaymentMethod}
        testId={testId}
      />
      
      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this payment method. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
              data-testid={`${testId}-confirm-delete-button`}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
