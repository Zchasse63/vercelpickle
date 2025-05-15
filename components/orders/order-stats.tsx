"use client"

import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Clock, CheckCircle, AlertTriangle, ArrowUp, ArrowDown } from "lucide-react"
import { Order } from "@/lib/store/order-store"

interface OrderStatsProps {
  orders: Order[]
  className?: string
  testId?: string
}

/**
 * OrderStats component
 * 
 * A component for displaying order statistics.
 */
export function OrderStats({
  orders,
  className,
  testId,
}: OrderStatsProps) {
  // Calculate order statistics
  const totalOrders = orders.length
  
  const pendingOrders = orders.filter(
    order => order.status === "pending" || order.status === "processing"
  ).length
  
  const deliveredOrders = orders.filter(
    order => order.status === "delivered"
  ).length
  
  const issueOrders = orders.filter(
    order => order.status === "cancelled" || order.paymentStatus === "failed"
  ).length
  
  // Calculate percentage change (mock data for now)
  const percentageChange = 5
  
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ${className}`} data-testid={testId}>
      <Card className="border border-border/40 shadow-sm" data-testid={`${testId}-total`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <div className="rounded-full bg-primary/10 p-1">
            <Package className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid={`${testId}-total-count`}>{totalOrders}</div>
          <div className="flex items-center text-xs mt-1">
            <div className="flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5 dark:bg-emerald-950/20">
              <ArrowUp className="mr-1 h-3 w-3 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">+{percentageChange}%</span>
            </div>
            <span className="ml-2 text-muted-foreground">from last month</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-border/40 shadow-sm" data-testid={`${testId}-pending`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <div className="rounded-full bg-amber-100 p-1 dark:bg-amber-900/20">
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid={`${testId}-pending-count`}>{pendingOrders}</div>
          <p className="text-xs text-muted-foreground mt-1">Awaiting processing</p>
        </CardContent>
      </Card>
      
      <Card className="border border-border/40 shadow-sm" data-testid={`${testId}-delivered`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          <div className="rounded-full bg-emerald-100 p-1 dark:bg-emerald-900/20">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid={`${testId}-delivered-count`}>{deliveredOrders}</div>
          <p className="text-xs text-muted-foreground mt-1">Successfully delivered</p>
        </CardContent>
      </Card>
      
      <Card className="border border-border/40 shadow-sm" data-testid={`${testId}-issues`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Issues</CardTitle>
          <div className="rounded-full bg-rose-100 p-1 dark:bg-rose-900/20">
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid={`${testId}-issues-count`}>{issueOrders}</div>
          <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
        </CardContent>
      </Card>
    </div>
  )
}
