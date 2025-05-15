import { SellerInventoryTable } from "@/components/seller/seller-inventory-table"

export default function SellerInventoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <p className="text-muted-foreground">Track and manage your product inventory</p>
      </div>
      <SellerInventoryTable />
    </div>
  )
}
