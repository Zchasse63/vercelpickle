"use client"

import { useState, useEffect, Suspense } from "react"
import { useGlobalState } from "@/hooks/use-global-state"
import { MarketplaceHeader } from "@/components/marketplace/marketplace-header"
import { CheckoutLayout, CheckoutSteps } from "@/components/checkout"
import { Skeleton } from "@/components/ui/skeleton"
import {
  CheckoutShippingStepLazy,
  CheckoutPaymentStepLazy,
  CheckoutReviewStepLazy,
  CheckoutOrderSummaryLazy
} from "@/components/checkout/lazy-checkout-components"

export default function CheckoutPage() {
  // Get global state
  const { checkout, setCheckoutStep } = useGlobalState()

  // Set the current step
  const [currentStep, setCurrentStep] = useState(checkout.step)

  // Update global state when current step changes
  useEffect(() => {
    setCheckoutStep(currentStep)
  }, [currentStep, setCheckoutStep])

  // Handle next step
  const handleNextStep = () => {
    if (currentStep === "shipping") {
      setCurrentStep("payment")
    } else if (currentStep === "payment") {
      setCurrentStep("review")
    }
  }

  // Handle previous step
  const handlePreviousStep = () => {
    if (currentStep === "payment") {
      setCurrentStep("shipping")
    } else if (currentStep === "review") {
      setCurrentStep("payment")
    }
  }

  return (
    <>
      <MarketplaceHeader />
      <CheckoutLayout
        title="Checkout"
        description="Complete your purchase"
        testId="checkout-page"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CheckoutSteps
              currentStep={currentStep}
              testId="checkout-steps"
            />

            {currentStep === "shipping" && (
              <CheckoutShippingStepLazy
                onNext={handleNextStep}
                testId="checkout-shipping-step"
              />
            )}

            {currentStep === "payment" && (
              <CheckoutPaymentStepLazy
                onNext={handleNextStep}
                onBack={handlePreviousStep}
                testId="checkout-payment-step"
              />
            )}

            {currentStep === "review" && (
              <CheckoutReviewStepLazy
                onBack={handlePreviousStep}
                testId="checkout-review-step"
              />
            )}
          </div>

          <div>
            <CheckoutOrderSummaryLazy
              testId="checkout-order-summary"
            />
          </div>
        </div>
      </CheckoutLayout>
    </>
  )
}
