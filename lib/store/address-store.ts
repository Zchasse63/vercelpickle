/**
 * Address Store
 *
 * This module provides a global state store for address management using Zustand.
 * It integrates with the Convex backend for address operations.
 */

import { Id } from '@/convex/_generated/dataModel'
import { api } from '@/convex/_generated/api'
import { createPersistedStore, createLoadingHandler, createErrorHandler, createResetHandler, showSuccessNotification, showErrorNotification } from '.'
import { useMutation, useQuery } from 'convex/react'

// Define address type
export interface Address {
  id: string
  userId: Id<'users'> | null
  name: string
  street: string
  street2?: string
  city: string
  state: string
  zip: string
  country: string
  phone?: string
  isDefault: boolean
}

// Define address form data type
export interface AddressFormData {
  name: string
  street: string
  street2?: string
  city: string
  state: string
  zip: string
  country: string
  phone?: string
  isDefault: boolean
}

// Define address state
interface AddressState {
  addresses: Address[]
  selectedAddressId: string | null
  isLoading: boolean
  error: Error | null
}

// Define address methods
interface AddressMethods {
  addAddress: (address: AddressFormData) => Promise<string>
  updateAddress: (id: string, address: AddressFormData) => Promise<void>
  deleteAddress: (id: string) => Promise<void>
  setDefaultAddress: (id: string) => Promise<void>
  selectAddress: (id: string | null) => void
  loadAddresses: (userId: Id<'users'> | null) => Promise<void>
  syncWithBackend: (userId: Id<'users'> | null) => Promise<void>
}

// Initial state
const initialState: AddressState = {
  addresses: [],
  selectedAddressId: null,
  isLoading: false,
  error: null,
}

/**
 * Address store
 */
