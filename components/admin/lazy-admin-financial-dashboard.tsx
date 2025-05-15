"use client"

import dynamic from "next/dynamic"
import { AdminFinancialDashboardSkeleton } from "./admin-financial-dashboard-skeleton"

// Dynamically import the AdminFinancialDashboard component
const AdminFinancialDashboard = dynamic(
  () => import("./admin-financial-dashboard").then(mod => ({ default: mod.AdminFinancialDashboard })),
  {
    loading: () => <AdminFinancialDashboardSkeleton />,
    ssr: false // Disable SSR for this component since it contains charts
  }
)

export function LazyAdminFinancialDashboard() {
  return <AdminFinancialDashboard />
}
