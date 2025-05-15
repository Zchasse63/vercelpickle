"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { AddressCard, Address } from "./address-card"
import { AddAddressDialog, EditAddressDialog } from "./address-form-dialog"
import { AddressFormData } from "./address-form"
import { cn } from "@/lib/utils"

interface AddressListProps {
  addresses: Address[]
  onAddAddress: (address: AddressFormData) => void
  onUpdateAddress: (id: string, address: AddressFormData) => void
  onDeleteAddress: (id: string) => void
  onSetDefaultAddress: (id: string) => void
  emptyMessage?: string
  className?: string
  testId?: string
}

/**
 * AddressList component
 * 
 * A component for displaying a list of addresses with actions for adding, editing, deleting, and setting as default.
 */
export function AddressList({
  addresses,
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefaultAddress,
  emptyMessage = "You don't have any addresses yet.",
  className,
  testId,
}: AddressListProps) {
  return (
    <div className={cn("space-y-6", className)} data-testid={testId}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Your Addresses</h3>
        <AddAddressDialog
          onAddressAdded={onAddAddress}
          testId={`${testId}-add-dialog`}
        >
          <Button 
            variant="outline" 
            className="gap-1"
            data-testid={`${testId}-add-button`}
          >
            <PlusCircle className="h-4 w-4" />
            Add Address
          </Button>
        </AddAddressDialog>
      </div>
      
      {addresses.length === 0 ? (
        <div 
          className="text-center p-6 border rounded-md bg-gray-50"
          data-testid={`${testId}-empty`}
        >
          <p className="text-gray-500">{emptyMessage}</p>
          <AddAddressDialog
            onAddressAdded={onAddAddress}
            testId={`${testId}-empty-add-dialog`}
          >
            <Button 
              variant="outline" 
              className="mt-4 gap-1"
              data-testid={`${testId}-empty-add-button`}
            >
              <PlusCircle className="h-4 w-4" />
              Add Your First Address
            </Button>
          </AddAddressDialog>
        </div>
      ) : (
        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
          data-testid={`${testId}-grid`}
        >
          {addresses.map((address) => (
            <EditAddressDialog
              key={address.id}
              address={address}
              onAddressUpdated={(data) => onUpdateAddress(address.id, data)}
              testId={`${testId}-edit-dialog-${address.id}`}
            >
              <AddressCard
                address={address}
                onEdit={() => {}}
                onDelete={onDeleteAddress}
                onSetDefault={onSetDefaultAddress}
                testId={`${testId}-card-${address.id}`}
              />
            </EditAddressDialog>
          ))}
        </div>
      )}
    </div>
  )
}
