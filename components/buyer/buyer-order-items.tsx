import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface OrderItem {
  id: string
  name: string
  image: string
  price: string
  quantity: number
  total: string
}

interface OrderItemsProps {
  items: OrderItem[]
}

export function BuyerOrderItems({ items }: OrderItemsProps) {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Image</TableHead>
            <TableHead>Product</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-right">Quantity</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <img
                  src={item.image || "/placeholder.svg"}
                  alt={item.name}
                  className="h-16 w-16 rounded-md object-cover"
                />
              </TableCell>
              <TableCell className="font-medium">{item.name}</TableCell>
              <TableCell className="text-right">{item.price}</TableCell>
              <TableCell className="text-right">{item.quantity}</TableCell>
              <TableCell className="text-right">{item.total}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`/marketplace/products/${item.id.toLowerCase()}`}>
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm">
                    Buy Again
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
