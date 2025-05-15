"use client"

import { useEffect, useState } from "react"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface SalesData {
  lastWeek: number
  lastMonth: number
  lastYear: number
  monthlyTrend: {
    month: string
    sales: number
  }[]
}

export function ProductAnalytics({ salesData }: { salesData: SalesData }) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Week</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{salesData.lastWeek} units</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{salesData.lastMonth} units</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Year</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{salesData.lastYear} units</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg. Monthly</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.round(salesData.lastYear / 12)} units</div>
        </CardContent>
      </Card>
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle>Monthly Sales Trend</CardTitle>
          <CardDescription>Unit sales over the past 6 months</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          {isMounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData.monthlyTrend}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  formatter={(value) => [`${value} units`, "Sales"]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: "6px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Bar dataKey="sales" fill="#16a34a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center">
              <p className="text-muted-foreground">Loading chart...</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
