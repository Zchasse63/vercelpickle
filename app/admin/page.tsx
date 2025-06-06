import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminOverviewStats } from "@/components/admin/admin-overview-stats"
import { AdminRecentOrders } from "@/components/admin/admin-recent-orders"
import { AdminRevenueChart } from "@/components/admin/admin-revenue-chart"
import { AdminTopSellers } from "@/components/admin/admin-top-sellers"
import { AdminTopProducts } from "@/components/admin/admin-top-products"
import { AdminDashboardMetrics } from "@/components/admin/admin-dashboard-metrics"
import { AdminRecentActivity } from "@/components/admin/admin-recent-activity"

export default function AdminDashboardPage() {
  return (
    <main className="flex flex-col gap-4" data-testid="admin-dashboard">
      <div className="animate-fade-up" data-testid="admin-header">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">Overview of your marketplace performance and activity.</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4 animate-fade-up delay-100">
        <TabsList>
          <TabsTrigger value="overview" className="hover-scale">Overview</TabsTrigger>
          <TabsTrigger value="financial" className="hover-scale">Financial</TabsTrigger>
          <TabsTrigger value="transactions" className="hover-scale">Transactions</TabsTrigger>
          <TabsTrigger value="invoices" className="hover-scale">Invoices</TabsTrigger>
          <TabsTrigger value="analytics" className="hover-scale">Analytics</TabsTrigger>
          <TabsTrigger value="reports" className="hover-scale">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4 animate-fade-up">
          <div className="animate-fade-up delay-200">
            <AdminOverviewStats />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 animate-fade-up delay-300">
            <Card className="lg:col-span-4 hover-lift">
              <CardHeader>
                <CardTitle>Dashboard Metrics</CardTitle>
                <CardDescription>Key performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminDashboardMetrics />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3 hover-lift">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest actions across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminRecentActivity />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 animate-fade-up delay-400">
            <Card className="lg:col-span-3 hover-lift">
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Best selling products this month</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminTopProducts />
              </CardContent>
            </Card>
            <Card className="lg:col-span-4 hover-lift">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders across the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminRecentOrders />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4 animate-fade-up">
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle>Financial Dashboard</CardTitle>
              <CardDescription>Financial overview and metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Financial dashboard will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4 animate-fade-up">
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle>Transaction History</CardTitle>
              <CardDescription>View and manage all transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Transaction history will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4 animate-fade-up">
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle>Invoice Management</CardTitle>
              <CardDescription>Create, view, and manage invoices</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Invoice management interface will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 animate-fade-up">
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle>Advanced Analytics</CardTitle>
              <CardDescription>Detailed platform performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Advanced analytics charts will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4 animate-fade-up">
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
              <CardDescription>Download and view system reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Report generation interface will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
