"use client"

import type React from "react"

import { format } from "date-fns"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface SellerRecentOrdersProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SellerRecentOrders({ className, ...props }: SellerRecentOrdersProps) {
  // This would typically come from your data fetching logic
  const orders = [
    {
      id: "ORD-001",
      customer: "Acme Restaurant",
      date: new Date("2023-05-15"),
      amount: "$345.00",
      status: "Delivered",
    },
    {
      id: "ORD-002",
      customer: "Metro Grocery",
      date: new Date("2023-05-14"),
      amount: "$528.50",
      status: "Processing",
    },
    {
      id: "ORD-003",
      customer: "Sunshine Cafe",
      date: new Date("2023-05-13"),
      amount: "$125.00",
      status: "Shipped",
    },
    {
      id: "ORD-004",
      customer: "Green Leaf Catering",
      date: new Date("2023-05-12"),
      amount: "$890.75",
      status: "Delivered",
    },
    {
      id: "ORD-005",
      customer: "City Bistro",
      date: new Date("2023-05-11"),
      amount: "$246.30",
      status: "Processing",
    },
  ]

  return (
    <Card className={className} {...props} data-testid="recent-orders">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Orders</CardTitle>
          <CardDescription>Your most recent customer orders</CardDescription>
        </div>
        <Button variant="outline" size="sm" data-testid="view-all-orders-button">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id} data-testid="order-item">
                <TableCell className="font-medium" data-testid="order-id">{order.id}</TableCell>
                <TableCell data-testid="order-customer">{order.customer}</TableCell>
                <TableCell data-testid="order-date">{format(order.date, "MMM dd, yyyy")}</TableCell>
                <TableCell data-testid="order-amount">{order.amount}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "Delivered" ? "success" : order.status === "Shipped" ? "default" : "outline"
                    }
                    data-testid="order-status"
                  >
                    {order.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
