"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { MoreHorizontal } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function SellerOrdersTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // This would typically come from your data fetching logic
  const orders = [
    {
      id: "ORD-001",
      customer: "Acme Restaurant",
      date: new Date("2023-05-15"),
      amount: "$345.00",
      status: "Delivered",
      items: 8,
    },
    {
      id: "ORD-002",
      customer: "Metro Grocery",
      date: new Date("2023-05-14"),
      amount: "$528.50",
      status: "Processing",
      items: 12,
    },
    {
      id: "ORD-003",
      customer: "Sunshine Cafe",
      date: new Date("2023-05-13"),
      amount: "$125.00",
      status: "Shipped",
      items: 3,
    },
    {
      id: "ORD-004",
      customer: "Green Leaf Catering",
      date: new Date("2023-05-12"),
      amount: "$890.75",
      status: "Delivered",
      items: 15,
    },
    {
      id: "ORD-005",
      customer: "City Bistro",
      date: new Date("2023-05-11"),
      amount: "$246.30",
      status: "Processing",
      items: 6,
    },
    {
      id: "ORD-006",
      customer: "Fresh Foods Market",
      date: new Date("2023-05-10"),
      amount: "$412.25",
      status: "Pending",
      items: 9,
    },
    {
      id: "ORD-007",
      customer: "Gourmet Deli",
      date: new Date("2023-05-09"),
      amount: "$178.50",
      status: "Cancelled",
      items: 4,
    },
  ]

  // Filter orders based on search query and status
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <Input
            placeholder="Search orders..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36" data-testid="status-filter">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Processing">Processing</SelectItem>
              <SelectItem value="Shipped">Shipped</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="All Time">
            <SelectTrigger className="w-36" data-testid="date-filter">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Time">All Time</SelectItem>
              <SelectItem value="Today">Today</SelectItem>
              <SelectItem value="Last 7 days">Last 7 days</SelectItem>
              <SelectItem value="Last 30 days">Last 30 days</SelectItem>
              <SelectItem value="This Month">This Month</SelectItem>
              <SelectItem value="Last Month">Last Month</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            Export
          </Button>
          <Button variant="outline" size="sm">
            Print
          </Button>
        </div>
      </div>
      <div className="rounded-md border">
        <Table data-testid="orders-table">
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} data-testid="order-row">
                <TableCell className="font-medium" data-testid="order-id">{order.id}</TableCell>
                <TableCell data-testid="order-customer">{order.customer}</TableCell>
                <TableCell data-testid="order-date">{format(order.date, "MMM dd, yyyy")}</TableCell>
                <TableCell>{order.items}</TableCell>
                <TableCell data-testid="order-amount">{order.amount}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      order.status === "Delivered"
                        ? "success"
                        : order.status === "Shipped"
                          ? "default"
                          : order.status === "Processing"
                            ? "outline"
                            : order.status === "Pending"
                              ? "secondary"
                              : "destructive"
                    }
                    data-testid="order-status"
                  >
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="flex items-center">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/seller/orders/${order.id}`} className="flex items-center" data-testid="view-order-button">
                          View details
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Update status</DropdownMenuItem>
                      <DropdownMenuItem>Print invoice</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
