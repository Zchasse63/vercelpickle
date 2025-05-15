"use client"

import { useState } from "react"
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns"
import { Download, Calendar, TrendingUp, DollarSign, BarChart3, PieChart, ArrowUpRight, ArrowDownRight } from "lucide-react"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui-kit"

// Mock financial data
const financialSummary = {
  totalRevenue: 125000.00,
  platformFees: 6250.00,
  transactionCount: 250,
  activeUsers: 120,
  averageOrderValue: 500.00,
  growthRate: 15.2,
}

// Mock monthly data for charts
const monthlyData = [
  { month: "Jan", revenue: 8500, fees: 425, transactions: 17 },
  { month: "Feb", revenue: 9200, fees: 460, transactions: 18 },
  { month: "Mar", revenue: 10500, fees: 525, transactions: 21 },
  { month: "Apr", revenue: 11800, fees: 590, transactions: 24 },
  { month: "May", revenue: 12500, fees: 625, transactions: 25 },
  { month: "Jun", revenue: 13200, fees: 660, transactions: 26 },
  { month: "Jul", revenue: 14500, fees: 725, transactions: 29 },
  { month: "Aug", revenue: 15800, fees: 790, transactions: 32 },
  { month: "Sep", revenue: 14200, fees: 710, transactions: 28 },
  { month: "Oct", revenue: 13500, fees: 675, transactions: 27 },
  { month: "Nov", revenue: 15000, fees: 750, transactions: 30 },
  { month: "Dec", revenue: 16500, fees: 825, transactions: 33 },
]

// Mock category data for pie chart
const categoryData = [
  { category: "Produce", percentage: 35, revenue: 43750 },
  { category: "Dairy", percentage: 25, revenue: 31250 },
  { category: "Meat", percentage: 20, revenue: 25000 },
  { category: "Bakery", percentage: 15, revenue: 18750 },
  { category: "Other", percentage: 5, revenue: 6250 },
]

// Mock top sellers data
const topSellers = [
  { id: 1, name: "Farm Fresh Produce", revenue: 18750, transactions: 37, growth: 12.5 },
  { id: 2, name: "Dairy Delights", revenue: 15625, transactions: 31, growth: 8.3 },
  { id: 3, name: "Organic Farms Co.", revenue: 12500, transactions: 25, growth: 15.7 },
  { id: 4, name: "Meat Masters", revenue: 10000, transactions: 20, growth: 5.2 },
  { id: 5, name: "Seafood Specialists", revenue: 8750, transactions: 18, growth: -2.1 },
]

// Date range presets
const dateRanges = {
  "7days": { label: "Last 7 Days", start: subDays(new Date(), 7), end: new Date() },
  "30days": { label: "Last 30 Days", start: subDays(new Date(), 30), end: new Date() },
  "month": { label: "This Month", start: startOfMonth(new Date()), end: endOfMonth(new Date()) },
  "year": { label: "This Year", start: startOfYear(new Date()), end: endOfYear(new Date()) },
}

