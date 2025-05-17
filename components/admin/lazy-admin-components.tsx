"use client"

import { lazyImport, preloadComponent } from "@/lib/lazy-import"
import { AdminFinancialDashboardSkeleton } from "./admin-financial-dashboard-skeleton"
import { AdminSalesChartSkeleton } from "./admin-sales-chart-skeleton"
import { AdminGeographyChartSkeleton } from "./admin-geography-chart-skeleton"

/**
 * Lazy-loaded admin dashboard components with proper error handling and loading states
 * These components will only be loaded when they are actually rendered in the UI
 */

// Admin Financial Dashboard
export const AdminFinancialDashboard = lazyImport(
  () => import("@/components/admin/admin-financial-dashboard"),
  "AdminFinancialDashboard",
  {
    ssr: false,
    loading: <AdminFinancialDashboardSkeleton />,
    errorComponent: (error, retry) => (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load financial dashboard
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error.message || "An unexpected error occurred while loading the financial dashboard"}
        </p>
        <button
          onClick={retry}
          className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
        >
          Retry
        </button>
      </div>
    ),
    onError: (error) => {
      console.error("Error loading AdminFinancialDashboard:", error)
      // Here you could also log to an error monitoring service
    }
  }
)

// Admin Sales Chart
export const AdminSalesChart = lazyImport(
  () => import("@/components/admin/admin-sales-chart"),
  "AdminSalesChart",
  {
    ssr: false,
    loading: <AdminSalesChartSkeleton />,
    errorComponent: (error, retry) => (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load sales chart
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error.message || "An unexpected error occurred while loading the sales chart"}
        </p>
        <button
          onClick={retry}
          className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }
)

// Admin Geography Chart
export const AdminGeographyChart = lazyImport(
  () => import("@/components/admin/admin-geography-chart"),
  "AdminGeographyChart",
  {
    ssr: false,
    loading: <AdminGeographyChartSkeleton />,
    errorComponent: (error, retry) => (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load geography chart
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error.message || "An unexpected error occurred while loading the geography chart"}
        </p>
        <button
          onClick={retry}
          className="px-4 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-md hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }
)

// Admin Transaction History
export const AdminTransactionHistory = lazyImport(
  () => import("@/components/admin/admin-transaction-history"),
  "AdminTransactionHistory",
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Transaction History</h2>
            <p className="text-muted-foreground">
              View and manage recent transactions
            </p>
          </div>
        </div>
        <div className="h-[400px] w-full flex items-center justify-center bg-muted/20 rounded-md">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading transaction data...</p>
          </div>
        </div>
      </div>
    )
  }
)

/**
 * Preload functions for admin components
 * These can be called before the components are needed to improve perceived performance
 */
export function preloadAdminFinancialDashboard() {
  preloadComponent(() => import("@/components/admin/admin-financial-dashboard"), "AdminFinancialDashboard")
}

export function preloadAdminSalesChart() {
  preloadComponent(() => import("@/components/admin/admin-sales-chart"), "AdminSalesChart")
}

export function preloadAdminGeographyChart() {
  preloadComponent(() => import("@/components/admin/admin-geography-chart"), "AdminGeographyChart")
}

export function preloadAdminTransactionHistory() {
  preloadComponent(() => import("@/components/admin/admin-transaction-history"), "AdminTransactionHistory")
}
