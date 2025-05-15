import Image from "next/image"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

interface SellerOrderItemsProps {
  orderId: string
}

export function SellerOrderItems({ orderId }: SellerOrderItemsProps) {
  // This would typically come from your data fetching logic
  const orderItems = [
    {
      id: 1,
      name: "Organic Carrots (5lb)",
      image: "/bunch-of-carrots.png",
      price: "$4.99",
      quantity: 2,
      total: "$9.98",
    },
    {
      id: 2,
      name: "Fresh Milk (1 Gallon)",
      image: "/glass-of-milk.png",
      price: "$5.49",
      quantity: 3,
      total: "$16.47",
    },
    {
      id: 3,
      name: "Artisan Bread Loaf",
      image: "/assorted-breads.png",
      price: "$3.99",
      quantity: 4,
      total: "$15.96",
    },
  ]

  const orderSummary = {
    subtotal: "$42.41",
    shipping: "$8.99",
    tax: "$4.24",
    total: "$55.64",
  }

  return (
    <Card data-testid="order-items">
      <CardHeader>
        <CardTitle>Order Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Table data-testid="order-items-table">
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">Quantity</TableHead>
              <TableHead className="text-right">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-md">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <span className="font-medium">{item.name}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{item.price}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-right">{item.total}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Separator className="my-4" />
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal</span>
            <span>{orderSummary.subtotal}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Shipping</span>
            <span>{orderSummary.shipping}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Tax</span>
            <span>{orderSummary.tax}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{orderSummary.total}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
