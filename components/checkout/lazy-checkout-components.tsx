"use client"

import { Suspense } from "react"
import { lazyImport } from "@/lib/lazy-import"
import { Skeleton } from "@/components/ui/skeleton"

// Lazy loaded checkout components
export const LazyCheckoutShippingStep = lazyImport(
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
    )
  }
)

export const LazyCheckoutPaymentStep = lazyImport(
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
    )
  }
)

export const LazyCheckoutReviewStep = lazyImport(
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
    )
  }
)

export const LazyCheckoutOrderSummary = lazyImport(
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
    )
  }
)

export const LazyCheckoutConfirmation = lazyImport(
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
    )
  }
)

// Wrapper components with Suspense
export function CheckoutShippingStepLazy(props: any) {
  return (
    <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
      <LazyCheckoutShippingStep {...props} />
    </Suspense>
  )
}

export function CheckoutPaymentStepLazy(props: any) {
  return (
    <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
      <LazyCheckoutPaymentStep {...props} />
    </Suspense>
  )
}

export function CheckoutReviewStepLazy(props: any) {
  return (
    <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
      <LazyCheckoutReviewStep {...props} />
    </Suspense>
  )
}

export function CheckoutOrderSummaryLazy(props: any) {
  return (
    <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
      <LazyCheckoutOrderSummary {...props} />
    </Suspense>
  )
}

export function CheckoutConfirmationLazy(props: any) {
  return (
    <Suspense fallback={<Skeleton className="h-[400px] w-full" />}>
      <LazyCheckoutConfirmation {...props} />
    </Suspense>
  )
}
