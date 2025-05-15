import type { Metadata } from "next"
import { LogisticsCoordinationClient } from "@/components/marketplace/logistics/logistics-coordination-client"

export const metadata: Metadata = {
  title: "Logistics Coordination | Pickle B2B Marketplace",
  description: "Coordinate logistics for your orders",
}

export default function LogisticsCoordinationPage() {
  return <LogisticsCoordinationClient />
}
