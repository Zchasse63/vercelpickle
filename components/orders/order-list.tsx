"use client"

import React, { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Order, OrderStatusType } from "@/lib/store/order-store"
import { OrderCard } from "./order-card"
import { Loader2 } from "lucide-react"

interface OrderListProps {
  orders: Order[]
  role?: "buyer" | "seller" | "admin"
  isLoading?: boolean
  className?: string
  testId?: string
}

/**
 * OrderList component
 * 
 * A component for displaying a list of orders with filtering and search.
 */
export function OrderList({
  orders,
  role = "buyer",
  isLoading = false,
  className,
  testId,
}: OrderListProps) {
  // State for search and filter
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  
  // Filter orders based on search term and status filter
  const filteredOrders = orders.filter(order => {
    // Filter by search term
    const searchMatch = 
      searchTerm === "" || 
      order.id.toString().toLowerCase().includes(searchTerm.toLowerCase())
    
    // Filter by status
    const statusMatch = 
      statusFilter === "all" || 
      order.status === statusFilter
    
    return searchMatch && statusMatch
  })
  
  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }
  
  // Handle status filter change
  const handleStatusFilterChange = (value: string) => {
    setStatusFilter(value)
  }
  
  // If loading, show loading state
  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`} data-testid={`${testId}-loading`}>
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading orders...</p>
      </div>
    )
  }
  
  // If no orders, show empty state
  if (orders.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-12 ${className}`} data-testid={`${testId}-empty`}>
        <p className="text-muted-foreground mb-4">You don't have any orders yet.</p>
        <Button asChild>
          <a href="/marketplace">Browse Products</a>
        </Button>
      </div>
    )
  }
  
  return (
    <div className={className} data-testid={testId}>
      {/* Filters */}
      <div className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <Input 
            placeholder="Search orders..." 
            className="w-full sm:w-[300px]"
            value={searchTerm}
            onChange={handleSearchChange}
            data-testid={`${testId}-search`}
          />
        </div>
        <div className="flex items-center gap-2">
          <Select 
            value={statusFilter} 
            onValueChange={handleStatusFilterChange}
            data-testid={`${testId}-status-filter`}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Orders</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      {/* Orders Grid */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12" data-testid={`${testId}-no-results`}>
          <p className="text-muted-foreground">No orders found matching your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" data-testid={`${testId}-grid`}>
          {filteredOrders.map((order, index) => (
            <OrderCard 
              key={order.id.toString()}
              order={order}
              role={role}
              testId={`${testId}-order-${index}`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
