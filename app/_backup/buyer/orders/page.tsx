"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { OrderList, OrderStats } from "@/components/orders"
import { useGlobalOrders } from "@/hooks/use-global-orders"

export default function OrdersPage() {
  // Get orders from global state
  const { filteredOrders, isLoading } = useGlobalOrders()

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">View and manage all your orders in one place.</p>
      </div>

      {/* Order Stats */}
      <OrderStats
        orders={filteredOrders}
        testId="order-stats"
      />

      {/* Order History */}
      <Card>
        <CardHeader>
          <CardTitle>Order History</CardTitle>
          <CardDescription>A complete list of all your orders.</CardDescription>
        </CardHeader>
        <CardContent>
          <OrderList
            orders={filteredOrders}
            isLoading={isLoading}
            role="buyer"
            testId="orders-list"
          />
        </CardContent>
      </Card>
    </div>
  )
}
