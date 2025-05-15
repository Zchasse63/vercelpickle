"use client"

import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { useCurrentUser, useUserAddresses } from "@/lib/data/exports"
import { AddressSelector, AddressFormData } from "@/components/address"

interface BuyerAddressSelectorProps {
  onAddressSelected: (addressId: string) => void
  selectedAddressId?: string
  testId?: string
}

/**
 * BuyerAddressSelector component
 * 
 * A component for selecting a buyer's shipping address.
 */
export function BuyerAddressSelector({
  onAddressSelected,
  selectedAddressId,
  testId,
}: BuyerAddressSelectorProps) {
  // Get the current user from our data access layer
  const { userId } = useCurrentUser()
  
  // Fetch the user's addresses using our data access layer
  const { data: addresses = [], isLoading } = useUserAddresses(userId)
  
  // State for optimistic updates
  const [optimisticAddresses, setOptimisticAddresses] = useState(addresses)
  
  // Update optimistic addresses when the data is loaded
  if (addresses.length > 0 && optimisticAddresses.length === 0) {
    setOptimisticAddresses(addresses)
  }
  
  // Handle adding a new address
  const handleAddAddress = async (address: AddressFormData) => {
    if (!userId) return
    
    try {
      // Generate a temporary ID for optimistic updates
      const tempId = `temp-${Date.now()}`
      
      // Create the new address object
      const newAddress = {
        id: tempId,
        ...address,
      }
      
      // If this is the first address or it's set as default, update other addresses
      if (optimisticAddresses.length === 0 || address.isDefault) {
        // Update optimistic addresses
        setOptimisticAddresses(prev => 
          prev.map(a => ({ ...a, isDefault: false })).concat([newAddress])
        )
        
        // Select the new address
        onAddressSelected(tempId)
      } else {
        // Add the new address to the list
        setOptimisticAddresses(prev => [...prev, newAddress])
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success toast
      toast({
        title: "Address added",
        description: "Your shipping address has been added successfully.",
      })
    } catch (error) {
      // Show error toast
      toast({
        title: "Failed to add address",
        description: "There was an error adding your shipping address. Please try again.",
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
    <AddressSelector
      addresses={optimisticAddresses}
      selectedAddressId={selectedAddressId}
      onAddressSelected={onAddressSelected}
      onAddAddress={handleAddAddress}
      testId={testId}
    />
  )
}
