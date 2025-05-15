import type { Metadata } from "next"
import { NegotiationClient } from "@/components/marketplace/transactions/negotiation-client"

export const metadata: Metadata = {
  title: "Negotiation | Pickle B2B Marketplace",
  description: "Negotiate with sellers on price, quantity, and delivery terms",
}

export default function NegotiationPage() {
  return <NegotiationClient />
}
