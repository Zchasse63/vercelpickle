import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Clock, CheckCircle, AlertTriangle, ArrowUp } from "lucide-react"

export function BuyerOrderStats() {
  return (
    <>
      <Card className="border border-border/40 shadow-sm" data-testid="total-orders-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <div className="rounded-full bg-primary/10 p-1">
            <Package className="h-4 w-4 text-primary" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="total-orders-count">42</div>
          <div className="flex items-center text-xs mt-1">
            <div className="flex items-center rounded-full bg-emerald-50 px-1.5 py-0.5 dark:bg-emerald-950/20">
              <ArrowUp className="mr-1 h-3 w-3 text-emerald-500" />
              <span className="text-emerald-600 dark:text-emerald-400">+5%</span>
            </div>
            <span className="ml-2 text-muted-foreground">from last month</span>
          </div>
        </CardContent>
      </Card>
      <Card className="border border-border/40 shadow-sm" data-testid="pending-orders-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending</CardTitle>
          <div className="rounded-full bg-amber-100 p-1 dark:bg-amber-900/20">
            <Clock className="h-4 w-4 text-amber-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="pending-orders-count">3</div>
          <p className="text-xs text-muted-foreground mt-1">Awaiting processing</p>
        </CardContent>
      </Card>
      <Card className="border border-border/40 shadow-sm" data-testid="delivered-orders-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Delivered</CardTitle>
          <div className="rounded-full bg-emerald-100 p-1 dark:bg-emerald-900/20">
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="delivered-orders-count">38</div>
          <p className="text-xs text-muted-foreground mt-1">Successfully delivered</p>
        </CardContent>
      </Card>
      <Card className="border border-border/40 shadow-sm" data-testid="issues-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Issues</CardTitle>
          <div className="rounded-full bg-rose-100 p-1 dark:bg-rose-900/20">
            <AlertTriangle className="h-4 w-4 text-rose-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold" data-testid="issues-count">1</div>
          <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
        </CardContent>
      </Card>
    </>
  )
}
