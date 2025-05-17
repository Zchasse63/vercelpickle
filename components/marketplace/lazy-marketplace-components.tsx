"use client"

import { Suspense, useEffect } from "react"
import { lazyImport, preloadComponent } from "@/lib/lazy-import"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductGridSkeleton } from "@/components/ui/loading"
import { ProductQuickViewSkeleton } from "./product-quick-view-skeleton"
import { ProductCardSkeleton } from "./product-card-skeleton"
import { ProductQuickViewModalProps } from "@/types/product"

/**
 * Lazy-loaded marketplace components with proper error handling and loading states
 */

// Product Quick View Modal
export const ProductQuickViewModal = lazyImport(
  () => import("@/components/marketplace/product-quick-view-modal"),
  "ProductQuickViewModal",
  {
    ssr: false,
    loading: ({ open, onOpenChange }: ProductQuickViewModalProps) => (
      <ProductQuickViewSkeleton open={open} onOpenChange={onOpenChange} />
    ),
    errorComponent: (error, retry) => (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load product details
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error.message || "An unexpected error occurred while loading product details"}
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
      console.error("Error loading ProductQuickViewModal:", error)
    }
  }
)

// Product Comparison
export const MarketplaceProductComparison = lazyImport(
  () => import("@/components/marketplace/marketplace-product-comparison"),
  "MarketplaceProductComparison",
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 mb-2" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
          <Skeleton className="h-[400px] w-full" />
        </div>
      </div>
    ),
    errorComponent: (error, retry) => (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load product comparison
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error.message || "An unexpected error occurred while loading the comparison tool"}
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

// Product Reviews
export const MarketplaceProductReviews = lazyImport(
  () => import("@/components/marketplace/marketplace-product-reviews"),
  "MarketplaceProductReviews",
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-4">
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
          <Skeleton className="h-[120px] w-full" />
        </div>
        <div className="flex justify-center mt-6">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    )
  }
)

// Related Products
export const MarketplaceRelatedProducts = lazyImport(
  () => import("@/components/marketplace/marketplace-related-products"),
  "MarketplaceRelatedProducts",
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <ProductGridSkeleton count={4} viewMode="grid" />
      </div>
    )
  }
)

// Advanced Filters
export const MarketplaceAdvancedFilters = lazyImport(
  () => import("@/components/marketplace/marketplace-advanced-filters"),
  "MarketplaceAdvancedFilters",
  {
    ssr: false,
    loading: () => (
      <div className="w-full p-4 space-y-4 border rounded-lg">
        <div className="flex justify-between items-center">
          <div className="animate-pulse bg-muted h-6 w-32 rounded-md"></div>
          <div className="animate-pulse bg-muted h-6 w-24 rounded-md"></div>
        </div>
        <div className="space-y-3">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="space-y-2">
              <div className="animate-pulse bg-muted h-5 w-24 rounded-md"></div>
              <div className="animate-pulse bg-muted h-8 w-full rounded-md"></div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <div className="animate-pulse bg-muted h-9 w-24 rounded-md"></div>
          <div className="animate-pulse bg-muted h-9 w-24 rounded-md"></div>
        </div>
      </div>
    )
  }
)

// Product Sorting
export const MarketplaceProductSorting = lazyImport(
  () => import("@/components/marketplace/marketplace-product-sorting"),
  "MarketplaceProductSorting",
  {
    ssr: false,
    loading: () => (
      <Skeleton className="h-10 w-48" />
    )
  }
)

// Virtualized Product Grid
export const VirtualizedProductGrid = lazyImport(
  () => import("@/components/marketplace/virtualized-product-grid"),
  "VirtualizedProductGrid",
  {
    ssr: false,
    loading: () => (
      <ProductGridSkeleton count={12} viewMode="grid" />
    )
  }
)

/**
 * Preload functions for marketplace components
 * These can be called before the components are needed to improve perceived performance
 */
export function preloadProductQuickViewModal() {
  preloadComponent(() => import("@/components/marketplace/product-quick-view-modal"), "ProductQuickViewModal")
}

export function preloadProductComparisonTool() {
  preloadComponent(() => import("@/components/marketplace/marketplace-product-comparison"), "MarketplaceProductComparison")
}

export function preloadAdvancedFilters() {
  preloadComponent(() => import("@/components/marketplace/marketplace-advanced-filters"), "MarketplaceAdvancedFilters")
}

/**
 * Wrapper component that preloads the quick view modal when hovered
 * This improves perceived performance when users interact with product cards
 */
export function usePreloadOnHover(productId: string) {
  useEffect(() => {
    const productCard = document.querySelector(`[data-product-id="${productId}"]`)

    if (productCard) {
      const handleMouseEnter = () => {
        preloadProductQuickViewModal()
      }

      productCard.addEventListener('mouseenter', handleMouseEnter)

      return () => {
        productCard.removeEventListener('mouseenter', handleMouseEnter)
      }
    }
  }, [productId])
}
