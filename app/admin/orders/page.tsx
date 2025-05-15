import { OrdersTable } from "@/components/admin/orders-table"

export default function AdminOrdersPage() {
  return (
    <main className="flex flex-col gap-4" data-testid="admin-orders-page">
      <div data-testid="admin-header">
        <h1 className="text-2xl font-bold tracking-tight">Order Management</h1>
        <p className="text-muted-foreground">View and manage all orders on the platform.</p>
      </div>

      <OrdersTable />
    </main>
  )
}
