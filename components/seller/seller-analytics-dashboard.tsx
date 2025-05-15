"use client"

import { useState } from "react"
import { DynamicChart } from "@/components/charts/dynamic-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

// Sample data for the chart
const data = [
  { name: "Mon", sales: 1200 },
  { name: "Tue", sales: 1900 },
  { name: "Wed", sales: 1500 },
  { name: "Thu", sales: 2200 },
  { name: "Fri", sales: 2500 },
  { name: "Sat", sales: 1800 },
  { name: "Sun", sales: 1100 },
]

// Sample top products data
const topProducts = [
  { id: 1, name: "Organic Carrots (5lb)", sales: 245, revenue: "$1,225.00", growth: "+12%" },
  { id: 2, name: "Fresh Milk (1 Gallon)", sales: 189, revenue: "$1,039.50", growth: "+8%" },
  { id: 3, name: "Artisan Bread Loaf", sales: 156, revenue: "$624.00", growth: "+5%" },
  { id: 4, name: "Russet Potatoes (10lb)", sales: 132, revenue: "$924.00", growth: "+3%" },
  { id: 5, name: "Premium Coffee Beans (1lb)", sales: 98, revenue: "$1,470.00", growth: "+15%" },
]

export function SellerAnalyticsDashboard() {
  const [period, setPeriod] = useState("7days")
  const [exportFormat, setExportFormat] = useState("CSV")
  const [exportDateRange, setExportDateRange] = useState("30days")
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  const handleExport = () => {
    // Simulate export process
    setExportSuccess(true)
    setTimeout(() => setExportSuccess(false), 3000)
  }

  return (
    <div className="space-y-6" data-testid="analytics-dashboard">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-muted-foreground">View your store performance metrics</p>
        </div>
        <div>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => setShowExportOptions(!showExportOptions)}
            data-testid="export-data-button"
          >
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {showExportOptions && (
        <Card className="animate-fade-in">
          <CardHeader>
            <CardTitle>Export Analytics Data</CardTitle>
            <CardDescription>Select format and date range for export</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <label className="text-sm font-medium">Format</label>
                <Select value={exportFormat} onValueChange={setExportFormat}>
                  <SelectTrigger data-testid="export-format-select">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CSV">CSV</SelectItem>
                    <SelectItem value="Excel">Excel</SelectItem>
                    <SelectItem value="PDF">PDF</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Date Range</label>
                <Select value={exportDateRange} onValueChange={setExportDateRange}>
                  <SelectTrigger data-testid="export-date-range">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7days">Last 7 days</SelectItem>
                    <SelectItem value="30days">Last 30 days</SelectItem>
                    <SelectItem value="90days">Last 90 days</SelectItem>
                    <SelectItem value="year">This year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleExport} data-testid="download-export-button">
                Download
              </Button>
            </div>
            {exportSuccess && (
              <div className="mt-4 p-2 bg-green-50 text-green-700 rounded-md">
                Export successful
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Sales Overview</CardTitle>
            <CardDescription>Daily sales performance</CardDescription>
          </div>
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-36" data-testid="period-selector">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <div className="h-80" data-testid="sales-chart">
            <DynamicChart
              data={{
                labels: data.map(item => item.name),
                datasets: [
                  {
                    label: 'Sales',
                    data: data.map(item => item.sales),
                    backgroundColor: '#5A9A3D',
                    borderColor: '#5A9A3D',
                    borderWidth: 1,
                    borderRadius: 4,
                    barPercentage: 0.6,
                  }
                ]
              }}
              type="bar"
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      drawBorder: false,
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
                        return `Sales: $${context.raw}`;
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

      <Card>
        <CardHeader>
          <CardTitle>Top Products</CardTitle>
          <CardDescription>Your best-selling products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4" data-testid="top-products">
            {topProducts.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                data-testid="product-performance-item"
              >
                <div>
                  <div className="font-medium">{product.name}</div>
                  <div className="text-sm text-muted-foreground">{product.sales} units sold</div>
                </div>
                <div className="text-right">
                  <div className="font-medium">{product.revenue}</div>
                  <div className="text-sm text-green-600">{product.growth}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
