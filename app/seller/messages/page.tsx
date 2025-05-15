import { DirectMessaging } from "@/components/seller/direct-messaging"

export default function MessagesPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Direct Messages</h2>
      <p className="text-muted-foreground">
        Communicate directly with buyers and partners
      </p>
      <DirectMessaging />
    </div>
  )
}
