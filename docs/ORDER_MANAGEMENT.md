# Order Management

## Overview

The order management system is a comprehensive solution for managing orders across the application. It leverages our global state management system to provide a seamless experience for users to view, track, and manage their orders.

## Key Features

- **Order Listing**: Users can view a list of their orders with filtering and search capabilities.
- **Order Details**: Users can view detailed information about a specific order, including order items, timeline, and shipping information.
- **Order Actions**: Users can perform actions on their orders, such as cancelling an order or downloading an invoice.
- **Order Timeline**: Users can track the progress of their orders with a visual timeline.
- **Order Statistics**: Users can view statistics about their orders, such as total orders, pending orders, and delivered orders.

## Component Hierarchy

```
components/orders/
├── index.ts                # Exports all order components
├── order-status.tsx        # Component for displaying order status badges
├── order-items.tsx         # Component for displaying order items
├── order-summary.tsx       # Component for displaying order summary
├── order-timeline.tsx      # Component for displaying order timeline
├── order-actions.tsx       # Component for displaying order actions
├── order-details.tsx       # Component for displaying order details
├── order-card.tsx          # Component for displaying order cards
├── order-list.tsx          # Component for displaying a list of orders
└── order-stats.tsx         # Component for displaying order statistics
```

## Order Status Types

The order management system supports the following order status types:

- **Pending**: The order has been placed but not yet processed.
- **Processing**: The order is being processed.
- **Shipped**: The order has been shipped.
- **Delivered**: The order has been delivered.
- **Cancelled**: The order has been cancelled.

## Order Components

### OrderStatus

The `OrderStatus` component displays an order status badge with appropriate styling based on the status.

```tsx
<OrderStatus status="delivered" />
```

### OrderItems

The `OrderItems` component displays a list of order items in a table.

```tsx
<OrderItems items={order.items} />
```

### OrderSummary

The `OrderSummary` component displays a summary of the order, including subtotal, shipping, tax, and total.

```tsx
<OrderSummary order={order} />
```

### OrderTimeline

The `OrderTimeline` component displays a visual timeline of the order's progress.

```tsx
<OrderTimeline order={order} />
```

### OrderActions

The `OrderActions` component displays action buttons for the order, such as downloading an invoice or cancelling the order.

```tsx
<OrderActions order={order} />
```

### OrderDetails

The `OrderDetails` component displays detailed information about the order, including shipping address, billing address, and payment method.

```tsx
<OrderDetails order={order} />
```

### OrderCard

The `OrderCard` component displays a card with summary information about an order.

```tsx
<OrderCard order={order} role="buyer" />
```

### OrderList

The `OrderList` component displays a list of orders with filtering and search capabilities.

```tsx
<OrderList orders={orders} role="buyer" />
```

### OrderStats

The `OrderStats` component displays statistics about orders, such as total orders, pending orders, and delivered orders.

```tsx
<OrderStats orders={orders} />
```

## Integration with Global State

The order management system is integrated with our global state management system:

- **Order Store**: Manages order state, including orders, current order, and checkout state.
- **useGlobalOrders Hook**: Provides a simplified interface for accessing order state and methods.

## Usage Examples

### Displaying a List of Orders

```tsx
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
```

### Displaying Order Details

```tsx
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
```

## Best Practices

1. **Use Global State**: Use global state to manage order state across components.
2. **Use Reusable Components**: Use reusable components for displaying order information.
3. **Add TestIDs**: Add testId props to all components for testing.
4. **Handle Loading States**: Handle loading states for asynchronous operations.
5. **Handle Error States**: Handle error states for asynchronous operations.
6. **Use Consistent UI**: Use consistent UI patterns across all components.
7. **Use Responsive Design**: Ensure components work well on all device sizes.
8. **Use Proper Typing**: Use proper TypeScript typing for all components and data.
9. **Use Proper Formatting**: Use proper formatting for dates, prices, and other data.
10. **Use Proper Error Handling**: Handle errors gracefully and provide helpful error messages.
