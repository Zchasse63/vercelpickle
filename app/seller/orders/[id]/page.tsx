import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { use } from "react"

import { Button } from "@/components/ui/button"
import { SellerOrderDetails } from "@/components/seller/seller-order-details"
import { SellerOrderItems } from "@/components/seller/seller-order-items"
import { SellerOrderTimeline } from "@/components/seller/seller-order-timeline"
import { SellerOrderActions } from "@/components/seller/seller-order-actions"

export default function SellerOrderDetailPage({
  params,
}: {
  params: { id: string }
}) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/seller/orders">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to orders</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Order {id}</h1>
          <p className="text-muted-foreground">View and manage order details</p>
        </div>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <SellerOrderDetails orderId={params.id} />
          <SellerOrderItems orderId={params.id} />
        </div>
        <div className="space-y-6">
          <SellerOrderActions orderId={params.id} />
          <SellerOrderTimeline orderId={params.id} />
        </div>
      </div>
    </div>
  )
}
