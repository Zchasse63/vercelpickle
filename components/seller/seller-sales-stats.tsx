"use client"

import { ArrowDown, ArrowUp, DollarSign, Package, ShoppingCart, Users } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SellerSalesStats() {
  // This would typically come from your data fetching logic
  const stats = [
    {
      title: "Total Sales",
      value: "$12,345",
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
    },
    {
      title: "Total Orders",
      value: "356",
      change: "+8.2%",
      trend: "up",
      icon: ShoppingCart,
    },
    {
      title: "Average Order Value",
      value: "$34.68",
      change: "+4.3%",
      trend: "up",
      icon: Package,
    },
    {
      title: "New Customers",
      value: "42",
      change: "-4.5%",
      trend: "down",
      icon: Users,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-testid="sales-metrics">
      {stats.map((stat) => (
        <Card key={stat.title} className="border border-border/40 shadow-sm" data-testid={`${stat.title.toLowerCase().replace(/\s+/g, '-')}-card`}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <div className="rounded-full bg-primary/10 p-1">
              <stat.icon className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold" data-testid={stat.title.toLowerCase().replace(/\s+/g, '-')}>{stat.value}</div>
            <div className="flex items-center text-xs mt-1">
              {stat.trend === "up" ? (
                <div className="flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5 dark:bg-emerald-950/20">
                  <ArrowUp className="mr-1 h-3 w-3 text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400" data-testid={`${stat.title.toLowerCase().replace(/\s+/g, '-')}-change`}>{stat.change}</span>
                </div>
              ) : (
                <div className="flex items-center rounded-full bg-rose-50 px-1.5 py-0.5 dark:bg-rose-950/20">
                  <ArrowDown className="mr-1 h-3 w-3 text-rose-500" />
                  <span className="text-rose-600 dark:text-rose-400" data-testid={`${stat.title.toLowerCase().replace(/\s+/g, '-')}-change`}>{stat.change}</span>
                </div>
              )}
              <span className="ml-2 text-muted-foreground">from last month</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
