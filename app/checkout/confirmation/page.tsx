"use client"

import { MarketplaceHeader } from "@/components/marketplace/marketplace-header"
import { CheckoutLayout, CheckoutConfirmation } from "@/components/checkout"

export default function ConfirmationPage() {
  return (
    <>
      <MarketplaceHeader />
      <CheckoutLayout
        title="Order Confirmation"
        description="Thank you for your order"
        showBackButton={false}
        testId="confirmation-page"
      >
        <CheckoutConfirmation testId="checkout-confirmation" />
      </CheckoutLayout>
    </>
  )
}
