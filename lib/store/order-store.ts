/**
 * Order Store
 *
 * This module provides a global state store for order management using Zustand.
 * It integrates with the Convex backend for order operations.
 */

import { Id } from '@/convex/_generated/dataModel'
import { api } from '@/convex/_generated/api'
import { createPersistedStore, createLoadingHandler, createErrorHandler, createResetHandler, showSuccessNotification, showErrorNotification } from '.'
import { useMutation, useQuery } from 'convex/react'
import { CartItem } from './cart-store'
import { Address } from './address-store'
import { PaymentMethod } from './payment-store'

// Define order item type
export interface OrderItem {
  productId: Id<'products'>
  name: string
  price: number
  quantity: number
  sellerId: Id<'users'>
  sellerName?: string
}

// Define order type
export interface Order {
  id: Id<'orders'> | string
  userId: Id<'users'> | null
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentMethod: PaymentMethod
  shippingAddress: Address
  billingAddress: Address
  createdAt: number
  updatedAt: number
}

// Define checkout state
export interface CheckoutState {
  step: 'shipping' | 'payment' | 'review' | 'confirmation'
  shippingAddressId: string | null
  billingAddressId: string | null
  paymentMethodId: string | null
  shippingMethod: 'standard' | 'express' | 'overnight'
  notes: string
}

// Define order state
interface OrderState {
  orders: Order[]
  currentOrder: Order | null
  checkout: CheckoutState
  isLoading: boolean
  error: Error | null
}

// Define order methods
interface OrderMethods {
  createOrder: (
    items: CartItem[],
    shippingAddress: Address,
    billingAddress: Address,
    paymentMethod: PaymentMethod,
    shippingMethod: string,
    notes: string
  ) => Promise<string>
  getOrder: (id: Id<'orders'> | string) => Promise<Order | null>
  getOrders: (userId: Id<'users'> | null) => Promise<Order[]>
  cancelOrder: (id: Id<'orders'> | string) => Promise<void>
  setCheckoutStep: (step: CheckoutState['step']) => void
  setShippingAddress: (id: string | null) => void
  setBillingAddress: (id: string | null) => void
  setPaymentMethod: (id: string | null) => void
  setShippingMethod: (method: CheckoutState['shippingMethod']) => void
  setNotes: (notes: string) => void
  resetCheckout: () => void
  syncWithBackend: (userId: Id<'users'> | null) => Promise<void>
}

// Initial state
const initialState: OrderState = {
  orders: [],
  currentOrder: null,
  checkout: {
    step: 'shipping',
    shippingAddressId: null,
    billingAddressId: null,
    paymentMethodId: null,
    shippingMethod: 'standard',
    notes: '',
  },
  isLoading: false,
  error: null,
}

/**
 * Order store
 */
