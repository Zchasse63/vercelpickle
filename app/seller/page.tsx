import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SellerSalesStats } from "@/components/seller/seller-sales-stats"
import { SellerRevenueChart } from "@/components/seller/seller-revenue-chart"
import { SellerRecentOrders } from "@/components/seller/seller-recent-orders"
import { SellerTopProducts } from "@/components/seller/seller-top-products"
import { SellerInventoryAlert } from "@/components/seller/seller-inventory-alert"

export default function SellerDashboard() {
  return (
    <main className="flex flex-col gap-4 w-full max-w-full" data-testid="seller-dashboard">
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold tracking-tight">Seller Dashboard</h1>
        <p className="text-muted-foreground">Overview of your store performance and recent activity</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4 animate-fade-up delay-100 w-full">
        <TabsList>
          <TabsTrigger value="overview" className="hover-scale" data-testid="overview-tab">Overview</TabsTrigger>
          <TabsTrigger value="products" className="hover-scale" data-testid="products-tab">Products</TabsTrigger>
          <TabsTrigger value="orders" className="hover-scale" data-testid="orders-tab">Orders</TabsTrigger>
          <TabsTrigger value="inventory" className="hover-scale" data-testid="inventory-tab">Inventory</TabsTrigger>
          <TabsTrigger value="analytics" className="hover-scale" data-testid="analytics-tab">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 animate-fade-up w-full">
          <div className="animate-fade-up delay-200">
            <SellerSalesStats />
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 animate-fade-up delay-300 w-full">
            <Card className="lg:col-span-4 hover-lift w-full">
              <CardHeader>
                <CardTitle>Revenue</CardTitle>
                <CardDescription>Your store revenue over the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <SellerRevenueChart />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3 hover-lift w-full">
              <CardHeader>
                <CardTitle>Top Products</CardTitle>
                <CardDescription>Your best selling products this month</CardDescription>
              </CardHeader>
              <CardContent>
                <SellerTopProducts />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7 animate-fade-up delay-400 w-full">
            <Card className="lg:col-span-4 hover-lift w-full">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders for your products</CardDescription>
              </CardHeader>
              <CardContent>
                <SellerRecentOrders />
              </CardContent>
            </Card>
            <Card className="lg:col-span-3 hover-lift w-full">
              <CardHeader>
                <CardTitle>Inventory Alerts</CardTitle>
                <CardDescription>Products that need attention</CardDescription>
              </CardHeader>
              <CardContent>
                <SellerInventoryAlert />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4 animate-fade-up w-full">
          <Card className="hover-lift w-full">
            <CardHeader>
              <CardTitle>Product Management</CardTitle>
              <CardDescription>Manage your product catalog</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Product management interface will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders" className="space-y-4 animate-fade-up w-full">
          <Card className="hover-lift w-full">
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <CardDescription>View and manage all orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Order management interface will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory" className="space-y-4 animate-fade-up w-full">
          <Card className="hover-lift w-full">
            <CardHeader>
              <CardTitle>Inventory Management</CardTitle>
              <CardDescription>Track and update your inventory</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Inventory management interface will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 animate-fade-up w-full">
          <Card className="hover-lift w-full">
            <CardHeader>
              <CardTitle>Store Analytics</CardTitle>
              <CardDescription>Detailed performance metrics for your store</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] flex items-center justify-center border rounded-md">
                <p className="text-muted-foreground">Analytics dashboard will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
