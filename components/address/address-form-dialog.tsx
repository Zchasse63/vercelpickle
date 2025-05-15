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
import { AddressForm, AddressFormData } from "./address-form"
import { Address } from "./address-card"

interface AddressFormDialogProps {
  children: React.ReactNode
  title?: string
  description?: string
  initialData?: Partial<AddressFormData>
  onSubmit: (data: AddressFormData) => void
  isEditing?: boolean
  testId?: string
}

/**
 * AddressFormDialog component
 * 
 * A dialog for adding or editing an address.
 */
export function AddressFormDialog({
  children,
  title,
  description,
  initialData,
  onSubmit,
  isEditing = false,
  testId,
}: AddressFormDialogProps) {
  const [open, setOpen] = useState(false)
  
  const handleSubmit = (data: AddressFormData) => {
    onSubmit(data)
    
    // Close the dialog after a short delay
    setTimeout(() => {
      setOpen(false)
    }, 1500)
  }
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{title || (isEditing ? "Edit Address" : "Add Shipping Address")}</DialogTitle>
          <DialogDescription>
            {description || (isEditing 
              ? "Update your shipping address details." 
              : "Enter your shipping address details.")}
          </DialogDescription>
        </DialogHeader>
        
        <AddressForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isEditing={isEditing}
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
 * AddAddressDialog component
 * 
 * A specialized dialog for adding a new address.
 */
export function AddAddressDialog({
  children,
  onAddressAdded,
  testId,
}: {
  children: React.ReactNode
  onAddressAdded: (address: AddressFormData) => void
  testId?: string
}) {
  return (
    <AddressFormDialog
      title="Add Shipping Address"
      description="Enter your shipping address details."
      onSubmit={onAddressAdded}
      testId={testId || "add-address-dialog"}
    >
      {children}
    </AddressFormDialog>
  )
}

/**
 * EditAddressDialog component
 * 
 * A specialized dialog for editing an existing address.
 */
export function EditAddressDialog({
  children,
  address,
  onAddressUpdated,
  testId,
}: {
  children: React.ReactNode
  address: Address
  onAddressUpdated: (address: AddressFormData) => void
  testId?: string
}) {
  return (
    <AddressFormDialog
      title="Edit Shipping Address"
      description="Update your shipping address details."
      initialData={address}
      onSubmit={onAddressUpdated}
      isEditing={true}
      testId={testId || "edit-address-dialog"}
    >
      {children}
    </AddressFormDialog>
  )
}
