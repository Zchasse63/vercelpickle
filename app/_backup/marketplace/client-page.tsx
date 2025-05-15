"use client";

import { MarketplaceProductsClient } from "@/components/marketplace/marketplace-products-client";
import { MarketplaceConvexProvider } from "@/components/marketplace/marketplace-convex-provider";

export default function MarketplaceClientPage() {
  return (
    <MarketplaceConvexProvider>
      <MarketplaceProductsClient />
    </MarketplaceConvexProvider>
  );
}
