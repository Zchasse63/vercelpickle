"use client"

import { useState } from "react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SellerSalesChart() {
  const [timeRange, setTimeRange] = useState("year")

  // This would typically come from your data fetching logic
  const yearlyData = [
    { date: "Jan", revenue: 1200, orders: 42 },
    { date: "Feb", revenue: 1800, orders: 58 },
    { date: "Mar", revenue: 2400, orders: 75 },
    { date: "Apr", revenue: 2100, orders: 68 },
    { date: "May", revenue: 2800, orders: 82 },
    { date: "Jun", revenue: 3200, orders: 95 },
    { date: "Jul", revenue: 3800, orders: 110 },
    { date: "Aug", revenue: 3500, orders: 105 },
    { date: "Sep", revenue: 4000, orders: 120 },
    { date: "Oct", revenue: 4200, orders: 130 },
    { date: "Nov", revenue: 4800, orders: 145 },
    { date: "Dec", revenue: 5200, orders: 160 },
  ]

  const monthlyData = [
    { date: "Week 1", revenue: 1200, orders: 42 },
    { date: "Week 2", revenue: 1500, orders: 48 },
    { date: "Week 3", revenue: 1800, orders: 52 },
    { date: "Week 4", revenue: 2100, orders: 58 },
  ]

  const weeklyData = [
    { date: "Mon", revenue: 300, orders: 12 },
    { date: "Tue", revenue: 450, orders: 15 },
    { date: "Wed", revenue: 500, orders: 18 },
    { date: "Thu", revenue: 470, orders: 16 },
    { date: "Fri", revenue: 600, orders: 22 },
    { date: "Sat", revenue: 750, orders: 28 },
    { date: "Sun", revenue: 580, orders: 20 },
  ]

  const data = timeRange === "year" ? yearlyData : timeRange === "month" ? monthlyData : weeklyData

  return (
    <Card className="col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>Revenue and order trends over time</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-36">
            <SelectValue placeholder="Select range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            revenue: {
              label: "Revenue",
              color: "hsl(var(--chart-1))",
            },
            orders: {
              label: "Orders",
              color: "hsl(var(--chart-2))",
            },
          }}
          className="aspect-[4/3]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="var(--color-revenue)"
                strokeWidth={2}
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey="orders" stroke="var(--color-orders)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
