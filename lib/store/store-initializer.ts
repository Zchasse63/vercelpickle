/**
 * Store Initializer
 * 
 * This module provides a component to initialize and sync all stores with the backend.
 */

import { useEffect } from 'react'
import { Id } from '@/convex/_generated/dataModel'
import { 
  useAuthStore, 
  useCartStore, 
  useAddressStore, 
  usePaymentStore, 
  useOrderStore,
  showErrorNotification
} from '.'

/**
 * Initialize and sync all stores with the backend
 * 
 * @returns JSX.Element
 */
export function StoreInitializer() {
  // Get stores
  const { user, checkAuth } = useAuthStore()
  const { syncWithBackend: syncCart } = useCartStore()
  const { syncWithBackend: syncAddresses } = useAddressStore()
  const { syncWithBackend: syncPaymentMethods } = usePaymentStore()
  const { syncWithBackend: syncOrders } = useOrderStore()
  
  // Check authentication on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        await checkAuth()
      } catch (error) {
        console.error('Failed to check authentication:', error)
      }
    }
    
    initializeAuth()
  }, [checkAuth])
  
  // Sync stores with backend when user changes
  useEffect(() => {
    const syncStores = async () => {
      if (!user) return
      
      try {
        // Sync cart with backend
        await syncCart(user.id)
        
        // Sync addresses with backend
        await syncAddresses(user.id)
        
        // Sync payment methods with backend
        await syncPaymentMethods(user.id)
        
        // Sync orders with backend
        await syncOrders(user.id)
      } catch (error) {
        console.error('Failed to sync stores with backend:', error)
        showErrorNotification('Sync Failed', 'Failed to sync your data with the server.')
      }
    }
    
    syncStores()
  }, [user, syncCart, syncAddresses, syncPaymentMethods, syncOrders])
  
  // This component doesn't render anything
  return null
}

/**
 * Hook to get the current user ID
 * 
 * @returns The current user ID or null
 */
export function useUserId(): Id<'users'> | null {
  const { user } = useAuthStore()
  return user?.id || null
}

/**
 * Hook to check if the user is authenticated
 * 
 * @returns True if the user is authenticated, false otherwise
 */
export function useIsAuthenticated(): boolean {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated
}

/**
 * Hook to check if the user has a specific role
 * 
 * @param role The role to check
 * @returns True if the user has the specified role, false otherwise
 */
export function useHasRole(role: 'admin' | 'seller' | 'buyer'): boolean {
  const { user } = useAuthStore()
  return user?.role === role
}
