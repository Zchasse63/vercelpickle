import type { Metadata } from "next"
import { CommunicationClient } from "@/components/marketplace/communication/communication-client"

export const metadata: Metadata = {
  title: "Communication | Pickle B2B Marketplace",
  description: "Communicate with sellers and manage notifications",
}

export default function CommunicationPage() {
  return <CommunicationClient />
}
