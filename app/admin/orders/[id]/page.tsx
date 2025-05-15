import Link from "next/link"
import { ArrowLeft, Download, Printer } from "lucide-react"
import { use } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { OrderStatusBadge } from "@/components/admin/order-status-badge"
import { OrderTimeline } from "@/components/admin/order-timeline"
import { OrderItems } from "@/components/admin/order-items"

// Mock data for a single order
const orderData = {
  id: "ORD-7652",
  customer: "Fresh Foods Market",
  customerEmail: "orders@freshfoods.com",
  customerPhone: "+1 (555) 123-4567",
  date: "2023-06-12T09:22:31",
  amount: 125.5,
  status: "completed",
  items: [
    {
      id: "PROD-001",
      name: "Organic Apples (5lb)",
      price: 12.99,
      quantity: 2,
      total: 25.98,
      image: "/placeholder.svg?key=fsex9",
    },
    {
      id: "PROD-002",
      name: "Fresh Broccoli (2lb)",
      price: 4.99,
      quantity: 3,
      total: 14.97,
      image: "/placeholder.svg?key=goz6z",
    },
    {
      id: "PROD-003",
      name: "Grass-Fed Ground Beef",
      price: 8.99,
      quantity: 5,
      total: 44.95,
      image: "/placeholder.svg?key=r74ly",
    },
    {
      id: "PROD-004",
      name: "Organic Whole Milk",
      price: 5.99,
      quantity: 2,
      total: 11.98,
      image: "/placeholder.svg?key=46an0",
    },
    {
      id: "PROD-005",
      name: "Sourdough Bread",
      price: 6.99,
      quantity: 4,
      total: 27.96,
      image: "/placeholder.svg?key=vibzj",
    },
  ],
  seller: "Organic Farms Co.",
  sellerEmail: "sales@organicfarms.com",
  sellerPhone: "+1 (555) 987-6543",
  shippingAddress: {
    street: "123 Market Street",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    country: "USA",
  },
  billingAddress: {
    street: "123 Market Street",
    city: "San Francisco",
    state: "CA",
    zip: "94105",
    country: "USA",
  },
  paymentMethod: "Credit Card",
  paymentDetails: "VISA ending in 4242",
  subtotal: 125.84,
  tax: 10.47,
  shipping: 15.0,
  discount: 25.81,
  total: 125.5,
  notes: "Please deliver to the back entrance.",
  timeline: [
    {
      status: "Order Placed",
      date: "2023-06-12T09:22:31",
      description: "Order was placed by customer",
    },
    {
      status: "Payment Confirmed",
      date: "2023-06-12T09:25:18",
      description: "Payment was confirmed",
    },
    {
      status: "Processing",
      date: "2023-06-12T10:15:42",
      description: "Order is being processed by seller",
    },
    {
      status: "Shipped",
      date: "2023-06-13T14:30:15",
      description: "Order has been shipped via Express Delivery",
    },
    {
      status: "Delivered",
      date: "2023-06-14T11:45:22",
      description: "Order was delivered successfully",
    },
  ],
}

