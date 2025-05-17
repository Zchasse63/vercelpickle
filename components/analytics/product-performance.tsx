"use client";

import { useState } from "react";
import { useProductPerformanceData, TimePeriod } from "@/lib/data/analytics";
import { useCurrentUserProfile } from "@/lib/data/user-profiles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Id } from "@/convex/_generated/dataModel";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface ProductPerformanceProps {
  role: "admin" | "seller";
  userId?: Id<"users">;
}

export function ProductPerformance({ role, userId }: ProductPerformanceProps) {
  const { data: currentUser } = useCurrentUserProfile();
  const [period, setPeriod] = useState<TimePeriod>("month");
  const [view, setView] = useState<"table" | "chart">("table");
  
  const { data: productPerformance, isLoading } = useProductPerformanceData(
    period,
    role,
    userId || (currentUser?._id as Id<"users">),
    10
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (isLoading) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Product Performance</CardTitle>
          <CardDescription>
            Your top performing products by revenue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!productPerformance || productPerformance.length === 0) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Product Performance</CardTitle>
          <CardDescription>
            Your top performing products by revenue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px]">
            <p className="text-muted-foreground">No product performance data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format data for the chart
  const chartData = productPerformance.map((item) => ({
    name: item.productName.length > 20 ? item.productName.substring(0, 20) + "..." : item.productName,
    revenue: Number(item.revenue.toFixed(2)),
    unitsSold: item.unitsSold,
  }));

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Product Performance</CardTitle>
          <CardDescription>
            Your top performing products by revenue.
          </CardDescription>
        </div>
        <div className="flex gap-2">
          <Tabs
            value={period}
            onValueChange={(value) => setPeriod(value as TimePeriod)}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
          <Tabs
            value={view}
            onValueChange={(value) => setView(value as "table" | "chart")}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="table">Table</TabsTrigger>
              <TabsTrigger value="chart">Chart</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        {view === "table" ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead>Units Sold</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Conversion Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productPerformance.map((product) => (
                <TableRow key={product.productId}>
                  <TableCell className="font-medium">{product.productName}</TableCell>
                  <TableCell>{formatCurrency(product.revenue)}</TableCell>
                  <TableCell>{product.unitsSold}</TableCell>
                  <TableCell>{product.viewCount}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        product.conversionRate > 5
                          ? "default"
                          : product.conversionRate > 2
                          ? "secondary"
                          : "outline"
                      }
                    >
                      {product.conversionRate.toFixed(1)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                layout="vertical"
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={150}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "revenue") {
                      return [formatCurrency(value as number), "Revenue"];
                    } else if (name === "unitsSold") {
                      return [value, "Units Sold"];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
                <Bar dataKey="unitsSold" name="Units Sold" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
