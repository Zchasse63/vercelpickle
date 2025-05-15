"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DynamicChart } from "@/components/charts/dynamic-chart"

interface SellerRevenueChartProps extends React.HTMLAttributes<HTMLDivElement> {}

export function SellerRevenueChart({ className, ...props }: SellerRevenueChartProps) {
  // This would typically come from your data fetching logic
  const data = [
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

  return (
    <Card className={`${className} border border-border/40 shadow-sm w-full`} {...props}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Revenue Overview</CardTitle>
            <CardDescription>Monthly revenue and order trends for the current year</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="h-3 w-3 rounded-full bg-primary"></div>
              <span className="text-xs text-muted-foreground">Revenue</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="h-3 w-3 rounded-full bg-primary/60"></div>
              <span className="text-xs text-muted-foreground">Orders</span>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="aspect-[4/3] w-full" data-testid="sales-chart">
          <DynamicChart
            data={{
              labels: data.map(item => item.date),
              datasets: [
                {
                  label: 'Revenue',
                  data: data.map(item => item.revenue),
                  backgroundColor: 'rgba(var(--primary), 0.1)',
                  borderColor: 'hsl(var(--primary))',
                  borderWidth: 2,
                  tension: 0.4,
                  pointRadius: 0,
                  pointHoverRadius: 6,
                  yAxisID: 'y',
                },
                {
                  label: 'Orders',
                  data: data.map(item => item.orders),
                  backgroundColor: 'rgba(var(--primary), 0.05)',
                  borderColor: 'hsl(var(--primary) / 0.6)',
                  borderWidth: 2,
                  tension: 0.4,
                  pointRadius: 0,
                  pointHoverRadius: 6,
                  yAxisID: 'y1',
                }
              ]
            }}
            type="line"
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  type: 'linear',
                  display: true,
                  position: 'left',
                  beginAtZero: true,
                  grid: {
                    drawBorder: false,
                  },
                  ticks: {
                    callback: (value: number) => `$${value}`
                  }
                },
                y1: {
                  type: 'linear',
                  display: true,
                  position: 'right',
                  beginAtZero: true,
                  grid: {
                    drawOnChartArea: false,
                  }
                },
                x: {
                  grid: {
                    display: false,
                    drawBorder: false,
                  }
                }
              },
              plugins: {
                tooltip: {
                  callbacks: {
                    label: (context: any) => {
                      const label = context.dataset.label || '';
                      const value = context.raw;
                      if (label === 'Revenue') {
                        return `${label}: $${value}`;
                      }
                      return `${label}: ${value}`;
                    }
                  }
                }
              }
            }}
            height={300}
            className="w-full h-full"
          />
        </div>
      </CardContent>
    </Card>
  )
}
