"use client"

import { useEffect } from 'react'
import { Id } from '@/convex/_generated/dataModel'
import { 
  useAuthStore, 
  useCartStore, 
  useAddressStore, 
  usePaymentStore, 
  useOrderStore, 
  useThemeStore 
} from '@/lib/store'

/**
 * Hook for using global state in components
 * 
 * This hook provides a unified interface for accessing all global state.
 */
export function useGlobalState() {
  // Get the auth state
  const { 
    user, 
    isAuthenticated, 
    isLoading: isAuthLoading, 
    error: authError,
    login,
    register,
    logout,
  } = useAuthStore()
  
  // Get the cart state
  const {
    items: cartItems,
    totals: cartTotals,
    isLoading: isCartLoading,
    error: cartError,
    addItem: addToCart,
    updateItem: updateCartItem,
    removeItem: removeCartItem,
    clearCart,
    calculateTotals,
  } = useCartStore()
  
  // Get the address state
  const {
    addresses,
    selectedAddressId,
    isLoading: isAddressLoading,
    error: addressError,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    selectAddress,
  } = useAddressStore()
  
  // Get the payment method state
  const {
    paymentMethods,
    selectedPaymentMethodId,
    isLoading: isPaymentLoading,
    error: paymentError,
    addPaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    selectPaymentMethod,
  } = usePaymentStore()
  
  // Get the order state
  const {
    orders,
    currentOrder,
    checkout,
    isLoading: isOrderLoading,
    error: orderError,
    createOrder,
    getOrder,
    getOrders,
    cancelOrder,
    setCheckoutStep,
    setShippingAddress,
    setBillingAddress,
    setPaymentMethod,
    setShippingMethod,
    setNotes,
    resetCheckout,
  } = useOrderStore()
  
  // Get the theme state
  const {
    theme,
    isDarkMode,
    setTheme,
    toggleTheme,
  } = useThemeStore()
  
  // Calculate cart totals when cart items change
  useEffect(() => {
    calculateTotals()
  }, [cartItems, calculateTotals])
  
  // Get the selected address
  const selectedAddress = addresses.find(address => address.id === selectedAddressId)
  
  // Get the selected payment method
  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedPaymentMethodId)
  
  // Get the default address
  const defaultAddress = addresses.find(address => address.isDefault)
  
  // Get the default payment method
  const defaultPaymentMethod = paymentMethods.find(method => method.isDefault)
  
  // Check if the cart is empty
  const isCartEmpty = cartItems.length === 0
  
  // Check if the user has addresses
  const hasAddresses = addresses.length > 0
  
  // Check if the user has payment methods
  const hasPaymentMethods = paymentMethods.length > 0
  
  // Check if the checkout is ready to proceed
  const isCheckoutReady = hasAddresses && hasPaymentMethods && !isCartEmpty
  
  // Check if any store is loading
  const isLoading = isAuthLoading || isCartLoading || isAddressLoading || isPaymentLoading || isOrderLoading
  
  // Get all errors
  const errors = [authError, cartError, addressError, paymentError, orderError].filter(Boolean)
  
  return {
    // Auth
    user,
    isAuthenticated,
    login,
    register,
    logout,
    
    // Cart
    cartItems,
    cartTotals,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
    isCartEmpty,
    
    // Addresses
    addresses,
    selectedAddress,
    defaultAddress,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
    selectAddress,
    hasAddresses,
    
    // Payment Methods
    paymentMethods,
    selectedPaymentMethod,
    defaultPaymentMethod,
    addPaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    selectPaymentMethod,
    hasPaymentMethods,
    
    // Orders
    orders,
    currentOrder,
    checkout,
    createOrder,
    getOrder,
    getOrders,
    cancelOrder,
    setCheckoutStep,
    setShippingAddress,
    setBillingAddress,
    setPaymentMethod,
    setShippingMethod,
    setNotes,
    resetCheckout,
    
    // Theme
    theme,
    isDarkMode,
    setTheme,
    toggleTheme,
    
    // Status
    isLoading,
    errors,
    isCheckoutReady,
  }
}
