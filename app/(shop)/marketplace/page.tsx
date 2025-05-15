import type { Metadata } from "next"
import { Suspense } from "react"
import { queryConvex } from "@/lib/convex-server"
import { MarketplaceInteractiveClient } from "@/components/marketplace/marketplace-interactive-client"
import { ServerProductCard } from "@/components/marketplace/server-product-card"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Marketplace | Pickle B2B Marketplace",
  description: "Browse our wide selection of quality food products",
}

export default async function MarketplacePage() {
  // Fetch initial products on the server
  const initialProducts = await queryConvex("products.getAll", {
    sortBy: "createdAt",
    sortOrder: "desc",
    limit: 20
  });

  // Fetch categories for filters
  const categories = await queryConvex("categories.getAll", {});

  return (
    <div className="w-full py-8 md:py-12">
      <div className="flex flex-col gap-2 max-w-[1920px] mx-auto px-8" data-testid="marketplace-header">
        <h1 className="text-3xl font-bold tracking-tight text-dill-green">All Products</h1>
        <p className="text-muted-foreground">
          Browse our wide selection of quality food products from trusted suppliers.
        </p>
      </div>

      {/* Server-rendered initial product grid */}
      <div className="mt-8 max-w-[1920px] mx-auto px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
          {initialProducts.slice(0, 10).map((product) => (
            <ServerProductCard
              key={product._id}
              id={product._id}
              name={product.name}
              price={product.price}
              image={product.images?.[0] || "/placeholder-product.jpg"}
              unit={product.unit || "each"}
              specifications={product.specifications}
            />
          ))}
        </div>
      </div>

      {/* Client-side interactive marketplace with filters, sorting, etc. */}
      <Suspense fallback={
        <div className="mt-8 max-w-[1920px] mx-auto px-8">
          <Skeleton className="h-[600px] w-full" />
        </div>
      }>
        <MarketplaceInteractiveClient
          initialProducts={initialProducts}
          categories={categories}
        />
      </Suspense>
    </div>
  )
}
