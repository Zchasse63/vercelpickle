"use client";

import { useDashboardSummary } from "@/lib/data/analytics";
import { useCurrentUserProfile } from "@/lib/data/user-profiles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpIcon, ArrowDownIcon, DollarSign, ShoppingCart, Package, Users } from "lucide-react";
import { Id } from "@/convex/_generated/dataModel";

interface DashboardSummaryProps {
  role: "admin" | "seller" | "buyer";
  userId?: Id<"users">;
}

export function DashboardSummary({ role, userId }: DashboardSummaryProps) {
  const { data: currentUser } = useCurrentUserProfile();
  const { data: summary, isLoading } = useDashboardSummary(
    role,
    userId || (currentUser?._id as Id<"users">)
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatChange = (value: number) => {
    const isPositive = value >= 0;
    return (
      <div className="flex items-center gap-1">
        {isPositive ? (
          <ArrowUpIcon className="h-4 w-4 text-green-500" />
        ) : (
          <ArrowDownIcon className="h-4 w-4 text-red-500" />
        )}
        <span className={isPositive ? "text-green-500" : "text-red-500"}>
          {Math.abs(value).toFixed(1)}%
        </span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                <Skeleton className="h-4 w-24" />
              </CardTitle>
              <Skeleton className="h-8 w-8 rounded-full" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <Skeleton className="h-8 w-20" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                <Skeleton className="h-3 w-32" />
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">No Data</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground mt-1">
              No summary data available
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(summary.totalRevenue)}
          </div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {formatChange(summary.revenueChange)}
            <span className="ml-1">from previous period</span>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalOrders}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {formatChange(summary.ordersChange)}
            <span className="ml-1">from previous period</span>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Products</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalProducts}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {formatChange(summary.productsChange)}
            <span className="ml-1">from previous period</span>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{summary.totalUsers}</div>
          <p className="text-xs text-muted-foreground flex items-center mt-1">
            {formatChange(summary.usersChange)}
            <span className="ml-1">from previous period</span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
