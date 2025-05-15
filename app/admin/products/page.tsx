import { ProductsTable } from "@/components/admin/products-table"

export default function AdminProductsPage() {
  return (
    <main className="flex flex-col gap-4" data-testid="admin-products-page">
      <div data-testid="admin-header">
        <h1 className="text-2xl font-bold tracking-tight">Product Management</h1>
        <p className="text-muted-foreground">View and manage all products on the platform.</p>
      </div>

      <ProductsTable />
    </main>
  )
}
