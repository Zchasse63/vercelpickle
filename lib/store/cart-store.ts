/**
 * Cart Store
 *
 * This module provides a global state store for cart management using Zustand.
 * It integrates with the Convex backend for cart operations.
 */

import { Id } from '@/convex/_generated/dataModel'
import { api } from '@/convex/_generated/api'
import { createPersistedStore, createLoadingHandler, createErrorHandler, createResetHandler, showSuccessNotification, showErrorNotification } from '.'
import { useMutation, useQuery } from 'convex/react'

// Define product type
export interface Product {
  id: Id<'products'>
  name: string
  price: number
  images: string[]
  sellerId: Id<'users'>
  sellerName?: string
  inventory: number
  unit: string
}

// Define cart item type
export interface CartItem {
  id: string
  productId: Id<'products'>
  product: Product
  quantity: number
}

// Define cart totals type
export interface CartTotals {
  subtotal: number
  tax: number
  shipping: number
  total: number
  itemCount: number
}

// Define cart state
interface CartState {
  items: CartItem[]
  totals: CartTotals
  isLoading: boolean
  error: Error | null
}

// Define cart methods
interface CartMethods {
  addItem: (productId: Id<'products'>, product: Product, quantity: number) => Promise<void>
  updateItem: (itemId: string, quantity: number) => Promise<void>
  removeItem: (itemId: string) => Promise<void>
  clearCart: () => Promise<void>
  syncWithBackend: (userId: Id<'users'> | null) => Promise<void>
  calculateTotals: () => void
}

// Initial state
const initialState: CartState = {
  items: [],
  totals: {
    subtotal: 0,
    tax: 0,
    shipping: 0,
    total: 0,
    itemCount: 0,
  },
  isLoading: false,
  error: null,
}

/**
 * Calculate cart totals
 *
 * @param items Cart items
 * @returns Cart totals
 */
const calculateCartTotals = (items: CartItem[]): CartTotals => {
  // Calculate subtotal
  const subtotal = items.reduce((total, item) => {
    return total + (item.product.price * item.quantity)
  }, 0)

  // Calculate tax (e.g., 8.5%)
  const taxRate = 0.085
  const tax = subtotal * taxRate

  // Calculate shipping (simplified)
  const shipping = subtotal > 0 ? 10 : 0

  // Calculate total
  const total = subtotal + tax + shipping

  // Calculate item count
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  return {
    subtotal,
    tax,
    shipping,
    total,
    itemCount,
  }
}

/**
 * Cart store
 */
