"use client"

import React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate, formatPrice } from "@/lib/utils"
import { Order } from "@/lib/store/order-store"
import { OrderStatus } from "./order-status"

interface OrderCardProps {
  order: Order
  role?: "buyer" | "seller" | "admin"
  className?: string
  testId?: string
}

/**
 * OrderCard component
 * 
 * A component for displaying an order card in a list.
 */
export function OrderCard({
  order,
  role = "buyer",
  className,
  testId,
}: OrderCardProps) {
  // Get the appropriate link based on role
  const getOrderLink = () => {
    switch (role) {
      case "buyer":
        return `/buyer/orders/${order.id}`
      case "seller":
        return `/seller/orders/${order.id}`
      case "admin":
        return `/admin/orders/${order.id}`
      default:
        return `/buyer/orders/${order.id}`
    }
  }
  
  // Get the number of items in the order
  const itemCount = order.items.reduce((total, item) => total + item.quantity, 0)
  
  return (
    <Card className={className} data-testid={testId}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg" data-testid={`${testId}-id`}>
            Order #{typeof order.id === 'string' ? order.id.slice(-6) : order.id}
          </CardTitle>
          <OrderStatus 
            status={order.status} 
            testId={`${testId}-status`}
          />
        </div>
        <div className="text-sm text-muted-foreground" data-testid={`${testId}-date`}>
          {formatDate(new Date(order.createdAt))}
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Items</span>
            <span data-testid={`${testId}-item-count`}>{itemCount} items</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total</span>
            <span className="font-medium" data-testid={`${testId}-total`}>
              {formatPrice(order.total)}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Payment</span>
            <span 
              className={`capitalize ${
                order.paymentStatus === "paid" 
                  ? "text-green-500" 
                  : order.paymentStatus === "failed" 
                    ? "text-red-500" 
                    : ""
              }`}
              data-testid={`${testId}-payment-status`}
            >
              {order.paymentStatus}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full"
          asChild
          data-testid={`${testId}-view-button`}
        >
          <Link href={getOrderLink()}>
            View Order
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
