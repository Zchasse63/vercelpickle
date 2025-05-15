import { SellerOrdersTable } from "@/components/seller/seller-orders-table"

export default function SellerOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Orders</h1>
        <p className="text-muted-foreground">Manage and fulfill customer orders</p>
      </div>
      <SellerOrdersTable />
    </div>
  )
}
