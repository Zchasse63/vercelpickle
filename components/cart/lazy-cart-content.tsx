"use client";

import { lazyImport } from "@/lib/lazy-import";
import { CartSkeleton } from "./cart-skeleton";

export const LazyCartContent = lazyImport(
  () => import("./cart-content"),
  "CartContent",
  {
    ssr: false,
    loading: () => <CartSkeleton />,
    errorComponent: (error, retry) => (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load cart
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error.message || "An unexpected error occurred while loading your cart"}
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
      console.error("Error loading cart content:", error);
    }
  }
);

export function preloadCartContent() {
  return import("./cart-content").then(mod => mod.CartContent);
}
