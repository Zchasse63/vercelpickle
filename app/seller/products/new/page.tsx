import { SellerAddProductForm } from "@/components/seller/seller-add-product-form"

export default function SellerAddProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Product</h1>
        <p className="text-muted-foreground">Create a new product listing for your store</p>
      </div>
      <SellerAddProductForm />
    </div>
  )
}
