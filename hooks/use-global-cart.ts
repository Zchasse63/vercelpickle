"use client"

import { useEffect } from 'react'
import { useCartStore } from '@/lib/store'
import { useAuth } from '@/providers/auth-provider'
import { Id } from '@/convex/_generated/dataModel'
import { api } from '@/convex/_generated/api'
import { useQuery } from 'convex/react'

/**
 * Hook for using cart state in components
 * 
 * This hook provides a simplified interface for accessing cart state and methods.
 * It also handles synchronization with the backend.
 */
export function useGlobalCart() {
  // Get the authenticated user
  const { user } = useAuth()
  
  // Get the cart state
  const {
    items,
    totals,
    isLoading,
    error,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    calculateTotals,
    syncWithBackend,
  } = useCartStore()
  
  // Get all products from the backend
  const products = useQuery(api.products.getAll, {}) || []
  
  // Sync cart with backend when user changes
  useEffect(() => {
    if (user) {
      syncWithBackend(user.id as Id<'users'>)
    }
  }, [user, syncWithBackend])
  
  // Calculate cart totals when cart items change
  useEffect(() => {
    calculateTotals()
  }, [items, calculateTotals])
  
  // Add item to cart
  const addToCart = async (productId: string, quantity: number = 1) => {
    // Find the product in the products list
    const product = products.find(p => p._id === productId)
    
    if (!product) {
      throw new Error(`Product with ID ${productId} not found`)
    }
    
    // Transform the product to the format expected by the cart store
    const transformedProduct = {
      id: product._id as Id<'products'>,
      name: product.name,
      price: product.price,
      images: product.images || [],
      sellerId: product.sellerId as Id<'users'>,
      sellerName: product.sellerName,
      inventory: product.inventory,
      unit: product.unit,
    }
    
    // Add the item to the cart
    await addItem(product._id as Id<'products'>, transformedProduct, quantity)
  }
  
  // Update item in cart
  const updateCartItem = async (itemId: string, quantity: number) => {
    await updateItem(itemId, quantity)
  }
  
  // Remove item from cart
  const removeCartItem = async (itemId: string) => {
    await removeItem(itemId)
  }
  
  // Empty cart
  const emptyCart = async () => {
    await clearCart()
  }
  
  // Check if cart is empty
  const isEmpty = items.length === 0
  
  // Get cart item count
  const itemCount = totals.itemCount
  
  return {
    // Cart state
    items,
    totals,
    isEmpty,
    itemCount,
    isLoading,
    error,
    
    // Cart methods
    addToCart,
    updateCartItem,
    removeCartItem,
    emptyCart,
  }
}
