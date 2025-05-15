"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DynamicChart } from "@/components/charts/dynamic-chart"

// Sample data for dashboard metrics
const revenueData = [
  { name: "Jan", value: 12000 },
  { name: "Feb", value: 15000 },
  { name: "Mar", value: 18000 },
  { name: "Apr", value: 16000 },
  { name: "May", value: 21000 },
  { name: "Jun", value: 19000 },
  { name: "Jul", value: 22000 },
  { name: "Aug", value: 25000 },
  { name: "Sep", value: 27000 },
  { name: "Oct", value: 29000 },
  { name: "Nov", value: 32000 },
  { name: "Dec", value: 35000 },
]

const ordersData = [
  { name: "Jan", value: 120 },
  { name: "Feb", value: 150 },
  { name: "Mar", value: 180 },
  { name: "Apr", value: 160 },
  { name: "May", value: 210 },
  { name: "Jun", value: 190 },
  { name: "Jul", value: 220 },
  { name: "Aug", value: 250 },
  { name: "Sep", value: 270 },
  { name: "Oct", value: 290 },
  { name: "Nov", value: 320 },
  { name: "Dec", value: 350 },
]

const categoryData = [
  { name: "Vegetables", value: 35 },
  { name: "Fruits", value: 25 },
  { name: "Dairy", value: 20 },
  { name: "Bakery", value: 15 },
  { name: "Other", value: 5 },
]

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"]

export function AdminDashboardMetrics() {
  return (
    <div className="space-y-4" data-testid="dashboard-metrics">
      <Tabs defaultValue="revenue">
        <TabsList className="mb-4">
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <DynamicChart
                  data={{
                    labels: revenueData.map(item => item.name),
                    datasets: [
                      {
                        label: 'Revenue',
                        data: revenueData.map(item => item.value),
                        backgroundColor: '#4CAF50',
                        borderColor: '#4CAF50',
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
                        ticks: {
                          callback: (value: number) => `$${value}`
                        }
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context: any) => {
                            return `Revenue: $${context.raw}`;
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid="total-sales">$245,231.89</div>
                <p className="text-sm text-muted-foreground">+20.1% from last year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Average Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$87.65</div>
                <p className="text-sm text-muted-foreground">+5.2% from last year</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <DynamicChart
                  data={{
                    labels: ordersData.map(item => item.name),
                    datasets: [
                      {
                        label: 'Orders',
                        data: ordersData.map(item => item.value),
                        backgroundColor: 'rgba(33, 150, 243, 0.1)',
                        borderColor: '#2196F3',
                        borderWidth: 2,
                        tension: 0.4,
                        pointRadius: 2,
                      }
                    ]
                  }}
                  type="line"
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context: any) => {
                            return `Orders: ${context.raw}`;
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Total Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold" data-testid="total-orders">2,798</div>
                <p className="text-sm text-muted-foreground">+15.3% from last year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Order Fulfillment Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">98.2%</div>
                <p className="text-sm text-muted-foreground">+1.5% from last year</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <DynamicChart
                  data={{
                    labels: categoryData.map(item => item.name),
                    datasets: [
                      {
                        data: categoryData.map(item => item.value),
                        backgroundColor: COLORS,
                        borderColor: COLORS.map(color => color),
                        borderWidth: 1,
                        hoverOffset: 4
                      }
                    ]
                  }}
                  type="pie"
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'bottom' as const,
                      },
                      tooltip: {
                        callbacks: {
                          label: (context: any) => {
                            const label = context.label || '';
                            const value = context.raw;
                            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                            const percentage = Math.round((value / total) * 100);
                            return `${label}: ${percentage}%`;
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
        </TabsContent>

        <TabsContent value="growth" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Growth Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <DynamicChart
                  data={{
                    labels: revenueData.map(item => item.name),
                    datasets: [
                      {
                        label: 'Revenue',
                        data: revenueData.map(item => item.value),
                        backgroundColor: 'rgba(136, 132, 216, 0.2)',
                        borderColor: '#8884d8',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                      }
                    ]
                  }}
                  type="line"
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: (value: number) => `$${value}`
                        }
                      }
                    },
                    plugins: {
                      tooltip: {
                        callbacks: {
                          label: (context: any) => {
                            return `Revenue: $${context.raw}`;
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Year-over-Year Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">+24.8%</div>
                <p className="text-sm text-muted-foreground">Revenue growth from previous year</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Customer Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">+18.5%</div>
                <p className="text-sm text-muted-foreground">New customer acquisition</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
