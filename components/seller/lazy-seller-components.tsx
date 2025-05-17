"use client"

import { lazyImport, preloadComponent } from "@/lib/lazy-import"
import { SellerSalesStatsSkeleton } from "./seller-sales-stats-skeleton"
import { SellerRevenueChartSkeleton } from "./seller-revenue-chart-skeleton"
import { SellerRecentOrdersSkeleton } from "./seller-recent-orders-skeleton"
import { SellerTopProductsSkeleton } from "./seller-top-products-skeleton"
import { SellerInventoryAlertSkeleton } from "./seller-inventory-alert-skeleton"

/**
 * Lazy-loaded seller dashboard components with proper error handling and loading states
 * These components will only be loaded when they are actually rendered in the UI
 */

// Seller Sales Stats
export const SellerSalesStats = lazyImport(
  () => import("@/components/seller/seller-sales-stats"),
  "SellerSalesStats",
  {
    ssr: false,
    loading: <SellerSalesStatsSkeleton />,
    errorComponent: (error, retry) => (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load sales statistics
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error.message || "An unexpected error occurred while loading sales statistics"}
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
      console.error("Error loading SellerSalesStats:", error)
    }
  }
)

// Seller Revenue Chart
export const SellerRevenueChart = lazyImport(
  () => import("@/components/seller/seller-revenue-chart"),
  "SellerRevenueChart",
  {
    ssr: false,
    loading: <SellerRevenueChartSkeleton />,
    errorComponent: (error, retry) => (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load revenue chart
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error.message || "An unexpected error occurred while loading the revenue chart"}
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
      console.error("Error loading SellerRevenueChart:", error)
    }
  }
)

// Seller Recent Orders
export const SellerRecentOrders = lazyImport(
  () => import("@/components/seller/seller-recent-orders"),
  "SellerRecentOrders",
  {
    ssr: false,
    loading: <SellerRecentOrdersSkeleton />,
    errorComponent: (error, retry) => (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load recent orders
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error.message || "An unexpected error occurred while loading recent orders"}
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
      console.error("Error loading SellerRecentOrders:", error)
    }
  }
)

// Seller Top Products
export const SellerTopProducts = lazyImport(
  () => import("@/components/seller/seller-top-products"),
  "SellerTopProducts",
  {
    ssr: false,
    loading: <SellerTopProductsSkeleton />,
    errorComponent: (error, retry) => (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load top products
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error.message || "An unexpected error occurred while loading top products"}
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
      console.error("Error loading SellerTopProducts:", error)
    }
  }
)

// Seller Inventory Alert
export const SellerInventoryAlert = lazyImport(
  () => import("@/components/seller/seller-inventory-alert"),
  "SellerInventoryAlert",
  {
    ssr: false,
    loading: <SellerInventoryAlertSkeleton />,
    errorComponent: (error, retry) => (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load inventory alerts
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error.message || "An unexpected error occurred while loading inventory alerts"}
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
      console.error("Error loading SellerInventoryAlert:", error)
    }
  }
)

/**
 * Preload functions for seller dashboard components
 * These can be called before the components are needed to improve perceived performance
 */
export function preloadSellerSalesStats() {
  preloadComponent(() => import("@/components/seller/seller-sales-stats"), "SellerSalesStats")
}

export function preloadSellerRevenueChart() {
  preloadComponent(() => import("@/components/seller/seller-revenue-chart"), "SellerRevenueChart")
}

export function preloadSellerRecentOrders() {
  preloadComponent(() => import("@/components/seller/seller-recent-orders"), "SellerRecentOrders")
}

export function preloadSellerTopProducts() {
  preloadComponent(() => import("@/components/seller/seller-top-products"), "SellerTopProducts")
}

export function preloadSellerInventoryAlert() {
  preloadComponent(() => import("@/components/seller/seller-inventory-alert"), "SellerInventoryAlert")
}