export function AdminFinancialDashboard() {
  const [dateRange, setDateRange] = useState("30days")
  const [chartType, setChartType] = useState("revenue")

  // Export financial data as CSV
  const exportFinancialData = () => {
    const headers = ["Month", "Revenue", "Platform Fees", "Transactions"]
    const csvData = monthlyData.map(d => [
      d.month,
      d.revenue.toFixed(2),
      d.fees.toFixed(2),
      d.transactions
    ])

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `financial-data-${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financial Dashboard</h2>
          <p className="text-muted-foreground">
            Platform financial performance and metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(dateRanges).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={exportFinancialData}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialSummary.totalRevenue.toFixed(2)}</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>{financialSummary.growthRate}% from previous period</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialSummary.platformFees.toFixed(2)}</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>{financialSummary.growthRate}% from previous period</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Transactions</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialSummary.transactionCount}</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>8.2% from previous period</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${financialSummary.averageOrderValue.toFixed(2)}</div>
            <div className="flex items-center pt-1 text-xs text-green-500">
              <ArrowUpRight className="h-4 w-4 mr-1" />
              <span>6.5% from previous period</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="sellers">Top Sellers</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Overview</CardTitle>
              <CardDescription>
                Platform revenue for {dateRanges[dateRange as keyof typeof dateRanges].label.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted/10">
                <div className="flex flex-col items-center gap-2 text-center">
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Revenue Chart</h3>
                  <p className="text-sm text-muted-foreground">
                    This is a placeholder for the revenue chart visualization
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Platform Fee Distribution</CardTitle>
                <CardDescription>Fee distribution by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center border rounded-md bg-muted/10">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <PieChart className="h-6 w-6 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Fee distribution chart placeholder
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Volume</CardTitle>
                <CardDescription>Number of transactions over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center border rounded-md bg-muted/10">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <BarChart3 className="h-6 w-6 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Transaction volume chart placeholder
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>
                    Detailed revenue breakdown over time
                  </CardDescription>
                </div>
                <div className="w-[150px] mt-2 md:mt-0">
                  <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chart" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="revenue">Revenue</SelectItem>
                    <SelectItem value="fees">Platform Fees</SelectItem>
                    <SelectItem value="transactions">Transaction Count</SelectItem>
                  </SelectContent>
                </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[350px] flex items-center justify-center border rounded-md bg-muted/10">
                <div className="flex flex-col items-center gap-2 text-center">
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  <h3 className="text-lg font-medium">{chartType === "revenue" ? "Revenue" : chartType === "fees" ? "Platform Fees" : "Transaction Count"} Chart</h3>
                  <p className="text-sm text-muted-foreground">
                    This is a placeholder for the {chartType} chart visualization
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto" onClick={exportFinancialData}>
                <Download className="mr-2 h-4 w-4" />
                Export Data
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="sellers">
          <Card>
            <CardHeader>
              <CardTitle>Top Performing Sellers</CardTitle>
              <CardDescription>
                Sellers with the highest revenue for {dateRanges[dateRange as keyof typeof dateRanges].label.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Seller</TableHead>
                      <TableHead className="text-right">Revenue</TableHead>
                      <TableHead className="text-right">Transactions</TableHead>
                      <TableHead className="text-right">Platform Fees</TableHead>
                      <TableHead className="text-right">Growth</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topSellers.map((seller) => (
                      <TableRow key={seller.id}>
                        <TableCell className="font-medium">{seller.name}</TableCell>
                        <TableCell className="text-right">${seller.revenue.toFixed(2)}</TableCell>
                        <TableCell className="text-right">{seller.transactions}</TableCell>
                        <TableCell className="text-right">${(seller.revenue * 0.05).toFixed(2)}</TableCell>
                        <TableCell className="text-right">
                          <div className={`flex items-center justify-end ${seller.growth >= 0 ? "text-green-500" : "text-red-500"}`}>
                            {seller.growth >= 0 ? (
                              <ArrowUpRight className="h-4 w-4 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 mr-1" />
                            )}
                            <span>{Math.abs(seller.growth)}%</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card>
            <CardHeader>
              <CardTitle>Revenue by Category</CardTitle>
              <CardDescription>
                Distribution of revenue across product categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted/10">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <PieChart className="h-8 w-8 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Category Distribution</h3>
                    <p className="text-sm text-muted-foreground">
                      This is a placeholder for the category distribution chart
                    </p>
                  </div>
                </div>

                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                        <TableHead className="text-right">Percentage</TableHead>
                        <TableHead className="text-right">Platform Fees</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {categoryData.map((category, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{category.category}</TableCell>
                          <TableCell className="text-right">${category.revenue.toFixed(2)}</TableCell>
                          <TableCell className="text-right">{category.percentage}%</TableCell>
                          <TableCell className="text-right">${(category.revenue * 0.05).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
