import { Users, Package, ShoppingCart, DollarSign } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function AdminOverviewStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4" data-testid="admin-overview-stats">
      <Card data-testid="revenue-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="revenue-value">$45,231.89</div>
          <p className="text-xs text-muted-foreground" data-testid="revenue-change">+20.1% from last month</p>
          <div className="mt-4 h-1 w-full rounded-full bg-gray-100">
            <div className="h-1 w-[75%] rounded-full bg-green-500"></div>
          </div>
        </CardContent>
      </Card>
      <Card data-testid="orders-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="orders-value">+2,350</div>
          <p className="text-xs text-muted-foreground" data-testid="orders-change">+10.5% from last month</p>
          <div className="mt-4 h-1 w-full rounded-full bg-gray-100">
            <div className="h-1 w-[65%] rounded-full bg-green-500"></div>
          </div>
        </CardContent>
      </Card>
      <Card data-testid="products-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="products-value">1,482</div>
          <p className="text-xs text-muted-foreground" data-testid="products-change">+12.3% from last month</p>
          <div className="mt-4 h-1 w-full rounded-full bg-gray-100">
            <div className="h-1 w-[45%] rounded-full bg-green-500"></div>
          </div>
        </CardContent>
      </Card>
      <Card data-testid="users-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="users-value">+573</div>
          <p className="text-xs text-muted-foreground" data-testid="users-change">+7.4% from last month</p>
          <div className="mt-4 h-1 w-full rounded-full bg-gray-100">
            <div className="h-1 w-[35%] rounded-full bg-green-500"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