export const useAddressStore = createPersistedStore<AddressState, AddressMethods>(
  'address',
  initialState,
  (set, get) => {
    // Create loading and error handlers
    const loadingHandler = createLoadingHandler(set)
    const errorHandler = createErrorHandler(set)
    const resetHandler = createResetHandler(set, initialState)

    return {
      // Add address
      addAddress: async (addressData: AddressFormData) => {
        loadingHandler.startLoading()

        try {
          const { addresses } = get()
          const userId = localStorage.getItem('userId') as Id<'users'> | null

          // Generate a unique ID
          const id = `address-${Date.now()}`

          // Create new address
          const newAddress: Address = {
            id,
            userId,
            ...addressData,
          }

          // If this is the first address or it's set as default, update other addresses
          let updatedAddresses = [...addresses]

          if (addresses.length === 0 || addressData.isDefault) {
            // Set all other addresses as non-default
            updatedAddresses = updatedAddresses.map(address => ({
              ...address,
              isDefault: false,
            }))

            // Ensure the new address is set as default
            newAddress.isDefault = true
          }

          // Add the new address
          set({ addresses: [...updatedAddresses, newAddress] })

          // If this is the first address or it's set as default, select it
          if (addresses.length === 0 || addressData.isDefault) {
            set({ selectedAddressId: id })
          }

          // Show success notification
          showSuccessNotification(
            'Address added',
            `${newAddress.name} address has been added.`
          )

          // Sync with backend if user is logged in
          if (userId) {
            try {
              // Note: Since we don't have a specific address API yet, we're using a mock implementation
              // In a real implementation, we would call the Convex API to add the address
              // const addAddressMutation = useMutation(api.addresses.add)
              // await addAddressMutation({
              //   userId,
              //   ...addressData,
              // })

              // For now, we'll just log that we would sync with the backend
              console.log('Would sync address with backend:', newAddress)
            } catch (error) {
              console.error('Failed to sync address with backend:', error)
            }
          }

          return id
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to add address')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Error', err.message)

          throw err
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Update address
      updateAddress: async (id: string, addressData: AddressFormData) => {
        loadingHandler.startLoading()

        try {
          const { addresses } = get()

          // Find the address to update
          const addressIndex = addresses.findIndex(address => address.id === id)

          if (addressIndex === -1) {
            throw new Error(`Address with ID ${id} not found`)
          }

          // Create updated address
          const updatedAddress: Address = {
            ...addresses[addressIndex],
            ...addressData,
          }

          // If the address is set as default, update other addresses
          let updatedAddresses = [...addresses]

          if (addressData.isDefault) {
            // Set all other addresses as non-default
            updatedAddresses = updatedAddresses.map(address => ({
              ...address,
              isDefault: address.id === id,
            }))
          } else {
            // Update the specific address
            updatedAddresses[addressIndex] = updatedAddress
          }

          set({ addresses: updatedAddresses })

          // If the updated address is set as default, select it
          if (addressData.isDefault) {
            set({ selectedAddressId: id })
          }

          // Show success notification
          showSuccessNotification(
            'Address updated',
            `${updatedAddress.name} address has been updated.`
          )

          // Sync with backend if user is logged in
          const userId = localStorage.getItem('userId') as Id<'users'> | null
          if (userId) {
            try {
              // Note: Since we don't have a specific address API yet, we're using a mock implementation
              // In a real implementation, we would call the Convex API to update the address
              // const updateAddressMutation = useMutation(api.addresses.update)
              // await updateAddressMutation({
              //   id,
              //   userId,
              //   ...addressData,
              // })

              // For now, we'll just log that we would sync with the backend
              console.log('Would sync updated address with backend:', updatedAddress)
            } catch (error) {
              console.error('Failed to sync updated address with backend:', error)
            }
          }
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to update address')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Error', err.message)

          throw err
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Delete address
      deleteAddress: async (id: string) => {
        loadingHandler.startLoading()

        try {
          const { addresses, selectedAddressId } = get()

          // Find the address to delete
          const addressToDelete = addresses.find(address => address.id === id)

          if (!addressToDelete) {
            throw new Error(`Address with ID ${id} not found`)
          }

          // Check if the address is set as default
          if (addressToDelete.isDefault) {
            throw new Error('Cannot delete the default address')
          }

          // Filter out the address to delete
          const updatedAddresses = addresses.filter(address => address.id !== id)

          set({ addresses: updatedAddresses })

          // If the deleted address was selected, select the default address
          if (selectedAddressId === id) {
            const defaultAddress = updatedAddresses.find(address => address.isDefault)
            set({ selectedAddressId: defaultAddress?.id || null })
          }

          // Show success notification
          showSuccessNotification(
            'Address deleted',
            `${addressToDelete.name} address has been deleted.`
          )

          // Sync with backend if user is logged in
          const userId = localStorage.getItem('userId') as Id<'users'> | null
          if (userId) {
            try {
              // Note: Since we don't have a specific address API yet, we're using a mock implementation
              // In a real implementation, we would call the Convex API to delete the address
              // const deleteAddressMutation = useMutation(api.addresses.delete)
              // await deleteAddressMutation({
              //   id,
              //   userId,
              // })

              // For now, we'll just log that we would sync with the backend
              console.log('Would delete address from backend:', id)
            } catch (error) {
              console.error('Failed to delete address from backend:', error)
            }
          }
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to delete address')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Error', err.message)

          throw err
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Set default address
      setDefaultAddress: async (id: string) => {
        loadingHandler.startLoading()

        try {
          const { addresses } = get()

          // Find the address to set as default
          const addressIndex = addresses.findIndex(address => address.id === id)

          if (addressIndex === -1) {
            throw new Error(`Address with ID ${id} not found`)
          }

          // Update all addresses
          const updatedAddresses = addresses.map(address => ({
            ...address,
            isDefault: address.id === id,
          }))

          set({
            addresses: updatedAddresses,
            selectedAddressId: id,
          })

          // Get the address that was set as default
          const defaultAddress = updatedAddresses.find(address => address.id === id)

          // Show success notification
          showSuccessNotification(
            'Default address set',
            `${defaultAddress?.name} is now your default address.`
          )

          // Sync with backend if user is logged in
          const userId = localStorage.getItem('userId') as Id<'users'> | null
          if (userId) {
            try {
              // Note: Since we don't have a specific address API yet, we're using a mock implementation
              // In a real implementation, we would call the Convex API to set the default address
              // const setDefaultAddressMutation = useMutation(api.addresses.setDefault)
              // await setDefaultAddressMutation({
              //   id,
              //   userId,
              // })

              // For now, we'll just log that we would sync with the backend
              console.log('Would set default address in backend:', id)
            } catch (error) {
              console.error('Failed to set default address in backend:', error)
            }
          }
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to set default address')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Error', err.message)

          throw err
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Select address
      selectAddress: (id: string | null) => {
        set({ selectedAddressId: id })
      },

      // Load addresses
      loadAddresses: async (userId: Id<'users'> | null) => {
        if (!userId) return

        loadingHandler.startLoading()

        try {
          // Note: Since we don't have a specific address API yet, we're using a mock implementation
          // In a real implementation, we would call the Convex API to get the addresses
          // const getAddressesQuery = useQuery(api.addresses.getByUser, { userId })

          // For now, we'll use mock data
          const mockAddresses: Address[] = [
            {
              id: 'addr-1',
              userId,
              name: 'Home',
              street: '123 Main St',
              city: 'San Francisco',
              state: 'CA',
              zip: '94105',
              country: 'US',
              phone: '(555) 123-4567',
              isDefault: true,
            },
            {
              id: 'addr-2',
              userId,
              name: 'Work',
              street: '456 Market St',
              city: 'San Francisco',
              state: 'CA',
              zip: '94105',
              country: 'US',
              phone: '(555) 987-6543',
              isDefault: false,
            },
          ]

          // Update the state with the mock addresses
          set({ addresses: mockAddresses })

          // Select the default address
          const defaultAddress = mockAddresses.find(address => address.isDefault)
          if (defaultAddress) {
            set({ selectedAddressId: defaultAddress.id })
          }
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to load addresses')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Error', err.message)
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Sync addresses with backend
      syncWithBackend: async (userId: Id<'users'> | null) => {
        if (!userId) return

        loadingHandler.startLoading()

        try {
          // Get the current addresses from the store
          const { addresses } = get()

          // Note: Since we don't have a specific address API yet, we're using a mock implementation
          // In a real implementation, we would call the Convex API to sync the addresses

          // For now, we'll just log that we would sync with the backend
          console.log('Would sync addresses with backend:', addresses)

          // Load addresses from the backend
          await get().loadAddresses(userId)
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to sync addresses with backend')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Error', err.message)
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Reset
      ...resetHandler,
    }
  }
)
