import { SafeLink } from "@/components/ui/safe-link"
import { Badge } from "@/components/ui/badge"
import { SafeButton } from "@/components/ui/safe-button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const recentOrders = [
  {
    id: "ORD-1234",
    date: "2023-05-01",
    status: "Delivered",
    total: "$245.50",
    items: 5,
    seller: "Farm Fresh Produce",
  },
  {
    id: "ORD-1235",
    date: "2023-05-03",
    status: "Processing",
    total: "$125.00",
    items: 3,
    seller: "Organic Dairy Co.",
  },
  {
    id: "ORD-1236",
    date: "2023-05-05",
    status: "Shipped",
    total: "$78.25",
    items: 2,
    seller: "Artisan Bakery",
  },
  {
    id: "ORD-1237",
    date: "2023-05-07",
    status: "Pending",
    total: "$320.75",
    items: 7,
    seller: "Premium Meats",
  },
  {
    id: "ORD-1238",
    date: "2023-05-10",
    status: "Delivered",
    total: "$95.00",
    items: 4,
    seller: "Farm Fresh Produce",
  },
]

export function BuyerRecentOrders() {
  return (
    <div className="space-y-4" data-testid="recent-orders">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="hidden md:table-cell">Seller</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {recentOrders.map((order) => (
            <TableRow key={order.id} data-testid="order-row">
              <TableCell className="font-medium" data-testid="order-id">{order.id}</TableCell>
              <TableCell data-testid="order-date">{order.date}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    order.status === "Delivered"
                      ? "success"
                      : order.status === "Shipped"
                        ? "default"
                        : order.status === "Processing"
                          ? "outline"
                          : "secondary"
                  }
                  data-testid="order-status"
                >
                  {order.status}
                </Badge>
              </TableCell>
              <TableCell data-testid="order-total">{order.total}</TableCell>
              <TableCell className="hidden md:table-cell" data-testid="order-seller">{order.seller}</TableCell>
              <TableCell className="text-right">
                <SafeButton variant="ghost" size="sm" asChild>
                  <SafeLink href={`/buyer/orders/${order.id.toLowerCase()}`} data-testid="view-order-button">
                    View
                  </SafeLink>
                </SafeButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex justify-end">
        <SafeButton variant="outline" asChild>
          <SafeLink href="/buyer/orders" data-testid="view-all-orders-button">
            View All Orders
          </SafeLink>
        </SafeButton>
      </div>
    </div>
  )
}
