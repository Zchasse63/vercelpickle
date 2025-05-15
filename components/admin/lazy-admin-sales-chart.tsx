"use client"

import dynamic from "next/dynamic"
import { AdminSalesChartSkeleton } from "./admin-sales-chart-skeleton"

// Dynamically import the AdminSalesChart component
const AdminSalesChart = dynamic(
  () => import("./admin-sales-chart").then(mod => ({ default: mod.AdminSalesChart })),
  {
    loading: () => <AdminSalesChartSkeleton />,
    ssr: false // Disable SSR for this component since it's a chart
  }
)

export function LazyAdminSalesChart() {
  return <AdminSalesChart />
}
