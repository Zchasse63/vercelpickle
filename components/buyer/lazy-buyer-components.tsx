"use client"

import { lazyImport, preloadComponent } from "@/lib/lazy-import"
import { BuyerOrderStatsSkeleton } from "./buyer-order-stats-skeleton"
import { BuyerRecentOrdersSkeleton } from "./buyer-recent-orders-skeleton"
import { BuyerSavedProductsSkeleton } from "./buyer-saved-products-skeleton"
import { BuyerRecentActivitySkeleton } from "./buyer-recent-activity-skeleton"

/**
 * Lazy-loaded buyer dashboard components with proper error handling and loading states
 * These components will only be loaded when they are actually rendered in the UI
 */

// Buyer Order Stats
export const BuyerOrderStats = lazyImport(
  () => import("@/components/buyer/buyer-order-stats"),
  "BuyerOrderStats",
  {
    ssr: false,
    loading: <BuyerOrderStatsSkeleton />,
    errorComponent: (error, retry) => (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load order statistics
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error.message || "An unexpected error occurred while loading order statistics"}
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
      console.error("Error loading BuyerOrderStats:", error)
    }
  }
)

// Buyer Recent Orders
export const BuyerRecentOrders = lazyImport(
  () => import("@/components/buyer/buyer-recent-orders"),
  "BuyerRecentOrders",
  {
    ssr: false,
    loading: <BuyerRecentOrdersSkeleton />,
    errorComponent: (error, retry) => (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load recent orders
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error.message || "An unexpected error occurred while loading your recent orders"}
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
      console.error("Error loading BuyerRecentOrders:", error)
    }
  }
)

// Buyer Saved Products
export const BuyerSavedProducts = lazyImport(
  () => import("@/components/buyer/buyer-saved-products"),
  "BuyerSavedProducts",
  {
    ssr: false,
    loading: <BuyerSavedProductsSkeleton />,
    errorComponent: (error, retry) => (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load saved products
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error.message || "An unexpected error occurred while loading your saved products"}
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
      console.error("Error loading BuyerSavedProducts:", error)
    }
  }
)

// Buyer Recent Activity
export const BuyerRecentActivity = lazyImport(
  () => import("@/components/buyer/buyer-recent-activity"),
  "BuyerRecentActivity",
  {
    ssr: false,
    loading: <BuyerRecentActivitySkeleton />,
    errorComponent: (error, retry) => (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load recent activity
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error.message || "An unexpected error occurred while loading your recent activity"}
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
      console.error("Error loading BuyerRecentActivity:", error)
    }
  }
)

/**
 * Preload functions for buyer dashboard components
 * These can be called before the components are needed to improve perceived performance
 */
export function preloadBuyerOrderStats() {
  preloadComponent(() => import("@/components/buyer/buyer-order-stats"), "BuyerOrderStats")
}

export function preloadBuyerRecentOrders() {
  preloadComponent(() => import("@/components/buyer/buyer-recent-orders"), "BuyerRecentOrders")
}

export function preloadBuyerSavedProducts() {
  preloadComponent(() => import("@/components/buyer/buyer-saved-products"), "BuyerSavedProducts")
}

export function preloadBuyerRecentActivity() {
  preloadComponent(() => import("@/components/buyer/buyer-recent-activity"), "BuyerRecentActivity")
}
