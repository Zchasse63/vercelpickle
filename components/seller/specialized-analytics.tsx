"use client"

import { useState } from "react"
import { BarChart3, PieChart, LineChart, TrendingUp, Calendar, Download, Filter } from "lucide-react"

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
} from "@/components/ui-kit"

export function SpecializedAnalytics() {
  const [dateRange, setDateRange] = useState("30days")
  const [activeTab, setActiveTab] = useState("sales")
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Specialized Analytics</h2>
          <p className="text-muted-foreground">
            Advanced insights for your business performance
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 Days</SelectItem>
              <SelectItem value="30days">Last 30 Days</SelectItem>
              <SelectItem value="90days">Last 90 Days</SelectItem>
              <SelectItem value="year">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="sales" onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales Analytics</TabsTrigger>
          <TabsTrigger value="inventory">Inventory Analytics</TabsTrigger>
          <TabsTrigger value="buyers">Buyer Analytics</TabsTrigger>
          <TabsTrigger value="pricing">Pricing Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">
                  +20.1% from previous period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sales Volume</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
                <p className="text-xs text-muted-foreground">
                  +15.2% from previous period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
                <LineChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$345.42</div>
                <p className="text-xs text-muted-foreground">
                  +4.3% from previous period
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.5%</div>
                <p className="text-xs text-muted-foreground">
                  +2.1% from previous period
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Sales Trend</CardTitle>
                <CardDescription>
                  Daily sales performance over time
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted/10">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <LineChart className="h-8 w-8 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Sales Trend Chart</h3>
                    <p className="text-sm text-muted-foreground">
                      This is a placeholder for the sales trend chart visualization
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Sales by Category</CardTitle>
                <CardDescription>
                  Revenue distribution across product categories
                </CardDescription>
              </CardHeader>
              <CardContent className="px-2">
                <div className="h-[300px] flex items-center justify-center border rounded-md bg-muted/10">
                  <div className="flex flex-col items-center gap-2 text-center">
                    <PieChart className="h-8 w-8 text-muted-foreground" />
                    <h3 className="text-lg font-medium">Category Distribution Chart</h3>
                    <p className="text-sm text-muted-foreground">
                      This is a placeholder for the category distribution chart visualization
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Analytics</CardTitle>
              <CardDescription>
                Track inventory performance and optimize stock levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md bg-muted/10">
                <div className="flex flex-col items-center gap-2 text-center">
                  <BarChart3 className="h-8 w-8 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Inventory Analytics Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    This is a placeholder for the inventory analytics dashboard
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="buyers" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Buyer Analytics</CardTitle>
              <CardDescription>
                Understand your customer base and buying patterns
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md bg-muted/10">
                <div className="flex flex-col items-center gap-2 text-center">
                  <PieChart className="h-8 w-8 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Buyer Analytics Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    This is a placeholder for the buyer analytics dashboard
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pricing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Analytics</CardTitle>
              <CardDescription>
                Optimize your pricing strategy based on market data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md bg-muted/10">
                <div className="flex flex-col items-center gap-2 text-center">
                  <LineChart className="h-8 w-8 text-muted-foreground" />
                  <h3 className="text-lg font-medium">Pricing Analytics Dashboard</h3>
                  <p className="text-sm text-muted-foreground">
                    This is a placeholder for the pricing analytics dashboard
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
