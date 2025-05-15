"use client"

import React from "react"
import { CheckCircle, Clock, Package, ShoppingCart, Truck, XCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Order } from "@/lib/store/order-store"

interface TimelineItem {
  status: string
  date: Date
  description: string
}

interface OrderTimelineProps {
  order: Order
  className?: string
  testId?: string
}

/**
 * OrderTimeline component
 * 
 * A component for displaying order timeline with status updates.
 */
export function OrderTimeline({
  order,
  className,
  testId,
}: OrderTimelineProps) {
  // Generate timeline items based on order status
  const generateTimeline = (order: Order): TimelineItem[] => {
    const timeline: TimelineItem[] = [
      {
        status: "Order Placed",
        date: new Date(order.createdAt),
        description: "Your order has been received and is being processed.",
      },
    ]
    
    // Add payment confirmation
    if (order.paymentStatus === "paid") {
      timeline.push({
        status: "Payment Confirmed",
        date: new Date(order.createdAt + 1000 * 60 * 5), // 5 minutes after order creation
        description: "Your payment has been confirmed and your order is being prepared.",
      })
    } else if (order.paymentStatus === "failed") {
      timeline.push({
        status: "Payment Failed",
        date: new Date(order.createdAt + 1000 * 60 * 5), // 5 minutes after order creation
        description: "There was an issue with your payment. Please update your payment method.",
      })
    }
    
    // Add processing status
    if (order.status === "processing" || order.status === "shipped" || order.status === "delivered") {
      timeline.push({
        status: "Processing",
        date: new Date(order.createdAt + 1000 * 60 * 30), // 30 minutes after order creation
        description: "Your order is being prepared for shipping.",
      })
    }
    
    // Add shipped status
    if (order.status === "shipped" || order.status === "delivered") {
      timeline.push({
        status: "Shipped",
        date: new Date(order.createdAt + 1000 * 60 * 60 * 24), // 1 day after order creation
        description: "Your order has been shipped and is on its way to you.",
      })
    }
    
    // Add delivered status
    if (order.status === "delivered") {
      timeline.push({
        status: "Delivered",
        date: new Date(order.createdAt + 1000 * 60 * 60 * 24 * 3), // 3 days after order creation
        description: "Your order has been delivered.",
      })
    }
    
    // Add cancelled status
    if (order.status === "cancelled") {
      timeline.push({
        status: "Cancelled",
        date: new Date(order.updatedAt),
        description: "Your order has been cancelled.",
      })
    }
    
    // Sort timeline by date
    return timeline.sort((a, b) => a.date.getTime() - b.date.getTime())
  }
  
  const timeline = generateTimeline(order)
  
  // Get icon based on status
  const getIcon = (status: string) => {
    switch (status) {
      case "Order Placed":
        return <ShoppingCart className="h-6 w-6 text-primary" />
      case "Payment Confirmed":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "Payment Failed":
        return <XCircle className="h-6 w-6 text-red-500" />
      case "Processing":
        return <Clock className="h-6 w-6 text-amber-500" />
      case "Shipped":
        return <Truck className="h-6 w-6 text-blue-500" />
      case "Delivered":
        return <Package className="h-6 w-6 text-green-500" />
      case "Cancelled":
        return <XCircle className="h-6 w-6 text-red-500" />
      default:
        return <Clock className="h-6 w-6 text-muted-foreground" />
    }
  }
  
  return (
    <div className={`space-y-6 ${className}`} data-testid={testId}>
      {timeline.map((item, index) => (
        <div key={index} className="flex gap-4" data-testid={`${testId}-item-${index}`}>
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
              {getIcon(item.status)}
            </div>
            {index < timeline.length - 1 && <div className="h-full w-0.5 bg-muted" />}
          </div>
          <div className="flex flex-col pb-6">
            <div className="flex flex-col gap-1">
              <h3 className="font-medium" data-testid={`${testId}-status-${index}`}>{item.status}</h3>
              <p className="text-sm text-muted-foreground" data-testid={`${testId}-date-${index}`}>
                {formatDate(item.date)}
              </p>
            </div>
            <p className="mt-2 text-sm text-muted-foreground" data-testid={`${testId}-description-${index}`}>
              {item.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
