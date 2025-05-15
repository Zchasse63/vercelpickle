/**
 * Payment Method Store
 *
 * This module provides a global state store for payment method management using Zustand.
 * It integrates with the Convex backend for payment method operations.
 */

import { Id } from '@/convex/_generated/dataModel'
import { api } from '@/convex/_generated/api'
import { createPersistedStore, createLoadingHandler, createErrorHandler, createResetHandler, showSuccessNotification, showErrorNotification } from '.'
import { useMutation, useQuery } from 'convex/react'

// Define payment method type
export interface PaymentMethod {
  id: string
  userId: Id<'users'> | null
  type: string
  brand: string
  last4: string
  expMonth: number
  expYear: number
  isDefault: boolean
}

// Define payment method form data type
export interface PaymentFormData {
  cardName: string
  cardNumber: string
  expiry: string
  cvc: string
  isDefault: boolean
}

// Define payment method state
interface PaymentState {
  paymentMethods: PaymentMethod[]
  selectedPaymentMethodId: string | null
  isLoading: boolean
  error: Error | null
}

// Define payment method methods
interface PaymentMethods {
  addPaymentMethod: (paymentMethod: PaymentFormData) => Promise<string>
  deletePaymentMethod: (id: string) => Promise<void>
  setDefaultPaymentMethod: (id: string) => Promise<void>
  selectPaymentMethod: (id: string | null) => void
  loadPaymentMethods: (userId: Id<'users'> | null) => Promise<void>
  syncWithBackend: (userId: Id<'users'> | null) => Promise<void>
}

// Initial state
const initialState: PaymentState = {
  paymentMethods: [],
  selectedPaymentMethodId: null,
  isLoading: false,
  error: null,
}

/**
 * Payment method store
 */
