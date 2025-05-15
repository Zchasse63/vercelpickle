import Link from "next/link"
import { format } from "date-fns"
import { ArrowRight, CheckCircle, Clock, XCircle } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const recentOrders = [
  {
    id: "ORD-7652",
    customer: "Fresh Foods Market",
    date: new Date("2023-06-12T09:22:31"),
    amount: 125.5,
    status: "completed",
  },
  {
    id: "ORD-7651",
    customer: "Green Grocers Co.",
    date: new Date("2023-06-12T08:45:12"),
    amount: 247.8,
    status: "processing",
  },
  {
    id: "ORD-7650",
    customer: "Healthy Bites Cafe",
    date: new Date("2023-06-12T07:32:45"),
    amount: 86.25,
    status: "completed",
  },
  {
    id: "ORD-7649",
    customer: "Farm to Table Restaurant",
    date: new Date("2023-06-12T06:18:22"),
    amount: 325.4,
    status: "cancelled",
  },
  {
    id: "ORD-7648",
    customer: "Organic Life Store",
    date: new Date("2023-06-11T22:15:36"),
    amount: 174.9,
    status: "completed",
  },
]

export function AdminRecentOrders() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-5 text-xs font-medium text-muted-foreground">
        <div>Order</div>
        <div>Customer</div>
        <div>Date</div>
        <div>Amount</div>
        <div>Status</div>
      </div>
      <div className="space-y-2">
        {recentOrders.map((order) => (
          <Link
            key={order.id}
            href={`/admin/orders/${order.id}`}
            className="grid grid-cols-5 items-center rounded-lg border p-3 text-sm transition-colors hover:bg-muted/50"
          >
            <div className="font-medium">{order.id}</div>
            <div>{order.customer}</div>
            <div>{format(order.date, "MMM dd, h:mm a")}</div>
            <div>${order.amount.toFixed(2)}</div>
            <div>
              <OrderStatusBadge status={order.status} />
            </div>
          </Link>
        ))}
      </div>
      <div className="flex justify-end">
        <Link href="/admin/orders">
          <Button variant="outline" size="sm">
            View all orders
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}

function OrderStatusBadge({ status }: { status: string }) {
  if (status === "completed") {
    return (
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex w-fit items-center gap-1">
        <CheckCircle className="h-3 w-3" />
        Completed
      </Badge>
    )
  }

  if (status === "processing") {
    return (
      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex w-fit items-center gap-1">
        <Clock className="h-3 w-3" />
        Processing
      </Badge>
    )
  }

  if (status === "cancelled") {
    return (
      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200 flex w-fit items-center gap-1">
        <XCircle className="h-3 w-3" />
        Cancelled
      </Badge>
    )
  }

  return <Badge variant="outline">{status}</Badge>
}
