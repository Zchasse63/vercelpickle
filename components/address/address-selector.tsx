"use client"

import React, { useState } from "react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Address } from "./address-card"
import { AddAddressDialog } from "./address-form-dialog"
import { AddressFormData } from "./address-form"
import { cn } from "@/lib/utils"

interface AddressSelectorProps {
  addresses: Address[]
  selectedAddressId?: string
  onAddressSelected: (addressId: string) => void
  onAddAddress: (address: AddressFormData) => void
  className?: string
  testId?: string
}

/**
 * AddressSelector component
 * 
 * A component for selecting an address from a list of addresses.
 */
export function AddressSelector({
  addresses,
  selectedAddressId,
  onAddressSelected,
  onAddAddress,
  className,
  testId,
}: AddressSelectorProps) {
  // If no address is selected, default to the default address
  const [selected, setSelected] = useState<string>(
    selectedAddressId || addresses.find(a => a.isDefault)?.id || ""
  )
  
  const handleChange = (value: string) => {
    setSelected(value)
    onAddressSelected(value)
  }
  
  return (
    <div className={cn("space-y-4", className)} data-testid={testId}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Select Shipping Address</h3>
        <AddAddressDialog
          onAddressAdded={onAddAddress}
          testId={`${testId}-add-dialog`}
        >
          <Button 
            variant="outline" 
            size="sm" 
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
          <p className="text-gray-500">You don't have any addresses yet.</p>
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
        <RadioGroup 
          value={selected} 
          onValueChange={handleChange}
          className="space-y-3"
          data-testid={`${testId}-radio-group`}
        >
          {addresses.map((address) => (
            <div
              key={address.id}
              className={cn(
                "flex items-start space-x-3 rounded-md border p-3",
                selected === address.id && "border-primary bg-primary/5"
              )}
              data-testid={`${testId}-option-${address.id}`}
            >
              <RadioGroupItem 
                value={address.id} 
                id={`address-${address.id}`}
                data-testid={`${testId}-radio-${address.id}`}
              />
              <div className="flex-1 space-y-1">
                <Label 
                  htmlFor={`address-${address.id}`}
                  className="font-medium"
                >
                  {address.name}
                  {address.isDefault && (
                    <span 
                      className="ml-2 text-sm text-green-600 font-normal"
                      data-testid={`${testId}-default-badge-${address.id}`}
                    >
                      Default
                    </span>
                  )}
                </Label>
                <div className="text-sm text-gray-500">
                  <p>{address.street}</p>
                  {address.street2 && <p>{address.street2}</p>}
                  <p>
                    {address.city}, {address.state} {address.zip}
                  </p>
                  <p>{address.country}</p>
                  {address.phone && <p>{address.phone}</p>}
                </div>
              </div>
            </div>
          ))}
        </RadioGroup>
      )}
    </div>
  )
}
