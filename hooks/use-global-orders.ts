"use client"

import { useEffect, useState } from 'react'
import { Id } from '@/convex/_generated/dataModel'
import { useGlobalState } from './use-global-state'
import { Order } from '@/lib/store/order-store'

/**
 * Hook for using orders in components
 * 
 * This hook provides a simplified interface for accessing order state and methods.
 */
export function useGlobalOrders() {
  // Get global state
  const {
    user,
    orders,
    currentOrder,
    isLoading,
    errors,
    getOrders,
    getOrder,
    cancelOrder,
  } = useGlobalState()
  
  // Local state
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(false)
  
  // Load orders when user changes
  useEffect(() => {
    const loadOrders = async () => {
      if (user) {
        setIsLoadingOrders(true)
        
        try {
          await getOrders(user.id)
        } catch (error) {
          console.error("Error loading orders:", error)
        } finally {
          setIsLoadingOrders(false)
        }
      }
    }
    
    loadOrders()
  }, [user, getOrders])
  
  // Update filtered orders when orders change
  useEffect(() => {
    setFilteredOrders(orders)
  }, [orders])
  
  // Get order by ID
  const getOrderById = async (id: string | Id<'orders'>) => {
    try {
      return await getOrder(id)
    } catch (error) {
      console.error("Error getting order:", error)
      return null
    }
  }
  
  // Cancel order
  const cancelOrderById = async (id: string | Id<'orders'>) => {
    try {
      await cancelOrder(id)
      return true
    } catch (error) {
      console.error("Error cancelling order:", error)
      return false
    }
  }
  
  // Filter orders by status
  const filterOrdersByStatus = (status: string) => {
    if (status === "all") {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(orders.filter(order => order.status === status))
    }
  }
  
  // Search orders
  const searchOrders = (searchTerm: string) => {
    if (!searchTerm) {
      setFilteredOrders(orders)
    } else {
      setFilteredOrders(
        orders.filter(order => 
          order.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    }
  }
  
  // Get order statistics
  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(order => order.status === "pending").length,
      processing: orders.filter(order => order.status === "processing").length,
      shipped: orders.filter(order => order.status === "shipped").length,
      delivered: orders.filter(order => order.status === "delivered").length,
      cancelled: orders.filter(order => order.status === "cancelled").length,
    }
  }
  
  return {
    // Order state
    orders,
    filteredOrders,
    currentOrder,
    isLoading: isLoading || isLoadingOrders,
    errors,
    
    // Order methods
    getOrderById,
    cancelOrderById,
    filterOrdersByStatus,
    searchOrders,
    getOrderStats,
  }
}
