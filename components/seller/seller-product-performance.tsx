"use client"

import { useState } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function SellerProductPerformance() {
  const [metric, setMetric] = useState("revenue")

  // This would typically come from your data fetching logic
  const data = [
    {
      name: "Organic Carrots",
      revenue: 1225,
      units: 245,
    },
    {
      name: "Fresh Milk",
      revenue: 990,
      units: 198,
    },
    {
      name: "Artisan Bread",
      revenue: 780,
      units: 156,
    },
    {
      name: "Organic Spinach",
      revenue: 660,
      units: 132,
    },
    {
      name: "Russet Potatoes",
      revenue: 620,
      units: 124,
    },
  ]

  return (
    <Card data-testid="top-products">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Product Performance</CardTitle>
          <CardDescription>
            Top performing products by {metric === "revenue" ? "revenue" : "units sold"}
          </CardDescription>
        </div>
        <Select value={metric} onValueChange={setMetric}>
          <SelectTrigger className="w-36" data-testid="metric-selector">
            <SelectValue placeholder="Select metric" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="revenue">Revenue</SelectItem>
            <SelectItem value="units">Units Sold</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            [metric]: {
              label: metric === "revenue" ? "Revenue" : "Units Sold",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="aspect-[4/3]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis dataKey="name" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey={metric} fill={`var(--color-${metric})`} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
