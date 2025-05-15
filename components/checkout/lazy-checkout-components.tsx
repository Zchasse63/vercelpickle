"use client"

import { lazyImport, preloadComponent } from "@/lib/lazy-import"
import { Skeleton } from "@/components/ui/skeleton"

/**
 * Lazy-loaded checkout components with proper error handling and loading states
 * These components will only be loaded when they are actually rendered in the UI
 */

// Checkout Shipping Step
export const CheckoutShippingStep = lazyImport(
  () => import("@/components/checkout/checkout-shipping-step"),
  "CheckoutShippingStep",
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex justify-end mt-6">
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    ),
    errorComponent: (error, retry) => (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load shipping step
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error.message || "An unexpected error occurred while loading the shipping step"}
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
      console.error("Error loading CheckoutShippingStep:", error)
    }
  }
)

// Checkout Payment Step
export const CheckoutPaymentStep = lazyImport(
  () => import("@/components/checkout/checkout-payment-step"),
  "CheckoutPaymentStep",
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex justify-between mt-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    ),
    errorComponent: (error, retry) => (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load payment step
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error.message || "An unexpected error occurred while loading the payment step"}
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
      console.error("Error loading CheckoutPaymentStep:", error)
    }
  }
)

// Checkout Review Step
export const CheckoutReviewStep = lazyImport(
  () => import("@/components/checkout/checkout-review-step"),
  "CheckoutReviewStep",
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-48 mb-6" />
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <div className="flex justify-between mt-6">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    ),
    errorComponent: (error, retry) => (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load review step
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error.message || "An unexpected error occurred while loading the review step"}
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
      console.error("Error loading CheckoutReviewStep:", error)
    }
  }
)

// Checkout Order Summary
export const CheckoutOrderSummary = lazyImport(
  () => import("@/components/checkout/checkout-order-summary"),
  "CheckoutOrderSummary",
  {
    ssr: false,
    loading: () => (
      <div className="space-y-4 border rounded-lg p-4">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
        <Skeleton className="h-px w-full my-4" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>
        <Skeleton className="h-px w-full my-4" />
        <div className="flex justify-between">
          <Skeleton className="h-6 w-24" />
          <Skeleton className="h-6 w-20" />
        </div>
      </div>
    ),
    errorComponent: (error, retry) => (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load order summary
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error.message || "An unexpected error occurred while loading the order summary"}
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
      console.error("Error loading CheckoutOrderSummary:", error)
    }
  }
)

// Checkout Confirmation
export const CheckoutConfirmation = lazyImport(
  () => import("@/components/checkout/checkout-confirmation"),
  "CheckoutConfirmation",
  {
    ssr: false,
    loading: () => (
      <div className="space-y-6 text-center">
        <Skeleton className="h-16 w-16 rounded-full mx-auto" />
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
        <div className="space-y-2 max-w-md mx-auto">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4 mx-auto" />
        </div>
        <Skeleton className="h-10 w-48 mx-auto mt-6" />
      </div>
    ),
    errorComponent: (error, retry) => (
      <div className="p-6 rounded-lg border border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300 mb-2">
          Failed to load confirmation
        </h3>
        <p className="text-red-600 dark:text-red-400 mb-4">
          {error.message || "An unexpected error occurred while loading the confirmation page"}
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
      console.error("Error loading CheckoutConfirmation:", error)
    }
  }
)

/**
 * Preload functions for checkout components
 * These can be called before the components are needed to improve perceived performance
 */
export function preloadCheckoutShippingStep() {
  preloadComponent(() => import("@/components/checkout/checkout-shipping-step"), "CheckoutShippingStep")
}

export function preloadCheckoutPaymentStep() {
  preloadComponent(() => import("@/components/checkout/checkout-payment-step"), "CheckoutPaymentStep")
}

export function preloadCheckoutReviewStep() {
  preloadComponent(() => import("@/components/checkout/checkout-review-step"), "CheckoutReviewStep")
}

export function preloadCheckoutOrderSummary() {
  preloadComponent(() => import("@/components/checkout/checkout-order-summary"), "CheckoutOrderSummary")
}

export function preloadCheckoutConfirmation() {
  preloadComponent(() => import("@/components/checkout/checkout-confirmation"), "CheckoutConfirmation")
}
