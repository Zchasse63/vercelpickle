"use client"

import { Suspense } from "react"
import { lazyImport } from "@/lib/lazy-import"
import { Skeleton } from "@/components/ui/skeleton"

// Lazy loaded admin components
export const LazyAdminFinancialDashboard = lazyImport(
  () => import("@/components/admin/admin-financial-dashboard"),
  "AdminFinancialDashboard",
  {
    ssr: false,
    loading: () => (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[180px]" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
          <Skeleton className="h-28 w-full" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    )
  }
)

export const LazyAdminTransactionHistory = lazyImport(
  () => import("@/components/admin/admin-transaction-history"),
  "AdminTransactionHistory",
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-48" />
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>
      </div>
    )
  }
)

export const LazyAdminInvoiceManagement = lazyImport(
  () => import("@/components/admin/admin-invoice-management"),
  "AdminInvoiceManagement",
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-6 w-48" />
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Skeleton className="h-10 flex-1" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-24" />
          </div>
        </div>
        <Skeleton className="h-[400px] w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-10 w-64" />
        </div>
      </div>
    )
  }
)

// Wrapper components with Suspense
export function AdminFinancialDashboardLazy() {
  const AdminFinancialDashboard = LazyAdminFinancialDashboard as any;
  return (
    <Suspense fallback={<Skeleton className="h-[600px] w-full" />}>
      <AdminFinancialDashboard />
    </Suspense>
  )
}

export function AdminTransactionHistoryLazy() {
  const AdminTransactionHistory = LazyAdminTransactionHistory as any;
  return (
    <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
      <AdminTransactionHistory />
    </Suspense>
  )
}

export function AdminInvoiceManagementLazy() {
  const AdminInvoiceManagement = LazyAdminInvoiceManagement as any;
  return (
    <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
      <AdminInvoiceManagement />
    </Suspense>
  )
}
