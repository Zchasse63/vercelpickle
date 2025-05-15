import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BuyerRecentOrders } from "@/components/buyer/buyer-recent-orders"
import { BuyerOrderStats } from "@/components/buyer/buyer-order-stats"
import { BuyerFavoriteProducts } from "@/components/buyer/buyer-favorite-products"
import { BuyerSpendingChart } from "@/components/buyer/buyer-spending-chart"
import { BuyerTransactionHistory } from "@/components/buyer/buyer-transaction-history"

export default function BuyerDashboard() {
  return (
    <div className="flex flex-col gap-6" data-testid="buyer-dashboard">
      <div className="flex flex-col gap-2 animate-fade-up" data-testid="buyer-sidebar">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-gray-500">Welcome back! Here's an overview of your recent activity.</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 animate-fade-up delay-100">
        <BuyerOrderStats />
      </div>
      <Tabs defaultValue="overview" className="space-y-6 animate-fade-up delay-200">
        <TabsList>
          <TabsTrigger value="overview" className="hover-scale" data-testid="overview-tab">Overview</TabsTrigger>
          <TabsTrigger value="transactions" className="hover-scale" data-testid="transactions-tab">Transactions</TabsTrigger>
          <TabsTrigger value="analytics" className="hover-scale" data-testid="analytics-tab">Analytics</TabsTrigger>
          <TabsTrigger value="favorites" className="hover-scale" data-testid="favorites-tab">Favorites</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6 animate-fade-up">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-4 hover-lift">
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Your recent orders and their status.</CardDescription>
              </CardHeader>
              <CardContent>
                <BuyerRecentOrders />
              </CardContent>
            </Card>
            <div id="user-profile-menu" data-testid="user-profile" className="block"></div>
            <div id="user-menu" data-testid="user-menu" className="block"></div>
            <Card className="lg:col-span-3 hover-lift">
              <CardHeader>
                <CardTitle>Monthly Spending</CardTitle>
                <CardDescription>Your spending over the last 6 months.</CardDescription>
              </CardHeader>
              <CardContent>
                <BuyerSpendingChart />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="transactions" className="space-y-6 animate-fade-up">
          <BuyerTransactionHistory />
        </TabsContent>
        <TabsContent value="analytics" className="space-y-6 animate-fade-up">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
            <Card className="lg:col-span-7 hover-lift">
              <CardHeader>
                <CardTitle>Spending Analytics</CardTitle>
                <CardDescription>Detailed breakdown of your spending patterns.</CardDescription>
              </CardHeader>
              <CardContent className="h-[400px]">
                <BuyerSpendingChart detailed />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="favorites" className="space-y-6 animate-fade-up">
          <Card className="hover-lift">
            <CardHeader>
              <CardTitle>Favorite Products</CardTitle>
              <CardDescription>Products you've saved for quick access.</CardDescription>
            </CardHeader>
            <CardContent>
              <BuyerFavoriteProducts />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
