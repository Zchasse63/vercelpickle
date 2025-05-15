"use client"

import { Suspense } from "react"
import { lazyImport } from "@/lib/lazy-import"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductGridSkeleton } from "@/components/ui/loading"

// Lazy loaded marketplace components
export const LazyMarketplaceProductComparison = lazyImport(
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
    )
  }
)

export const LazyMarketplaceProductReviews = lazyImport(
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

export const LazyMarketplaceRelatedProducts = lazyImport(
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

export const LazyMarketplaceAdvancedFilters = lazyImport(
  () => import("@/components/marketplace/marketplace-advanced-filters"),
  "MarketplaceAdvancedFilters",
  {
    ssr: false,
    loading: () => (
      <Skeleton className="h-10 w-32" />
    )
  }
)

export const LazyMarketplaceProductSorting = lazyImport(
  () => import("@/components/marketplace/marketplace-product-sorting"),
  "MarketplaceProductSorting",
  {
    ssr: false,
    loading: () => (
      <Skeleton className="h-10 w-48" />
    )
  }
)

export const LazyVirtualizedProductGrid = lazyImport(
  () => import("@/components/marketplace/virtualized-product-grid"),
  "VirtualizedProductGrid",
  {
    ssr: false,
    loading: () => (
      <ProductGridSkeleton count={12} viewMode="grid" />
    )
  }
)

// Wrapper components with Suspense
export function MarketplaceProductComparisonLazy(props: any) {
  return (
    <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
      <LazyMarketplaceProductComparison {...props} />
    </Suspense>
  )
}

export function MarketplaceProductReviewsLazy(props: any) {
  return (
    <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
      <LazyMarketplaceProductReviews {...props} />
    </Suspense>
  )
}

export function MarketplaceRelatedProductsLazy(props: any) {
  return (
    <Suspense fallback={<ProductGridSkeleton count={4} viewMode="grid" />}>
      <LazyMarketplaceRelatedProducts {...props} />
    </Suspense>
  )
}

export function MarketplaceAdvancedFiltersLazy(props: any) {
  return (
    <Suspense fallback={<Skeleton className="h-10 w-32" />}>
      <LazyMarketplaceAdvancedFilters {...props} />
    </Suspense>
  )
}

export function MarketplaceProductSortingLazy(props: any) {
  return (
    <Suspense fallback={<Skeleton className="h-10 w-48" />}>
      <LazyMarketplaceProductSorting {...props} />
    </Suspense>
  )
}

export function VirtualizedProductGridLazy(props: any) {
  return (
    <Suspense fallback={<ProductGridSkeleton count={12} viewMode="grid" />}>
      <LazyVirtualizedProductGrid {...props} />
    </Suspense>
  )
}
