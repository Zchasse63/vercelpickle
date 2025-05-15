import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface SellerOrderDetailsProps {
  orderId: string
}

export function SellerOrderDetails({ orderId }: SellerOrderDetailsProps) {
  // This would typically come from your data fetching logic
  const order = {
    id: orderId,
    customer: "Acme Restaurant",
    email: "orders@acmerestaurant.com",
    phone: "(555) 123-4567",
    date: "May 15, 2023",
    status: "Processing",
    paymentMethod: "Credit Card (Visa ****1234)",
    paymentStatus: "Paid",
    shippingAddress: {
      name: "Acme Restaurant",
      street: "123 Main Street",
      city: "Foodville",
      state: "CA",
      zip: "90210",
      country: "United States",
    },
    billingAddress: {
      name: "Acme Restaurant",
      street: "123 Main Street",
      city: "Foodville",
      state: "CA",
      zip: "90210",
      country: "United States",
    },
  }

  return (
    <Card data-testid="order-details">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Order Information</CardTitle>
        <Badge
          variant={
            order.status === "Delivered"
              ? "success"
              : order.status === "Shipped"
                ? "default"
                : order.status === "Processing"
                  ? "outline"
                  : order.status === "Pending"
                    ? "secondary"
                    : "destructive"
          }
          data-testid="order-status"
        >
          {order.status}
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 sm:grid-cols-2">
          <div data-testid="buyer-info">
            <h3 className="mb-2 text-sm font-medium">Customer Information</h3>
            <div className="space-y-1 text-sm">
              <p className="font-medium">{order.customer}</p>
              <p>{order.email}</p>
              <p>{order.phone}</p>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium">Order Details</h3>
            <div className="space-y-1 text-sm">
              <p>
                <span className="font-medium">Order ID:</span> <span data-testid="order-id">{order.id}</span>
              </p>
              <p>
                <span className="font-medium">Order Date:</span> {order.date}
              </p>
              <p>
                <span className="font-medium">Payment Method:</span> {order.paymentMethod}
              </p>
              <p>
                <span className="font-medium">Payment Status:</span>{" "}
                <Badge variant={order.paymentStatus === "Paid" ? "success" : "outline"}>{order.paymentStatus}</Badge>
              </p>
            </div>
          </div>
          <div data-testid="shipping-address">
            <h3 className="mb-2 text-sm font-medium">Shipping Address</h3>
            <div className="space-y-1 text-sm">
              <p>{order.shippingAddress.name}</p>
              <p>{order.shippingAddress.street}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium">Billing Address</h3>
            <div className="space-y-1 text-sm">
              <p>{order.billingAddress.name}</p>
              <p>{order.billingAddress.street}</p>
              <p>
                {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}
              </p>
              <p>{order.billingAddress.country}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
