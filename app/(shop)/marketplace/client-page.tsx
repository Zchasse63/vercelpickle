"use client"

import { Suspense } from "react"
import { MarketplaceProductsClient } from "@/components/marketplace/marketplace-products-client"
import { Skeleton } from "@/components/ui/skeleton"

export default function MarketplaceClientPage() {
  return (
    <Suspense fallback={
      <div className="w-full py-8 md:py-12">
        <div className="flex flex-col gap-2 max-w-[1920px] mx-auto px-8">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96 mb-6" />
        </div>
        <div className="mt-8 max-w-[1920px] mx-auto px-8">
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    }>
      <MarketplaceProductsClient />
    </Suspense>
  )
}
