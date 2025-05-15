import Image from "next/image"
import Link from "next/link"

interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  total: number
  image: string
}

export function OrderItems({ items }: { items: OrderItem[] }) {
  return (
    <div className="space-y-4" data-testid="order-items">
      <div className="grid grid-cols-12 gap-4 text-xs font-medium text-muted-foreground">
        <div className="col-span-6">Product</div>
        <div className="col-span-2 text-right">Price</div>
        <div className="col-span-2 text-right">Quantity</div>
        <div className="col-span-2 text-right">Total</div>
      </div>
      <div className="divide-y">
        {items.map((item) => (
          <div key={item.id} className="grid grid-cols-12 gap-4 py-4" data-testid="order-item">
            <div className="col-span-6 flex items-center gap-4">
              <div className="relative h-16 w-16 overflow-hidden rounded-md border">
                <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
              </div>
              <div>
                <Link href={`/admin/products/${item.id}`} className="font-medium hover:underline" data-testid="product-link">
                  {item.name}
                </Link>
                <div className="text-sm text-muted-foreground">SKU: {item.id}</div>
              </div>
            </div>
            <div className="col-span-2 flex items-center justify-end" data-testid="item-price">${item.price.toFixed(2)}</div>
            <div className="col-span-2 flex items-center justify-end" data-testid="item-quantity">{item.quantity}</div>
            <div className="col-span-2 flex items-center justify-end font-medium" data-testid="item-total">${item.total.toFixed(2)}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
