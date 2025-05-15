import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "lucide-react"
import { AdminSalesChart } from "@/components/admin/admin-sales-chart"
import { AdminUserChart } from "@/components/admin/admin-user-chart"
import { AdminCategoryChart } from "@/components/admin/admin-category-chart"
import { AdminGeographyChart } from "@/components/admin/admin-geography-chart"

export default function AdminAnalyticsPage() {
  return (
    <main className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Detailed analytics and insights for your marketplace.</p>
      </div>

      <form className="border rounded-md p-4 space-y-4">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2">
            <h3 className="font-medium">Date Range</h3>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">Today</Button>
              <Button variant="outline" size="sm">Yesterday</Button>
              <Button variant="outline" size="sm">Last 7 days</Button>
              <Button variant="outline" size="sm">Last 30 days</Button>
              <Button variant="outline" size="sm">This month</Button>
              <Button variant="outline" size="sm">Last month</Button>
              <Button variant="outline" size="sm">This year</Button>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="space-y-2">
              <label htmlFor="start-date" className="block text-sm font-medium">Start Date</label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="start-date"
                  type="date"
                  className="pl-8"
                  defaultValue="2023-01-01"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="end-date" className="block text-sm font-medium">End Date</label>
              <div className="relative">
                <Calendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="end-date"
                  type="date"
                  className="pl-8"
                  defaultValue="2023-12-31"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="comparison" className="block text-sm font-medium mb-1">Comparison</label>
              <Select defaultValue="previous_period">
                <SelectTrigger id="comparison">
                  <SelectValue placeholder="Select comparison" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="previous_period">Previous Period</SelectItem>
                  <SelectItem value="previous_year">Previous Year</SelectItem>
                  <SelectItem value="none">None</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="granularity" className="block text-sm font-medium mb-1">Granularity</label>
              <Select defaultValue="day">
                <SelectTrigger id="granularity">
                  <SelectValue placeholder="Select granularity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hour">Hour</SelectItem>
                  <SelectItem value="day">Day</SelectItem>
                  <SelectItem value="week">Week</SelectItem>
                  <SelectItem value="month">Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label htmlFor="metrics" className="block text-sm font-medium mb-1">Metrics</label>
              <Select defaultValue="revenue">
                <SelectTrigger id="metrics">
                  <SelectValue placeholder="Select metrics" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="revenue">Revenue</SelectItem>
                  <SelectItem value="orders">Orders</SelectItem>
                  <SelectItem value="users">Users</SelectItem>
                  <SelectItem value="aov">Average Order Value</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <Button variant="outline">Reset</Button>
            <Button type="submit">Apply</Button>
          </div>
        </div>
      </form>

      <Tabs defaultValue="sales" className="space-y-4">
        <TabsList>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
        </TabsList>
        <TabsContent value="sales" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
                <p className="text-xs text-muted-foreground">+20.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Average Order Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$124.32</div>
                <p className="text-xs text-muted-foreground">+2.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
                <p className="text-xs text-muted-foreground">+0.3% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Sellers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Monthly sales data for the past year</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <AdminSalesChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,543</div>
                <p className="text-xs text-muted-foreground">+12.2% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,832</div>
                <p className="text-xs text-muted-foreground">+5.1% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">145</div>
                <p className="text-xs text-muted-foreground">+18.7% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">User Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">72%</div>
                <p className="text-xs text-muted-foreground">+3.2% from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>User Growth</CardTitle>
              <CardDescription>Monthly user acquisition and retention</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <AdminUserChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="products" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,482</div>
                <p className="text-xs text-muted-foreground">+12.3% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Produce</div>
                <p className="text-xs text-muted-foreground">32% of total sales</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg. Product Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4.7/5</div>
                <p className="text-xs text-muted-foreground">+0.2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Out of Stock</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">-12 from last month</p>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Category Performance</CardTitle>
              <CardDescription>Sales distribution by product category</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <AdminCategoryChart />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="geography" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Top Region</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">California</div>
                <p className="text-xs text-muted-foreground">28% of total sales</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">International Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12%</div>
                <p className="text-xs text-muted-foreground">+3.5% from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">New Markets</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Added this quarter</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Shipping Zones</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+2 from last quarter</p>
              </CardContent>
            </Card>
          </div>

          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Sales distribution by region</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <AdminGeographyChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
