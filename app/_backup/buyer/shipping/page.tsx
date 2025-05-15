"use client"

import { Card } from "@/components/ui/card"
import { BuyerAddressManager } from "@/components/buyer/buyer-address-manager"

export default function ShippingAddressesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Shipping Addresses</h1>
        <p className="text-gray-500">Manage your shipping addresses for deliveries.</p>
      </div>

      <Card className="p-6">
        <BuyerAddressManager testId="shipping-addresses" />
      </Card>
    </div>
  )
}