export const useOrderStore = createPersistedStore<OrderState, OrderMethods>(
  'order',
  initialState,
  (set, get) => {
    // Create loading and error handlers
    const loadingHandler = createLoadingHandler(set)
    const errorHandler = createErrorHandler(set)
    const resetHandler = createResetHandler(set, initialState)

    return {
      // Create order
      createOrder: async (
        items: CartItem[],
        shippingAddress: Address,
        billingAddress: Address,
        paymentMethod: PaymentMethod,
        shippingMethod: string,
        notes: string
      ) => {
        loadingHandler.startLoading()

        try {
          const userId = localStorage.getItem('userId') as Id<'users'> | null

          if (!userId) {
            throw new Error('User not authenticated')
          }

          // Calculate order totals
          const subtotal = items.reduce((total, item) => total + (item.product.price * item.quantity), 0)
          const taxRate = 0.085
          const tax = subtotal * taxRate
          const shipping = shippingMethod === 'standard' ? 10 : shippingMethod === 'express' ? 20 : 30
          const total = subtotal + tax + shipping

          // Create order items
          const orderItems = items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.price,
            name: item.product.name,
            sellerId: item.product.sellerId,
          }))

          // Get the first seller ID (in a real app, we would handle multiple sellers)
          const sellerId = items[0].product.sellerId

          // Format addresses for Convex
          const shippingAddressFormatted = {
            street: shippingAddress.street,
            city: shippingAddress.city,
            state: shippingAddress.state,
            zipCode: shippingAddress.zip,
            country: shippingAddress.country,
          }

          const billingAddressFormatted = {
            street: billingAddress.street,
            city: billingAddress.city,
            state: billingAddress.state,
            zipCode: billingAddress.zip,
            country: billingAddress.country,
          }

          // Create the order in Convex
          const createOrderMutation = useMutation(api.orders.create)
          const orderId = await createOrderMutation({
            buyerId: userId,
            sellerId,
            items: orderItems,
            subtotal,
            tax,
            shipping,
            total,
            status: 'pending',
            paymentStatus: 'pending',
            paymentMethod: paymentMethod.type,
            shippingAddress: shippingAddressFormatted,
            billingAddress: billingAddressFormatted,
            notes,
          })

          // Create new order for local state
          const newOrder: Order = {
            id: orderId,
            userId,
            items: orderItems.map(item => ({
              productId: item.productId,
              name: item.name || '',
              price: item.price,
              quantity: item.quantity,
              sellerId: item.sellerId || sellerId,
              sellerName: item.name ? undefined : items.find(i => i.productId === item.productId)?.product.sellerName,
            })),
            subtotal,
            tax,
            shipping,
            total,
            status: 'pending',
            paymentStatus: 'pending',
            paymentMethod,
            shippingAddress,
            billingAddress,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }

          // Add the new order to the list
          set({
            orders: [...get().orders, newOrder],
            currentOrder: newOrder,
          })

          // Reset checkout
          get().resetCheckout()

          // Show success notification
          showSuccessNotification(
            'Order created',
            `Your order #${orderId.slice(-6)} has been placed successfully.`
          )

          return orderId
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to create order')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Error', err.message)

          throw err
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Get order
      getOrder: async (id: Id<'orders'> | string) => {
        loadingHandler.startLoading()

        try {
          const { orders } = get()

          // Find the order in the local state
          const order = orders.find(order => order.id === id)

          if (order) {
            set({ currentOrder: order })
            return order
          }

          // If not found in local state, fetch from backend
          const getOrderQuery = useQuery(api.orders.getById, { id: id as Id<'orders'> })

          if (getOrderQuery) {
            // Transform the order from Convex format to our local format
            const orderData = getOrderQuery

            // We need to transform the data to match our local format
            // This is a simplified version - in a real app, we would handle all fields properly
            const transformedOrder: Order = {
              id: orderData._id,
              userId: orderData.buyerId,
              items: orderData.items.map((item: any) => ({
                productId: item.productId,
                name: item.name || '',
                price: item.price,
                quantity: item.quantity,
                sellerId: item.sellerId,
                sellerName: item.sellerName,
              })),
              subtotal: orderData.subtotal,
              tax: orderData.tax,
              shipping: orderData.shipping,
              total: orderData.total,
              status: orderData.status as any,
              paymentStatus: orderData.paymentStatus as any,
              paymentMethod: {
                id: 'pm-backend',
                userId: orderData.buyerId,
                type: orderData.paymentMethod,
                brand: 'Unknown',
                last4: '****',
                expMonth: 12,
                expYear: 2025,
                isDefault: true,
              },
              shippingAddress: {
                id: 'addr-shipping-backend',
                userId: orderData.buyerId,
                name: 'Shipping Address',
                street: orderData.shippingAddress.street,
                city: orderData.shippingAddress.city,
                state: orderData.shippingAddress.state,
                zip: orderData.shippingAddress.zipCode,
                country: orderData.shippingAddress.country,
                isDefault: true,
              },
              billingAddress: {
                id: 'addr-billing-backend',
                userId: orderData.buyerId,
                name: 'Billing Address',
                street: orderData.billingAddress.street,
                city: orderData.billingAddress.city,
                state: orderData.billingAddress.state,
                zip: orderData.billingAddress.zipCode,
                country: orderData.billingAddress.country,
                isDefault: false,
              },
              createdAt: orderData.createdAt,
              updatedAt: orderData.updatedAt,
            }

            // Add the order to our local state
            set({
              orders: [...orders, transformedOrder],
              currentOrder: transformedOrder,
            })

            return transformedOrder
          }

          set({ currentOrder: null })
          return null
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to get order')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Error', err.message)

          return null
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Get orders
      getOrders: async (userId: Id<'users'> | null) => {
        if (!userId) return []

        loadingHandler.startLoading()

        try {
          // Get orders from Convex
          const getOrdersQuery = useQuery(api.orders.getByBuyer, { buyerId: userId })

          if (getOrdersQuery) {
            // Transform the orders from Convex format to our local format
            const transformedOrders: Order[] = getOrdersQuery.map((orderData: any) => ({
              id: orderData._id,
              userId: orderData.buyerId,
              items: orderData.items.map((item: any) => ({
                productId: item.productId,
                name: item.name || '',
                price: item.price,
                quantity: item.quantity,
                sellerId: item.sellerId,
                sellerName: item.sellerName,
              })),
              subtotal: orderData.subtotal,
              tax: orderData.tax,
              shipping: orderData.shipping,
              total: orderData.total,
              status: orderData.status as any,
              paymentStatus: orderData.paymentStatus as any,
              paymentMethod: {
                id: 'pm-backend',
                userId: orderData.buyerId,
                type: orderData.paymentMethod,
                brand: 'Unknown',
                last4: '****',
                expMonth: 12,
                expYear: 2025,
                isDefault: true,
              },
              shippingAddress: {
                id: 'addr-shipping-backend',
                userId: orderData.buyerId,
                name: 'Shipping Address',
                street: orderData.shippingAddress.street,
                city: orderData.shippingAddress.city,
                state: orderData.shippingAddress.state,
                zip: orderData.shippingAddress.zipCode,
                country: orderData.shippingAddress.country,
                isDefault: true,
              },
              billingAddress: {
                id: 'addr-billing-backend',
                userId: orderData.buyerId,
                name: 'Billing Address',
                street: orderData.billingAddress.street,
                city: orderData.billingAddress.city,
                state: orderData.billingAddress.state,
                zip: orderData.billingAddress.zipCode,
                country: orderData.billingAddress.country,
                isDefault: false,
              },
              createdAt: orderData.createdAt,
              updatedAt: orderData.updatedAt,
            }))

            // Update our local state
            set({ orders: transformedOrders })

            return transformedOrders
          }

          return get().orders
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to get orders')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Error', err.message)

          return []
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Cancel order
      cancelOrder: async (id: Id<'orders'> | string) => {
        loadingHandler.startLoading()

        try {
          const { orders } = get()

          // Find the order to cancel
          const orderIndex = orders.findIndex(order => order.id === id)

          if (orderIndex === -1) {
            throw new Error(`Order with ID ${id} not found`)
          }

          // Cancel the order in Convex
          const cancelOrderMutation = useMutation(api.orders.cancel)
          await cancelOrderMutation({ id: id as Id<'orders'> })

          // Update the order status in our local state
          const updatedOrders = [...orders]
          updatedOrders[orderIndex] = {
            ...updatedOrders[orderIndex],
            status: 'cancelled',
            updatedAt: Date.now(),
          }

          set({ orders: updatedOrders })

          // If this is the current order, update it
          if (get().currentOrder?.id === id) {
            set({ currentOrder: updatedOrders[orderIndex] })
          }

          // Show success notification
          showSuccessNotification(
            'Order cancelled',
            `Order #${id.toString().slice(-6)} has been cancelled.`
          )
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to cancel order')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Error', err.message)

          throw err
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Sync with backend
      syncWithBackend: async (userId: Id<'users'> | null) => {
        if (!userId) return

        loadingHandler.startLoading()

        try {
          // Get orders from Convex
          await get().getOrders(userId)
        } catch (error) {
          const err = error instanceof Error ? error : new Error('Failed to sync orders with backend')
          errorHandler.setError(err)

          // Show error notification
          showErrorNotification('Error', err.message)
        } finally {
          loadingHandler.stopLoading()
        }
      },

      // Set checkout step
      setCheckoutStep: (step: CheckoutState['step']) => {
        set({ checkout: { ...get().checkout, step } })
      },

      // Set shipping address
      setShippingAddress: (id: string | null) => {
        set({ checkout: { ...get().checkout, shippingAddressId: id } })
      },

      // Set billing address
      setBillingAddress: (id: string | null) => {
        set({ checkout: { ...get().checkout, billingAddressId: id } })
      },

      // Set payment method
      setPaymentMethod: (id: string | null) => {
        set({ checkout: { ...get().checkout, paymentMethodId: id } })
      },

      // Set shipping method
      setShippingMethod: (method: CheckoutState['shippingMethod']) => {
        set({ checkout: { ...get().checkout, shippingMethod: method } })
      },

      // Set notes
      setNotes: (notes: string) => {
        set({ checkout: { ...get().checkout, notes } })
      },

      // Reset checkout
      resetCheckout: () => {
        set({
          checkout: {
            step: 'shipping',
            shippingAddressId: null,
            billingAddressId: null,
            paymentMethodId: null,
            shippingMethod: 'standard',
            notes: '',
          }
        })
      },

      // Reset
      ...resetHandler,
    }
  }
)
