"use client"

import { useState } from "react"
import { format, subDays, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns"
import { Download, Calendar, TrendingUp, DollarSign, BarChart3, PieChart } from "lucide-react"

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

// Mock transaction data
const transactions = [
  {
    id: "TX-1234",
    date: new Date("2025-05-01"),
    buyer: "Metro Grocery",
    product: "Organic Apples (Case)",
    quantity: 10,
    amount: 450.00,
    fee: 22.50,
    net: 427.50,
    status: "completed"
  },
  {
    id: "TX-1242",
    date: new Date("2025-05-02"),
    buyer: "Fresh Foods Market",
    product: "Premium Cheese (Box)",
    quantity: 5,
    amount: 375.00,
    fee: 18.75,
    net: 356.25,
    status: "completed"
  },
  {
    id: "TX-1256",
    date: new Date("2025-05-03"),
    buyer: "Gourmet Restaurants",
    product: "Wild Salmon (Case)",
    quantity: 3,
    amount: 525.00,
    fee: 26.25,
    net: 498.75,
    status: "completed"
  },
  {
    id: "TX-1267",
    date: new Date("2025-05-04"),
    buyer: "Health Foods Inc.",
    product: "Organic Berries (Flat)",
    quantity: 8,
    amount: 320.00,
    fee: 16.00,
    net: 304.00,
    status: "completed"
  },
  {
    id: "TX-1278",
    date: new Date("2025-05-05"),
    buyer: "Sunshine Catering",
    product: "Artisan Bread (Box)",
    quantity: 12,
    amount: 180.00,
    fee: 9.00,
    net: 171.00,
    status: "processing"
  },
]

// Mock monthly data for charts
const monthlyData = [
  { month: "Jan", sales: 12500, fees: 625, transactions: 25 },
  { month: "Feb", sales: 15000, fees: 750, transactions: 30 },
  { month: "Mar", sales: 18500, fees: 925, transactions: 37 },
  { month: "Apr", sales: 22000, fees: 1100, transactions: 44 },
  { month: "May", sales: 19500, fees: 975, transactions: 39 },
  { month: "Jun", sales: 23500, fees: 1175, transactions: 47 },
  { month: "Jul", sales: 28000, fees: 1400, transactions: 56 },
  { month: "Aug", sales: 25500, fees: 1275, transactions: 51 },
  { month: "Sep", sales: 21000, fees: 1050, transactions: 42 },
  { month: "Oct", sales: 24500, fees: 1225, transactions: 49 },
  { month: "Nov", sales: 27000, fees: 1350, transactions: 54 },
  { month: "Dec", sales: 32000, fees: 1600, transactions: 64 },
]

// Mock category data for pie chart
const categoryData = [
  { category: "Produce", percentage: 35 },
  { category: "Dairy", percentage: 25 },
  { category: "Meat", percentage: 20 },
  { category: "Bakery", percentage: 15 },
  { category: "Other", percentage: 5 },
]

// Date range presets
const dateRanges = {
  "7days": { label: "Last 7 Days", start: subDays(new Date(), 7), end: new Date() },
  "30days": { label: "Last 30 Days", start: subDays(new Date(), 30), end: new Date() },
  "month": { label: "This Month", start: startOfMonth(new Date()), end: endOfMonth(new Date()) },
  "year": { label: "This Year", start: startOfYear(new Date()), end: endOfYear(new Date()) },
}

export function SellerFinancialReports() {
  const [dateRange, setDateRange] = useState("30days")
  const [chartType, setChartType] = useState("sales")

  // Calculate summary metrics
  const totalSales = transactions.reduce((sum, t) => sum + t.amount, 0)
  const totalFees = transactions.reduce((sum, t) => sum + t.fee, 0)
  const totalNet = transactions.reduce((sum, t) => sum + t.net, 0)
  const averageOrderValue = totalSales / transactions.length

  // Export transactions as CSV
  const exportTransactions = () => {
    const headers = ["ID", "Date", "Buyer", "Product", "Quantity", "Amount", "Fee", "Net", "Status"]
    const csvData = transactions.map(t => [
      t.id,
      format(t.date, "yyyy-MM-dd"),
      t.buyer,
      t.product,
      t.quantity,
      t.amount.toFixed(2),
      t.fee.toFixed(2),
      t.net.toFixed(2),
      t.status
    ])

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `financial-report-${format(new Date(), "yyyy-MM-dd")}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Financial Reports</h2>
          <p className="text-muted-foreground">
            View and analyze your sales performance and financial metrics
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
          <Button variant="outline" onClick={exportTransactions}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalSales.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +20.1% from previous period
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Platform Fees</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFees.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              5% of total sales
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Earnings</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalNet.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              95% of total sales
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Order Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${averageOrderValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              +12.5% from previous period
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="charts">Charts</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Summary</CardTitle>
              <CardDescription>
                Your sales performance for {dateRanges[dateRange as keyof typeof dateRanges].label.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted/10">
                <div className="flex flex-col items-center gap-2 text-center">
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Sales Chart</h3>
                  <p className="text-sm text-muted-foreground">
                    This is a placeholder for the sales chart visualization
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Your best-selling products</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center border rounded-md bg-muted/10">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <BarChart3 className="h-6 w-6 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Product sales chart placeholder
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>Distribution of sales by category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px] flex items-center justify-center border rounded-md bg-muted/10">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <PieChart className="h-6 w-6 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Category distribution chart placeholder
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <Card>
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>
                Your recent transactions for {dateRanges[dateRange as keyof typeof dateRanges].label.toLowerCase()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Transaction ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Buyer</TableHead>
                      <TableHead>Product</TableHead>
                      <TableHead className="text-right">Quantity</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Fee</TableHead>
                      <TableHead className="text-right">Net</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions.map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell className="font-medium">{transaction.id}</TableCell>
                        <TableCell>{format(transaction.date, "MMM d, yyyy")}</TableCell>
                        <TableCell>{transaction.buyer}</TableCell>
                        <TableCell>{transaction.product}</TableCell>
                        <TableCell className="text-right">{transaction.quantity}</TableCell>
                        <TableCell className="text-right">${transaction.amount.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${transaction.fee.toFixed(2)}</TableCell>
                        <TableCell className="text-right">${transaction.net.toFixed(2)}</TableCell>
                        <TableCell className="capitalize">{transaction.status}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="ml-auto" onClick={exportTransactions}>
                <Download className="mr-2 h-4 w-4" />
                Export Transactions
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="charts">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <CardTitle>Sales Analytics</CardTitle>
                  <CardDescription>
                    Visualize your sales data over time
                  </CardDescription>
                </div>
                <div className="w-[150px] mt-2 md:mt-0">
                  <Select value={chartType} onValueChange={setChartType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select chart" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales</SelectItem>
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
                  <h3 className="text-lg font-medium">{chartType === "sales" ? "Sales" : chartType === "fees" ? "Platform Fees" : "Transaction Count"} Chart</h3>
                  <p className="text-sm text-muted-foreground">
                    This is a placeholder for the {chartType} chart visualization
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
