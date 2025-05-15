import { Separator } from "@/components/ui/separator"

interface OrderSummaryProps {
  order: {
    subtotal: string
    shipping: string
    tax: string
    total: string
  }
}

export function BuyerOrderSummary({ order }: OrderSummaryProps) {
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <span className="text-gray-500">Subtotal</span>
        <span>{order.subtotal}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Shipping</span>
        <span>{order.shipping}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-500">Tax</span>
        <span>{order.tax}</span>
      </div>
      <Separator />
      <div className="flex justify-between font-medium">
        <span>Total</span>
        <span>{order.total}</span>
      </div>
    </div>
  )
}
