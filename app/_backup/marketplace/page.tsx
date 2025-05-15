import type { Metadata } from "next"
import MarketplaceClientPage from "./client-page"

export const metadata: Metadata = {
  title: "Marketplace | Pickle B2B Marketplace",
  description: "Browse our wide selection of quality food products",
}

export default function MarketplacePage() {
  return <MarketplaceClientPage />
}
