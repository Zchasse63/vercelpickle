import type { Metadata } from "next"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { MarketplaceCheckoutForm } from "@/components/marketplace/marketplace-checkout-form"
import { MarketplaceOrderSummary } from "@/components/marketplace/marketplace-order-summary"

export const metadata: Metadata = {
  title: "Checkout | Pickle B2B Marketplace",
  description: "Complete your purchase",
}

export default function CheckoutPage() {
  return (
    <div className="container px-4 py-8 md:px-6 md:py-12" data-testid="checkout-page">
      <div className="mb-6" data-testid="checkout-header">
        <Button variant="ghost" size="sm" asChild className="mb-2" data-testid="continue-shopping-button">
          <Link href="/marketplace">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight text-dill-green">Checkout</h1>
      </div>
      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <MarketplaceCheckoutForm />
        <div className="lg:sticky lg:top-24" data-testid="order-summary-container">
          <MarketplaceOrderSummary />
        </div>
      </div>
    </div>
  )
}
