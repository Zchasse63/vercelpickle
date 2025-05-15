"use client";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  MarketplaceProductComparison,
  MarketplaceAdvancedFilters,
  MarketplaceProductSorting,
  VirtualizedProductGrid,
  preloadProductQuickViewModal,
  preloadProductComparisonTool,
  preloadAdvancedFilters
} from "./lazy-marketplace-components";

// Error fallback component
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => (
  <div className="p-4 border border-red-300 rounded-md bg-red-50 text-red-800" role="alert">
    <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
    <p className="mb-4">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
    >
      Try again
    </button>
  </div>
);

/**
 * Lazy-loaded marketplace components with "Lazy" suffix
 * These components are used in the marketplace-interactive-client.tsx file
 */

// MarketplaceProductComparisonLazy
export function MarketplaceProductComparisonLazy(props: React.ComponentProps<typeof MarketplaceProductComparison>) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <Suspense fallback={
        <div className="space-y-4">
          <div className="h-8 w-64 mb-2 bg-gray-200 animate-pulse rounded"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="h-[400px] w-full bg-gray-200 animate-pulse rounded"></div>
            <div className="h-[400px] w-full bg-gray-200 animate-pulse rounded"></div>
            <div className="h-[400px] w-full bg-gray-200 animate-pulse rounded"></div>
            <div className="h-[400px] w-full bg-gray-200 animate-pulse rounded"></div>
          </div>
        </div>
      }>
        <MarketplaceProductComparison {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

// MarketplaceAdvancedFiltersLazy
export function MarketplaceAdvancedFiltersLazy(props: React.ComponentProps<typeof MarketplaceAdvancedFilters>) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <Suspense fallback={
        <div className="w-full p-4 space-y-4 border rounded-lg">
          <div className="flex justify-between items-center">
            <div className="animate-pulse bg-gray-200 h-6 w-32 rounded-md"></div>
            <div className="animate-pulse bg-gray-200 h-6 w-24 rounded-md"></div>
          </div>
          <div className="space-y-3">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="animate-pulse bg-gray-200 h-5 w-24 rounded-md"></div>
                <div className="animate-pulse bg-gray-200 h-8 w-full rounded-md"></div>
              </div>
            ))}
          </div>
        </div>
      }>
        <MarketplaceAdvancedFilters {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

// MarketplaceProductSortingLazy
export function MarketplaceProductSortingLazy(props: React.ComponentProps<typeof MarketplaceProductSorting>) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <Suspense fallback={
        <div className="h-10 w-48 bg-gray-200 animate-pulse rounded"></div>
      }>
        <MarketplaceProductSorting {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

// VirtualizedProductGridLazy
export function VirtualizedProductGridLazy(props: React.ComponentProps<typeof VirtualizedProductGrid>) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <Suspense fallback={
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <div className="h-48 w-full bg-gray-200 animate-pulse rounded-lg"></div>
              <div className="h-5 w-3/4 bg-gray-200 animate-pulse rounded"></div>
              <div className="h-4 w-1/2 bg-gray-200 animate-pulse rounded"></div>
              <div className="flex justify-between items-center">
                <div className="h-6 w-24 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-8 w-8 bg-gray-200 animate-pulse rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      }>
        <VirtualizedProductGrid {...props} />
      </Suspense>
    </ErrorBoundary>
  );
}

// Preload functions
export const preloadMarketplaceComponents = () => {
  preloadProductQuickViewModal();
  preloadProductComparisonTool();
  preloadAdvancedFilters();
};

export default {
  MarketplaceProductComparisonLazy,
  MarketplaceAdvancedFiltersLazy,
  MarketplaceProductSortingLazy,
  VirtualizedProductGridLazy,
  preloadMarketplaceComponents
};
