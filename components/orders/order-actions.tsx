"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Download, MessageSquare, AlertCircle, Truck } from "lucide-react"
import { Order } from "@/lib/store/order-store"
import { useGlobalState } from "@/hooks/use-global-state"
import { toast } from "@/components/ui/use-toast"

interface OrderActionsProps {
  order: Order
  className?: string
  testId?: string
}

/**
 * OrderActions component
 * 
 * A component for displaying order action buttons.
 */
export function OrderActions({
  order,
  className,
  testId,
}: OrderActionsProps) {
  const { cancelOrder } = useGlobalState()
  
  // Handle cancel order
  const handleCancelOrder = async () => {
    try {
      await cancelOrder(order.id)
      
      toast({
        title: "Order cancelled",
        description: "Your order has been cancelled successfully.",
      })
    } catch (error) {
      console.error("Error cancelling order:", error)
      
      toast({
        title: "Error",
        description: "There was an error cancelling your order. Please try again.",
        variant: "destructive",
      })
    }
  }
  
  // Check if order can be cancelled
  const canCancel = order.status === "pending" || order.status === "processing"
  
  return (
    <div className={`flex items-center gap-2 ${className}`} data-testid={testId}>
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-1"
        data-testid={`${testId}-invoice`}
      >
        <Download className="h-4 w-4" />
        Invoice
      </Button>
      
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-1"
        data-testid={`${testId}-contact`}
      >
        <MessageSquare className="h-4 w-4" />
        Contact Seller
      </Button>
      
      {canCancel && (
        <Button 
          variant="outline" 
          size="sm" 
          className="gap-1 text-red-500 hover:text-red-600"
          onClick={handleCancelOrder}
          data-testid={`${testId}-cancel`}
        >
          <AlertCircle className="h-4 w-4" />
          Cancel Order
        </Button>
      )}
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="icon"
            data-testid={`${testId}-more`}
          >
            <MoreHorizontal className="h-4 w-4" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem data-testid={`${testId}-track`}>
            <Truck className="mr-2 h-4 w-4" />
            Track Shipment
          </DropdownMenuItem>
          <DropdownMenuItem data-testid={`${testId}-return`}>
            Return Item
          </DropdownMenuItem>
          <DropdownMenuItem data-testid={`${testId}-report`}>
            Report Issue
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
