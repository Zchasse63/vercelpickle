import { CheckCircle, Clock, Package, ShoppingCart, Truck } from "lucide-react"

interface TimelineItem {
  status: string
  date: string
  description: string
}

interface OrderTimelineProps {
  timeline: TimelineItem[]
}

export function BuyerOrderTimeline({ timeline }: OrderTimelineProps) {
  const getIcon = (status: string) => {
    switch (status) {
      case "Order Placed":
        return <ShoppingCart className="h-6 w-6 text-green-500" />
      case "Payment Confirmed":
        return <CheckCircle className="h-6 w-6 text-green-500" />
      case "Processing":
        return <Clock className="h-6 w-6 text-yellow-500" />
      case "Shipped":
        return <Truck className="h-6 w-6 text-blue-500" />
      case "Delivered":
        return <Package className="h-6 w-6 text-green-500" />
      default:
        return <Clock className="h-6 w-6 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {timeline.map((item, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
              {getIcon(item.status)}
            </div>
            {index < timeline.length - 1 && <div className="h-full w-0.5 bg-gray-200" />}
          </div>
          <div className="flex flex-col pb-6">
            <div className="flex flex-col gap-1">
              <h3 className="font-medium">{item.status}</h3>
              <p className="text-sm text-gray-500">{item.date}</p>
            </div>
            <p className="mt-2 text-sm text-gray-600">{item.description}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
