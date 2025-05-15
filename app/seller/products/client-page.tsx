"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SellerProductsTable } from "@/components/seller/seller-products-table";

export default function SellerProductsClientPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-muted-foreground">Manage your product catalog</p>
        </div>
        <Button asChild data-testid="add-product-button">
          <Link href="/seller/products/new" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Link>
        </Button>
      </div>
      <SellerProductsTable />
    </div>
  );
}