export const usePaymentStore = createPersistedStore<PaymentState, PaymentMethods>(
  'payment',
  initialState,
  (set, get) => {
    // Create loading and error handlers
    const loadingHandler = createLoadingHandler(set)
    const errorHandler = createErrorHandler(set)
    const resetHandler = createResetHandler(set, initialState)

    return {
      // Add payment method
      addPaymentMethod: async (formData: PaymentFormData) => {
        loadingHandler.startLoading()

        try {
          const { paymentMethods } = get()
          const userId = localStorage.getItem('userId') as Id<'users'> | null

          // Extract card details
          const cardNumber = formData.cardNumber.replace(/\s/g, '')
          const last4 = cardNumber.slice(-4)
          const [expMonth, expYear] = formData.expiry.split('/').map(part => parseInt(part, 10))

          // Determine card brand based on first digit
          let brand = 'Unknown'
          if (cardNumber.startsWith('4')) brand = 'Visa'
          else if (cardNumber.startsWith('5')) brand = 'Mastercard'
          else if (cardNumber.startsWith('3')) brand = 'American Express'
          else if (cardNumber.startsWith('6')) brand = 'Discover'

          // Generate a unique ID
          const id = `pm-${Date.now()}`

          // Create new payment method
          const newPaymentMethod: PaymentMethod = {
            id,
            userId,
            type: 'Credit Card',
            brand,
            last4,
            expMonth,
            expYear: expYear < 100 ? 2000 + expYear : expYear,
            isDefault: formData.isDefault,
          }

          // If this is the first payment method or it's set as default, update other payment methods
          let updatedPaymentMethods = [...paymentMethods]

          if (paymentMethods.length === 0 || formData.isDefault) {
            // Set all other payment methods as non-default
            updatedPaymentMethods = updatedPaymentMethods.map(method => ({
              ...method,
              isDefault: false,
            }))

            // Ensure the new payment method is set as default
            newPaymentMethod.isDefault = true
          }

          // Add the new payment method
          set({ paymentMethods: [...updatedPaymentMethods, newPaymentMethod] })

          // If this is the first payment method or it's set as default, select it
          if (paymentMethods.length === 0 || formData.isDefault) {
            set({ selectedPaymentMethodId: id })
          }

          // Show success notification
          showSuccessNotification(
            'Payment method added',
            `${brand} ending in ${last4} has been added.`
          )

          // Sync with backend if user is logged in
          if (userId) {
            try {
              // Note: Since we don't have a specific payment API yet, we're using a mock implementation
              // In a real implementation, we would call the Convex API to add the payment method
              // const addPaymentMethodMutation = useMutation(api.payments.add)
              // await addPaymentMethodMutation({
              //   userId,
              //   type: 'Credit Card',
              //   brand,
              //   last4,
              //   expMonth,
              //   expYear: expYear < 100 ? 2000 + expYear : expYear,
              //   isDefault: newPaymentMethod.isDefault,
              // })

              // For now, we'll just log that we would sync with the backend
              console.log('Would sync payment method with backend:', newPaymentMethod)
            } catch (error) {
              console.error('Failed to sync payment method with backend:', error)
            }
          }

          return id
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to add payment method')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Error', err.message)

          throw err
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Delete payment method
      deletePaymentMethod: async (id: string) => {
        loadingHandler.startLoading()

        try {
          const { paymentMethods, selectedPaymentMethodId } = get()

          // Find the payment method to delete
          const methodToDelete = paymentMethods.find(method => method.id === id)

          if (!methodToDelete) {
            throw new Error(`Payment method with ID ${id} not found`)
          }

          // Check if the payment method is set as default
          if (methodToDelete.isDefault) {
            throw new Error('Cannot delete the default payment method')
          }

          // Filter out the payment method to delete
          const updatedPaymentMethods = paymentMethods.filter(method => method.id !== id)

          set({ paymentMethods: updatedPaymentMethods })

          // If the deleted payment method was selected, select the default payment method
          if (selectedPaymentMethodId === id) {
            const defaultMethod = updatedPaymentMethods.find(method => method.isDefault)
            set({ selectedPaymentMethodId: defaultMethod?.id || null })
          }

          // Show success notification
          showSuccessNotification(
            'Payment method deleted',
            `${methodToDelete.brand} ending in ${methodToDelete.last4} has been deleted.`
          )

          // Sync with backend if user is logged in
          const userId = localStorage.getItem('userId') as Id<'users'> | null
          if (userId) {
            try {
              // Note: Since we don't have a specific payment API yet, we're using a mock implementation
              // In a real implementation, we would call the Convex API to delete the payment method
              // const deletePaymentMethodMutation = useMutation(api.payments.delete)
              // await deletePaymentMethodMutation({
              //   id,
              //   userId,
              // })

              // For now, we'll just log that we would sync with the backend
              console.log('Would delete payment method from backend:', id)
            } catch (error) {
              console.error('Failed to delete payment method from backend:', error)
            }
          }
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to delete payment method')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Error', err.message)

          throw err
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Set default payment method
      setDefaultPaymentMethod: async (id: string) => {
        loadingHandler.startLoading()

        try {
          const { paymentMethods } = get()

          // Find the payment method to set as default
          const methodIndex = paymentMethods.findIndex(method => method.id === id)

          if (methodIndex === -1) {
            throw new Error(`Payment method with ID ${id} not found`)
          }

          // Update all payment methods
          const updatedPaymentMethods = paymentMethods.map(method => ({
            ...method,
            isDefault: method.id === id,
          }))

          set({
            paymentMethods: updatedPaymentMethods,
            selectedPaymentMethodId: id,
          })

          // Get the payment method that was set as default
          const defaultMethod = updatedPaymentMethods.find(method => method.id === id)

          // Show success notification
          showSuccessNotification(
            'Default payment method set',
            `${defaultMethod?.brand} ending in ${defaultMethod?.last4} is now your default payment method.`
          )

          // Sync with backend if user is logged in
          const userId = localStorage.getItem('userId') as Id<'users'> | null
          if (userId) {
            try {
              // Note: Since we don't have a specific payment API yet, we're using a mock implementation
              // In a real implementation, we would call the Convex API to set the default payment method
              // const setDefaultPaymentMethodMutation = useMutation(api.payments.setDefault)
              // await setDefaultPaymentMethodMutation({
              //   id,
              //   userId,
              // })

              // For now, we'll just log that we would sync with the backend
              console.log('Would set default payment method in backend:', id)
            } catch (error) {
              console.error('Failed to set default payment method in backend:', error)
            }
          }
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to set default payment method')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Error', err.message)

          throw err
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Select payment method
      selectPaymentMethod: (id: string | null) => {
        set({ selectedPaymentMethodId: id })
      },

      // Load payment methods
      loadPaymentMethods: async (userId: Id<'users'> | null) => {
        if (!userId) return

        loadingHandler.startLoading()

        try {
          // Note: Since we don't have a specific payment API yet, we're using a mock implementation
          // In a real implementation, we would call the Convex API to get the payment methods
          // const getPaymentMethodsQuery = useQuery(api.payments.getByUser, { userId })

          // For now, we'll use mock data
          const mockPaymentMethods: PaymentMethod[] = [
            {
              id: 'pm-1',
              userId,
              type: 'Credit Card',
              brand: 'Visa',
              last4: '4242',
              expMonth: 12,
              expYear: 2025,
              isDefault: true,
            },
            {
              id: 'pm-2',
              userId,
              type: 'Credit Card',
              brand: 'Mastercard',
              last4: '5555',
              expMonth: 10,
              expYear: 2024,
              isDefault: false,
            },
          ]

          // Update the state with the mock payment methods
          set({ paymentMethods: mockPaymentMethods })

          // Select the default payment method
          const defaultMethod = mockPaymentMethods.find(method => method.isDefault)
          if (defaultMethod) {
            set({ selectedPaymentMethodId: defaultMethod.id })
          }
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to load payment methods')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Error', err.message)
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Sync payment methods with backend
      syncWithBackend: async (userId: Id<'users'> | null) => {
        if (!userId) return

        loadingHandler.startLoading()

        try {
          // Get the current payment methods from the store
          const { paymentMethods } = get()

          // Note: Since we don't have a specific payment API yet, we're using a mock implementation
          // In a real implementation, we would call the Convex API to sync the payment methods

          // For now, we'll just log that we would sync with the backend
          console.log('Would sync payment methods with backend:', paymentMethods)

          // Load payment methods from the backend
          await get().loadPaymentMethods(userId)
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to sync payment methods with backend')
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