export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  // Unwrap params using React.use()
  const unwrappedParams = use(params);
  const id = unwrappedParams.id;

  // In a real app, you would fetch the order data based on the ID
  const order = orderData

  return (
    <main className="flex flex-col gap-6" data-testid="order-details">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/orders">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to orders</span>
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight" data-testid="order-id">Order {order.id}</h1>
            <p className="text-muted-foreground">
              Placed on {new Date(order.date).toLocaleDateString()} at {new Date(order.date).toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm" data-testid="generate-invoice-button">
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
          <OrderStatusBadge status={order.status} data-testid="order-status" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <div className="font-medium">{order.customer}</div>
              <div className="text-sm text-muted-foreground">{order.customerEmail}</div>
              <div className="text-sm text-muted-foreground">{order.customerPhone}</div>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              <div>
                <div className="text-sm font-medium">Shipping Address</div>
                <div className="text-sm text-muted-foreground">{order.shippingAddress.street}</div>
                <div className="text-sm text-muted-foreground">
                  {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
                </div>
                <div className="text-sm text-muted-foreground">{order.shippingAddress.country}</div>
              </div>
              <div>
                <div className="text-sm font-medium">Billing Address</div>
                <div className="text-sm text-muted-foreground">{order.billingAddress.street}</div>
                <div className="text-sm text-muted-foreground">
                  {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}
                </div>
                <div className="text-sm text-muted-foreground">{order.billingAddress.country}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seller Information</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div>
              <div className="font-medium">{order.seller}</div>
              <div className="text-sm text-muted-foreground">{order.sellerEmail}</div>
              <div className="text-sm text-muted-foreground">{order.sellerPhone}</div>
            </div>
            <div>
              <div className="text-sm font-medium">Payment Information</div>
              <div className="text-sm text-muted-foreground">{order.paymentMethod}</div>
              <div className="text-sm text-muted-foreground">{order.paymentDetails}</div>
            </div>
            {order.notes && (
              <div>
                <div className="text-sm font-medium">Order Notes</div>
                <div className="text-sm text-muted-foreground">{order.notes}</div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Order Items</CardTitle>
          <CardDescription>{order.items.length} items in this order</CardDescription>
        </CardHeader>
        <CardContent>
          <OrderItems items={order.items} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Order Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <OrderTimeline timeline={order.timeline} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <div>Subtotal</div>
                <div>${order.subtotal.toFixed(2)}</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>Tax</div>
                <div>${order.tax.toFixed(2)}</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>Shipping</div>
                <div>${order.shipping.toFixed(2)}</div>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>Discount</div>
                <div>-${order.discount.toFixed(2)}</div>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-medium">
                <div>Total</div>
                <div>${order.total.toFixed(2)}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Invoice Preview - Hidden by default, shown when generate-invoice-button is clicked */}
      <Card className="hidden" data-testid="invoice-preview">
        <CardHeader>
          <CardTitle>Invoice Preview</CardTitle>
          <CardDescription>Invoice #{order.id}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md p-6 space-y-6">
            <div className="flex justify-between">
              <div>
                <h3 className="text-xl font-bold">INVOICE</h3>
                <p className="text-muted-foreground">#{order.id}</p>
              </div>
              <div className="text-right">
                <p className="font-medium">Pickle Marketplace</p>
                <p className="text-sm text-muted-foreground">123 Market Street</p>
                <p className="text-sm text-muted-foreground">San Francisco, CA 94105</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-sm font-medium">Bill To:</p>
                <p className="text-sm">{order.customer}</p>
                <p className="text-sm text-muted-foreground">{order.billingAddress.street}</p>
                <p className="text-sm text-muted-foreground">
                  {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}
                </p>
                <p className="text-sm text-muted-foreground">{order.billingAddress.country}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">Invoice Date:</p>
                <p className="text-sm">{new Date(order.date).toLocaleDateString()}</p>
                <p className="text-sm font-medium mt-2">Payment Method:</p>
                <p className="text-sm">{order.paymentMethod}</p>
              </div>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Item</th>
                  <th className="py-2 text-right">Quantity</th>
                  <th className="py-2 text-right">Price</th>
                  <th className="py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b">
                    <td className="py-2 text-left">{item.name}</td>
                    <td className="py-2 text-right">{item.quantity}</td>
                    <td className="py-2 text-right">${item.price.toFixed(2)}</td>
                    <td className="py-2 text-right">${item.total.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-end">
              <div className="w-1/3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal:</span>
                  <span>${order.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>${order.tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping:</span>
                  <span>${order.shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Discount:</span>
                  <span>-${order.discount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium border-t pt-2">
                  <span>Total:</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="text-center text-sm text-muted-foreground pt-6">
              <p>Thank you for your business!</p>
              <p>If you have any questions, please contact support@pickle.com</p>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <Button data-testid="download-invoice-button">
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
