"use client"

import { useState } from "react"
import { toast } from "@/components/ui/use-toast"
import { useCurrentUser, useUserAddresses } from "@/lib/data/exports"
import { AddressList, AddressFormData } from "@/components/address"

/**
 * BuyerAddressManager component
 * 
 * A component for managing a buyer's shipping addresses.
 */
export function BuyerAddressManager({ testId }: { testId?: string }) {
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
  
  // Handle updating an address
  const handleUpdateAddress = async (id: string, address: AddressFormData) => {
    if (!userId) return
    
    try {
      // If the address is set as default, update other addresses
      if (address.isDefault) {
        // Update optimistic addresses
        setOptimisticAddresses(prev => 
          prev.map(a => ({
            ...a,
            isDefault: a.id === id ? true : false,
          }))
        )
      } else {
        // Update the address
        setOptimisticAddresses(prev => 
          prev.map(a => a.id === id ? { ...a, ...address } : a)
        )
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success toast
      toast({
        title: "Address updated",
        description: "Your shipping address has been updated successfully.",
      })
    } catch (error) {
      // Show error toast
      toast({
        title: "Failed to update address",
        description: "There was an error updating your shipping address. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  // Handle deleting an address
  const handleDeleteAddress = async (id: string) => {
    if (!userId) return
    
    try {
      // Update optimistic addresses
      setOptimisticAddresses(prev => prev.filter(a => a.id !== id))
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success toast
      toast({
        title: "Address removed",
        description: "Your shipping address has been removed successfully.",
      })
    } catch (error) {
      // Show error toast
      toast({
        title: "Failed to remove address",
        description: "There was an error removing your shipping address. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  // Handle setting an address as default
  const handleSetDefaultAddress = async (id: string) => {
    if (!userId) return
    
    try {
      // Update optimistic addresses
      setOptimisticAddresses(prev => 
        prev.map(a => ({
          ...a,
          isDefault: a.id === id,
        }))
      )
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Show success toast
      toast({
        title: "Default address updated",
        description: "Your default shipping address has been updated successfully.",
      })
    } catch (error) {
      // Show error toast
      toast({
        title: "Failed to update default address",
        description: "There was an error updating your default shipping address. Please try again.",
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
    <AddressList
      addresses={optimisticAddresses}
      onAddAddress={handleAddAddress}
      onUpdateAddress={handleUpdateAddress}
      onDeleteAddress={handleDeleteAddress}
      onSetDefaultAddress={handleSetDefaultAddress}
      testId={testId}
    />
  )
}
