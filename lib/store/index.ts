/**
 * Global State Management
 *
 * This module provides a centralized state management system using Zustand.
 * It implements consistent patterns for state management, persistence, and synchronization.
 */

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { toast } from '@/components/ui/use-toast'

/**
 * Create a persisted store with error handling
 *
 * @param name Store name for persistence
 * @param initialState Initial state of the store
 * @param methods Methods to manipulate the store state
 * @returns A Zustand store with persistence
 */
export function createPersistedStore<T extends object, M>(
  name: string,
  initialState: T,
  methods: (set: any, get: any) => M
) {
  return create(
    persist<T & M>(
      (set, get) => ({
        ...initialState,
        ...methods(set, get),
      }),
      {
        name: `pickle_${name}`,
        storage: createJSONStorage(() => localStorage),
        onRehydrateStorage: () => (state) => {
          if (state) {
            console.log(`State '${name}' rehydrated`)
          } else {
            console.warn(`Failed to rehydrate state '${name}'`)
          }
        },
      }
    )
  )
}

/**
 * Create a store without persistence
 *
 * @param initialState Initial state of the store
 * @param methods Methods to manipulate the store state
 * @returns A Zustand store without persistence
 */
export function createStore<T extends object, M>(
  initialState: T,
  methods: (set: any, get: any) => M
) {
  return create<T & M>((set, get) => ({
    ...initialState,
    ...methods(set, get),
  }))
}

/**
 * Handle errors in store operations
 *
 * @param error Error object
 * @param customMessage Custom error message
 * @returns Error message
 */
export const handleStoreError = (error: unknown, customMessage?: string) => {
  console.error('Store operation error:', error)

  const errorMessage = error instanceof Error
    ? error.message
    : 'An unexpected error occurred'

  toast({
    title: customMessage || 'Operation Failed',
    description: errorMessage,
    variant: 'destructive',
  })

  return errorMessage
}

/**
 * Utility to create a loading state handler
 *
 * @param set Zustand set function
 * @returns Object with startLoading and stopLoading methods
 */
export const createLoadingHandler = (set: any) => ({
  startLoading: () => set({ isLoading: true, error: null }),
  stopLoading: () => set({ isLoading: false }),
  setError: (error: Error | null) => set({ error, isLoading: false }),
})

/**
 * Utility to create an error state handler
 *
 * @param set Zustand set function
 * @returns Object with setError and clearError methods
 */
export const createErrorHandler = (set: any) => ({
  setError: (error: Error | null) => set({ error }),
  clearError: () => set({ error: null }),
})

/**
 * Utility to create a reset handler
 *
 * @param set Zustand set function
 * @param initialState Initial state of the store
 * @returns Object with reset method
 */
export const createResetHandler = (set: any, initialState: any) => ({
  reset: () => set(initialState),
})

/**
 * Utility to create a success notification handler
 *
 * @param title Success notification title
 * @param description Success notification description
 */
export const showSuccessNotification = (title: string, description: string) => {
  toast({
    title,
    description,
  })
}

/**
 * Utility to create an error notification handler
 *
 * @param title Error notification title
 * @param description Error notification description
 */
export const showErrorNotification = (title: string, description: string) => {
  toast({
    title,
    description,
    variant: 'destructive',
  })
}

/**
 * Export all stores
 */
export * from './auth-store'
export * from './cart-store'
export * from './payment-store'
export * from './address-store'
export * from './order-store'
export * from './theme-store'
export * from './store-initializer'