export const useCartStore = createPersistedStore<CartState, CartMethods>(
  'cart',
  initialState,
  (set, get) => {
    // Create loading and error handlers
    const loadingHandler = createLoadingHandler(set)
    const errorHandler = createErrorHandler(set)
    const resetHandler = createResetHandler(set, initialState)

    return {
      // Calculate totals
      calculateTotals: () => {
        const { items } = get()
        const totals = calculateCartTotals(items)
        set({ totals })
      },

      // Add item to cart
      addItem: async (productId: Id<'products'>, product: Product, quantity: number) => {
        loadingHandler.startLoading()

        try {
          const { items } = get()

          // Check if item already exists in cart
          const existingItemIndex = items.findIndex(item => item.productId === productId)

          if (existingItemIndex !== -1) {
            // Update existing item
            const updatedItems = [...items]
            updatedItems[existingItemIndex].quantity += quantity

            set({ items: updatedItems })

            // Show success notification
            showSuccessNotification(
              'Item updated',
              `${product.name} quantity updated in your cart.`
            )
          } else {
            // Add new item
            const newItem: CartItem = {
              id: `cart-item-${Date.now()}`,
              productId,
              product,
              quantity,
            }

            set({ items: [...items, newItem] })

            // Show success notification
            showSuccessNotification(
              'Item added',
              `${product.name} added to your cart.`
            )
          }

          // Recalculate totals
          get().calculateTotals()

          // Sync with backend if user is logged in
          const userId = localStorage.getItem('userId') as Id<'users'> | null
          if (userId) {
            // Get the addItem mutation from Convex
            const addItemMutation = useMutation(api.cart.addItem)

            // Call the addItem mutation
            await addItemMutation({
              userId,
              productId,
              quantity,
            })
          }
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to add item to cart')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Error', err.message)
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Update item in cart
      updateItem: async (itemId: string, quantity: number) => {
        loadingHandler.startLoading()

        try {
          const { items } = get()

          if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            await get().removeItem(itemId)
            return
          }

          // Find the item to update
          const itemToUpdate = items.find(item => item.id === itemId)
          if (!itemToUpdate) {
            throw new Error(`Item with ID ${itemId} not found in cart`)
          }

          // Update item quantity
          const updatedItems = items.map(item =>
            item.id === itemId ? { ...item, quantity } : item
          )

          set({ items: updatedItems })

          // Recalculate totals
          get().calculateTotals()

          // Show success notification
          showSuccessNotification(
            'Cart updated',
            `${itemToUpdate.product.name} quantity updated.`
          )

          // Sync with backend if user is logged in
          const userId = localStorage.getItem('userId') as Id<'users'> | null
          if (userId) {
            // Get the updateQuantity mutation from Convex
            const updateQuantityMutation = useMutation(api.cart.updateQuantity)

            // Find the backend cart item ID
            const cartItemsQuery = useQuery(
              api.cart.getItems,
              { userId }
            )

            if (cartItemsQuery) {
              // Find the cart item in the backend that matches the product ID
              const backendCartItem = cartItemsQuery.find(
                item => item.productId === itemToUpdate.productId
              )

              if (backendCartItem) {
                // Call the updateQuantity mutation
                await updateQuantityMutation({
                  cartItemId: backendCartItem._id,
                  quantity,
                })
              }
            }
          }
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to update item in cart')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Error', err.message)
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Remove item from cart
      removeItem: async (itemId: string) => {
        loadingHandler.startLoading()

        try {
          const { items } = get()

          // Find the item to remove
          const itemToRemove = items.find(item => item.id === itemId)
          if (!itemToRemove) {
            throw new Error(`Item with ID ${itemId} not found in cart`)
          }

          // Filter out the item to remove
          const updatedItems = items.filter(item => item.id !== itemId)

          set({ items: updatedItems })

          // Recalculate totals
          get().calculateTotals()

          // Show success notification
          showSuccessNotification(
            'Item removed',
            `${itemToRemove.product.name} removed from your cart.`
          )

          // Sync with backend if user is logged in
          const userId = localStorage.getItem('userId') as Id<'users'> | null
          if (userId) {
            // Get the removeItem mutation from Convex
            const removeItemMutation = useMutation(api.cart.removeItem)

            // Find the backend cart item ID
            const cartItemsQuery = useQuery(
              api.cart.getItems,
              { userId }
            )

            if (cartItemsQuery) {
              // Find the cart item in the backend that matches the product ID
              const backendCartItem = cartItemsQuery.find(
                item => item.productId === itemToRemove.productId
              )

              if (backendCartItem) {
                // Call the removeItem mutation
                await removeItemMutation({
                  cartItemId: backendCartItem._id,
                })
              }
            }
          }
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to remove item from cart')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Error', err.message)
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Clear cart
      clearCart: async () => {
        loadingHandler.startLoading()

        try {
          set({ items: [] })

          // Recalculate totals
          get().calculateTotals()

          // Show success notification
          showSuccessNotification('Cart cleared', 'All items have been removed from your cart.')

          // Sync with backend if user is logged in
          const userId = localStorage.getItem('userId') as Id<'users'> | null
          if (userId) {
            // Get the clearCart mutation from Convex
            const clearCartMutation = useMutation(api.cart.clearCart)

            // Call the clearCart mutation
            await clearCartMutation({ userId })
          }
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to clear cart')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Error', err.message)
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Sync cart with backend
      syncWithBackend: async (userId: Id<'users'> | null) => {
        if (!userId) return

        loadingHandler.startLoading()

        try {
          // Get the cart items from the backend
          const cartItemsQuery = useQuery(
            api.cart.getByUser,
            { userId }
          )

          if (cartItemsQuery) {
            // Transform backend cart items to local format
            const transformedItems: CartItem[] = cartItemsQuery.map(item => ({
              id: `cart-item-${item._id}`,
              productId: item.productId,
              product: {
                id: item.product._id,
                name: item.product.name,
                price: item.product.price,
                images: item.product.images || [],
                sellerId: item.product.sellerId,
                sellerName: item.product.sellerName,
                inventory: item.product.inventory,
                unit: item.product.unit,
              },
              quantity: item.quantity,
            }))

            // Update the local cart
            set({ items: transformedItems })

            // Recalculate totals
            get().calculateTotals()
          }
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to sync cart with backend')
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
