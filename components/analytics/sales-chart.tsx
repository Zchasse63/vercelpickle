"use client";

import { useState } from "react";
import { useSalesData, TimePeriod } from "@/lib/data/analytics";
import { useCurrentUserProfile } from "@/lib/data/user-profiles";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Id } from "@/convex/_generated/dataModel";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface SalesChartProps {
  role: "admin" | "seller";
  userId?: Id<"users">;
}

export function SalesChart({ role, userId }: SalesChartProps) {
  const { data: currentUser } = useCurrentUserProfile();
  const [period, setPeriod] = useState<TimePeriod>("month");
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  
  const { data: salesData, isLoading } = useSalesData(
    period,
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

  const formatDate = (date: string) => {
    if (period === "day") {
      // Format hourly data
      return date.split(" ")[1];
    } else if (period === "week" || period === "month") {
      // Format daily data
      const d = new Date(date);
      return `${d.getMonth() + 1}/${d.getDate()}`;
    } else {
      // Format monthly data
      return date;
    }
  };

  if (isLoading) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>
            View your sales performance over time.
          </CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (!salesData) {
    return (
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>
            View your sales performance over time.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-[300px]">
            <p className="text-muted-foreground">No sales data available</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Format data for the chart
  const chartData = salesData.map((item) => ({
    ...item,
    date: formatDate(item.date),
    revenue: Number(item.revenue.toFixed(2)),
    averageOrderValue: Number(item.averageOrderValue.toFixed(2)),
  }));

  return (
    <Card className="col-span-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Sales Overview</CardTitle>
          <CardDescription>
            View your sales performance over time.
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
            value={chartType}
            onValueChange={(value) => setChartType(value as "line" | "bar")}
            className="w-full md:w-auto"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="line">Line</TabsTrigger>
              <TabsTrigger value="bar">Bar</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="pl-2">
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === "line" ? (
              <LineChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(value) => `$${value}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => value}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "revenue") {
                      return [formatCurrency(value as number), "Revenue"];
                    } else if (name === "orders") {
                      return [value, "Orders"];
                    } else if (name === "averageOrderValue") {
                      return [formatCurrency(value as number), "Avg. Order Value"];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="revenue"
                  name="Revenue"
                  stroke="#8884d8"
                  activeDot={{ r: 8 }}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="orders"
                  name="Orders"
                  stroke="#82ca9d"
                />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="averageOrderValue"
                  name="Avg. Order Value"
                  stroke="#ffc658"
                />
              </LineChart>
            ) : (
              <BarChart
                data={chartData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis
                  yAxisId="left"
                  tickFormatter={(value) => `$${value}`}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={(value) => value}
                />
                <Tooltip
                  formatter={(value, name) => {
                    if (name === "revenue") {
                      return [formatCurrency(value as number), "Revenue"];
                    } else if (name === "orders") {
                      return [value, "Orders"];
                    } else if (name === "averageOrderValue") {
                      return [formatCurrency(value as number), "Avg. Order Value"];
                    }
                    return [value, name];
                  }}
                />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="revenue"
                  name="Revenue"
                  fill="#8884d8"
                />
                <Bar
                  yAxisId="right"
                  dataKey="orders"
                  name="Orders"
                  fill="#82ca9d"
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
