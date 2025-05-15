"use client"

import { Card } from "@/components/ui/card"
import { BuyerPaymentMethodManager } from "@/components/buyer/buyer-payment-method-manager"

export default function PaymentMethodsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Payment Methods</h1>
        <p className="text-gray-500">Manage your payment methods for purchases.</p>
      </div>

      <Card className="p-6">
        <BuyerPaymentMethodManager testId="payment-methods" />
      </Card>
    </div>
  )
}
