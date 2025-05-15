"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  OrderActions,
  OrderDetails,
  OrderItems,
  OrderSummary,
  OrderTimeline
} from "@/components/orders"
import { useGlobalOrders } from "@/hooks/use-global-orders"
import { formatDate } from "@/lib/utils"
import { Loader2 } from "lucide-react"

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  // Get order from global state
  const { getOrderById, currentOrder, isLoading } = useGlobalOrders()

  // Load order when component mounts
  useEffect(() => {
    getOrderById(params.id)
  }, [params.id, getOrderById])

  // If loading, show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading order details...</p>
      </div>
    )
  }

  // If no order, show not found state
  if (!currentOrder) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <h2 className="text-2xl font-bold mb-2">Order Not Found</h2>
        <p className="text-muted-foreground mb-6">We couldn't find the order you're looking for.</p>
        <Button asChild>
          <Link href="/buyer/orders">Back to Orders</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6" data-testid="order-details">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/buyer/orders" data-testid="back-to-orders">
                ← Back to Orders
              </Link>
            </Button>
            <h1 className="text-3xl font-bold tracking-tight" data-testid="order-id">
              Order #{typeof currentOrder.id === 'string' ? currentOrder.id.slice(-6) : currentOrder.id}
            </h1>
          </div>
          <p className="text-muted-foreground" data-testid="order-date">
            Placed on {formatDate(new Date(currentOrder.createdAt))}
          </p>
        </div>
        <OrderActions
          order={currentOrder}
          testId="order-actions"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Timeline</CardTitle>
              <CardDescription>Track the progress of your order.</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderTimeline
                order={currentOrder}
                testId="order-timeline"
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
              <CardDescription>Items included in your order.</CardDescription>
            </CardHeader>
            <CardContent>
              <OrderItems
                items={currentOrder.items}
                testId="order-items"
              />
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderSummary
                order={currentOrder}
                testId="order-summary"
              />
            </CardContent>
          </Card>

          <OrderDetails
            order={currentOrder}
            testId="order-details-card"
          />
        </div>
      </div>
    </div>
  )
}
